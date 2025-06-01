// api/github-cached.js - Enhanced version with file-based caching
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Cache configuration
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
const CACHE_DIR = '/tmp/github-cache'; // Use /tmp for serverless environments
const CACHE_FILE = path.join(CACHE_DIR, 'projects.json');

// In-memory cache fallback
let memoryCache = {
    data: null,
    timestamp: null,
    etag: null
};

async function ensureCacheDir() {
    if (!existsSync(CACHE_DIR)) {
        await mkdir(CACHE_DIR, { recursive: true });
    }
}

async function readFromFileCache() {
    try {
        await ensureCacheDir();
        if (existsSync(CACHE_FILE)) {
            const cacheContent = await readFile(CACHE_FILE, 'utf8');
            const cache = JSON.parse(cacheContent);

            // Validate cache structure
            if (cache.data && cache.timestamp && typeof cache.timestamp === 'number') {
                return cache;
            }
        }
    } catch (error) {
        console.warn('Failed to read file cache:', error.message);
    }
    return null;
}

async function writeToFileCache(cache) {
    try {
        await ensureCacheDir();
        await writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));
    } catch (error) {
        console.warn('Failed to write file cache:', error.message);
    }
}

async function getValidCache() {
    const now = Date.now();

    // Try memory cache first
    if (memoryCache.data && memoryCache.timestamp && (now - memoryCache.timestamp) < CACHE_DURATION) {
        return { ...memoryCache, source: 'memory' };
    }

    // Try file cache
    const fileCache = await readFromFileCache();
    if (fileCache && fileCache.timestamp && (now - fileCache.timestamp) < CACHE_DURATION) {
        // Update memory cache
        memoryCache = fileCache;
        return { ...fileCache, source: 'file' };
    }

    return null;
}

async function updateCache(data, etag) {
    const now = Date.now();
    const cache = {
        data,
        timestamp: now,
        etag
    };

    // Update memory cache
    memoryCache = cache;

    // Update file cache asynchronously
    writeToFileCache(cache).catch(err =>
        console.warn('Background file cache update failed:', err.message)
    );

    return cache;
}

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

    // Check for valid cache
    const validCache = await getValidCache();
    if (validCache) {
        console.log(`Serving from ${validCache.source} cache`);
        const cacheAge = Math.floor((Date.now() - validCache.timestamp) / 1000);
        return res.status(200).json({
            ...validCache.data,
            cached: true,
            cacheSource: validCache.source,
            cacheAge
        });
    }

    // Force fresh data if requested
    const forceRefresh = req.query.refresh === 'true';

    try {
        const username = 'frostplexx';

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

        const headers = {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
            'User-Agent': 'dinama-web-portfolio'
        };

        // Add conditional request headers if we have cached etag and not forcing refresh
        const lastEtag = memoryCache.etag || (await readFromFileCache())?.etag;
        if (lastEtag && !forceRefresh) {
            headers['If-None-Match'] = lastEtag;
        }

        console.log('Fetching from GitHub API');
        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers,
            body: JSON.stringify({ query })
        });

        // If GitHub returns 304 Not Modified, refresh cache timestamp
        if (response.status === 304 && !forceRefresh) {
            console.log('GitHub returned 304 - refreshing cache timestamp');
            const existingCache = await readFromFileCache() || memoryCache;
            if (existingCache.data) {
                await updateCache(existingCache.data, lastEtag);
                return res.status(200).json({
                    ...existingCache.data,
                    cached: true,
                    notModified: true
                });
            }
        }

        if (!response.ok) {
            // Try to serve stale cache if API fails
            const staleCache = await readFromFileCache() || memoryCache;
            if (staleCache.data) {
                console.log('API failed, serving stale cache');
                return res.status(200).json({
                    ...staleCache.data,
                    cached: true,
                    stale: true,
                    warning: 'Serving cached data due to API failure'
                });
            }
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const newEtag = response.headers.get('etag');
        const data = await response.json();

        if (data.errors) {
            throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
        }

        const repos = data.data.user.pinnedItems.nodes;

        // Transform the data
        const projects = repos.map(repo => {
            let status = 'ACTIVE';
            if (repo.isArchived) {
                status = 'ARCHIVED';
            } else {
                const lastUpdate = new Date(repo.updatedAt);
                const now = new Date();
                const daysSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60 * 24);

                if (daysSinceUpdate > 90) {
                    status = 'MAINTENANCE';
                }
            }

            const languages = repo.languages.nodes.map(lang => lang.name);
            const topics = repo.repositoryTopics.nodes.map(topic => topic.topic.name);
            const techStack = [...languages, ...topics].slice(0, 4);

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

        projects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        const responseData = {
            success: true,
            projects: projects,
            lastFetched: new Date().toISOString(),
            cached: false
        };

        // Update cache
        await updateCache(responseData, newEtag);

        // Set HTTP cache headers
        res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
        if (newEtag) {
            res.setHeader('ETag', newEtag);
        }

        console.log('Serving fresh data from GitHub');
        res.status(200).json(responseData);

    } catch (error) {
        console.error('Error fetching GitHub data:', error);

        // Try to serve any available cache on error
        const fallbackCache = await readFromFileCache() || memoryCache;
        if (fallbackCache.data) {
            console.log('Error occurred, serving fallback cache');
            return res.status(200).json({
                ...fallbackCache.data,
                cached: true,
                stale: true,
                warning: 'Serving cached data due to API error',
                error: error.message
            });
        }

        res.status(500).json({
            success: false,
            error: 'Failed to fetch GitHub data',
            message: error.message
        });
    }
}
