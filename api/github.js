// In-memory cache
let cache = {
    data: null,
    timestamp: null,
    etag: null
};

// Cache duration in milliseconds (15 minutes)
const CACHE_DURATION = 15 * 60 * 1000;

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    // Check if we have valid cached data
    const now = Date.now();
    const isCacheValid = cache.data && cache.timestamp && (now - cache.timestamp) < CACHE_DURATION;

    if (isCacheValid) {
        console.log('Serving from cache');
        return res.status(200).json({
            ...cache.data,
            cached: true,
            cacheAge: Math.floor((now - cache.timestamp) / 1000)
        });
    }

    try {
        const username = 'frostplexx'; // Your GitHub username

        // GitHub GraphQL query to get pinned repositories
        const query = `
      query {
        user(login: "${username}") {
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                name
                description
                url
                updatedAt
                createdAt
                primaryLanguage {
                  name
                  color
                }
                languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
                  nodes {
                    name
                    color
                  }
                }
                repositoryTopics(first: 10) {
                  nodes {
                    topic {
                      name
                    }
                  }
                }
                isArchived
                stargazerCount
                forkCount
              }
            }
          }
        }
      }
    `;

        // Prepare headers for GitHub API request
        const headers = {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
            'User-Agent': 'dinama-web-portfolio'
        };

        // Add conditional request headers if we have cached etag
        if (cache.etag) {
            headers['If-None-Match'] = cache.etag;
        }

        console.log('Fetching from GitHub API');
        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers,
            body: JSON.stringify({ query })
        });

        // If GitHub returns 304 Not Modified, use cached data
        if (response.status === 304) {
            console.log('GitHub returned 304 - using cached data');
            cache.timestamp = now; // Refresh cache timestamp
            return res.status(200).json({
                ...cache.data,
                cached: true,
                notModified: true
            });
        }

        if (!response.ok) {
            // If we have cached data and API fails, serve stale cache
            if (cache.data) {
                console.log('API failed, serving stale cache');
                return res.status(200).json({
                    ...cache.data,
                    cached: true,
                    stale: true,
                    warning: 'Serving cached data due to API failure'
                });
            }
            throw new Error(`GitHub API error: ${response.status}`);
        }

        // Store new etag for future conditional requests
        const newEtag = response.headers.get('etag');

        const data = await response.json();

        if (data.errors) {
            throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
        }

        const repos = data.data.user.pinnedItems.nodes;

        // Transform the data to match your current format
        const projects = repos.map(repo => {
            // Determine status based on repository state
            let status = 'ACTIVE';
            if (repo.isArchived) {
                status = 'ARCHIVED';
            } else {
                const lastUpdate = new Date(repo.updatedAt);
                const now = new Date();
                const daysSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60 * 24);

                if (daysSinceUpdate > 182) {
                    status = 'MAINTENANCE';
                }
            }

            // Get tech stack from languages and topics
            const languages = repo.languages.nodes.map(lang => lang.name);
            const topics = repo.repositoryTopics.nodes.map(topic => topic.topic.name);
            const techStack = [...languages, ...topics].slice(0, 4); // Limit to 4 items

            return {
                name: repo.name,
                url: repo.url,
                description: repo.description || 'No description available',
                updatedAt: repo.updatedAt,
                createdAt: repo.createdAt,
                status: status,
                techStack: techStack,
                primaryLanguage: repo.primaryLanguage,
                stars: repo.stargazerCount,
                forks: repo.forkCount
            };
        });

        // Sort by update date (most recent first)
        projects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        const responseData = {
            success: true,
            projects: projects,
            lastFetched: new Date().toISOString(),
            cached: false
        };

        // Update cache
        cache = {
            data: responseData,
            timestamp: now,
            etag: newEtag
        };

        // Set cache headers for browser caching (5 minutes)
        res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
        if (newEtag) {
            res.setHeader('ETag', newEtag);
        }

        console.log('Serving fresh data from GitHub');
        res.status(200).json(responseData);

    } catch (error) {
        console.error('Error fetching GitHub data:', error);

        // If we have cached data and there's an error, serve stale cache
        if (cache.data) {
            console.log('Error occurred, serving stale cache');
            return res.status(200).json({
                ...cache.data,
                cached: true,
                stale: true,
                warning: 'Serving cached data due to API error',
                error: error.message
            });
        }

        // No cache available, return error
        res.status(500).json({
            success: false,
            error: 'Failed to fetch GitHub data',
            message: error.message
        });
    }
}
