import Redis from 'ioredis';

const LOCAL_CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;
const REDIS_CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;
const REDIS_TTL_SECONDS = 7 * 24 * 60 * 60;
const CACHE_KEY = 'github:projects';

let redis = null;
let redisAvailable = false;

try {
    redis = new Redis(process.env.REDIS_URL || {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD,
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 1,
        lazyConnect: true
    });

    redis.on('connect', () => {
        redisAvailable = true;
        console.log('Redis connected successfully');
    });

    redis.on('error', (err) => {
        redisAvailable = false;
        console.warn('Redis connection error:', err.message);
    });

    redis.on('close', () => {
        redisAvailable = false;
        console.warn('Redis connection closed');
    });
} catch (error) {
    console.warn('Redis initialization failed:', error.message);
    redisAvailable = false;
}

let localCache = {
    data: null,
    timestamp: null,
    etag: null
};

async function getValidCache() {
    const now = Date.now();

    if (localCache.data && localCache.timestamp && (now - localCache.timestamp) < LOCAL_CACHE_DURATION) {
        console.log('✓ Serving from local cache');
        return { ...localCache, source: 'local' };
    }

    if (redisAvailable && redis) {
        try {
            const cached = await redis.get(CACHE_KEY);
            if (cached) {
                const redisCache = JSON.parse(cached);
                if (redisCache.timestamp && (now - redisCache.timestamp) < REDIS_CACHE_DURATION) {
                    localCache = {
                        data: redisCache.data,
                        timestamp: redisCache.timestamp,
                        etag: redisCache.etag
                    };
                    console.log('✓ Serving from Redis cache (updated local)');
                    return { ...redisCache, source: 'redis' };
                } else {
                    console.log('⚠ Redis cache expired, will fetch fresh data');
                }
            } else {
                console.log('⚠ No data found in Redis cache');
            }
        } catch (error) {
            console.warn('Redis cache read failed:', error.message);
            redisAvailable = false;
        }
    } else {
        console.log('⚠ Redis unavailable for cache read');
    }

    if (localCache.data && localCache.timestamp) {
        const staleAge = now - localCache.timestamp;
        if (staleAge < (60 * 60 * 1000)) {
            console.log('⚠ Using stale local cache as fallback');
            return { ...localCache, source: 'local-stale', stale: true };
        }
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

    localCache = { ...cache };
    console.log('✓ Local cache updated');

    if (redisAvailable && redis) {
        try {
            await redis.setex(CACHE_KEY, REDIS_TTL_SECONDS, JSON.stringify(cache));
            console.log('✓ Redis cache updated (TTL: 7 days)');
        } catch (error) {
            console.warn('Redis cache write failed:', error.message);
            redisAvailable = false;
        }
    } else {
        console.log('⏭ Redis unavailable, skipping Redis cache update');
    }

    return cache;
}

function getCacheStatus() {
    const now = Date.now();
    return {
        local: {
            available: !!localCache.data,
            age: localCache.timestamp ? Math.floor((now - localCache.timestamp) / 1000) : null,
            valid: localCache.timestamp && (now - localCache.timestamp) < LOCAL_CACHE_DURATION,
            duration: `${LOCAL_CACHE_DURATION / 1000 / 60} minutes`
        },
        redis: {
            available: redisAvailable,
            connected: redis?.status === 'ready',
            duration: `${REDIS_CACHE_DURATION / 1000 / 60 / 60 / 24} days`,
            ttl: `${REDIS_TTL_SECONDS / 60 / 60 / 24} days`
        }
    };
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

    if (req.query.debug === 'cache') {
        // Also check Redis TTL if available
        let redisTTL = null;
        if (redisAvailable && redis) {
            try {
                redisTTL = await redis.ttl(CACHE_KEY);
            } catch (error) {
                console.warn('Failed to get Redis TTL:', error.message);
            }
        }

        return res.status(200).json({
            cacheStatus: getCacheStatus(),
            redisTTL: redisTTL ? `${Math.floor(redisTTL / 60 / 60 / 24)} days, ${Math.floor((redisTTL % (60 * 60 * 24)) / 60 / 60)} hours` : 'N/A',
            timestamp: new Date().toISOString()
        });
    }

    const validCache = await getValidCache();
    if (validCache && req.query.refresh !== 'true') {
        const cacheAge = Math.floor((Date.now() - validCache.timestamp) / 1000);
        return res.status(200).json({
            ...validCache.data,
            cached: true,
            cacheSource: validCache.source,
            cacheAge,
            stale: validCache.stale || false
        });
    }

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

        if (validCache?.etag && req.query.refresh !== 'true') {
            headers['If-None-Match'] = validCache.etag;
        }

        console.log('🔄 Fetching from GitHub API');
        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers,
            body: JSON.stringify({ query })
        });

        if (response.status === 304 && validCache) {
            console.log('📄 GitHub returned 304 - refreshing cache timestamp');
            await updateCache(validCache.data, validCache.etag);
            return res.status(200).json({
                ...validCache.data,
                cached: true,
                notModified: true
            });
        }

        if (!response.ok) {
            const fallbackCache = await getValidCache();
            if (fallbackCache?.data) {
                console.log('🚨 API failed, serving fallback cache');
                return res.status(200).json({
                    ...fallbackCache.data,
                    cached: true,
                    stale: true,
                    warning: 'Serving cached data due to API failure',
                    cacheSource: fallbackCache.source
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

        await updateCache(responseData, newEtag);

        res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
        if (newEtag) {
            res.setHeader('ETag', newEtag);
        }

        console.log('✅ Serving fresh data from GitHub');
        res.status(200).json(responseData);

    } catch (error) {
        console.error('❌ Error fetching GitHub data:', error);

        const fallbackCache = await getValidCache();
        if (fallbackCache?.data) {
            console.log('🔄 Error occurred, serving fallback cache');
            return res.status(200).json({
                ...fallbackCache.data,
                cached: true,
                stale: true,
                warning: 'Serving cached data due to API error',
                error: error.message,
                cacheSource: fallbackCache.source
            });
        }

        res.status(500).json({
            success: false,
            error: 'Failed to fetch GitHub data',
            message: error.message,
            cacheStatus: getCacheStatus()
        });
    }
}
