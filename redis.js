// redis.js
import Redis from 'ioredis';

class RedisSessionStore {
    constructor() {
        this.redis = new Redis({
            host: 'redis-14715.c262.us-east-1-3.ec2.cloud.redislabs.com',
            port: 14715,
            username: 'default',
            password: 'oGRykO7ZnVfaKgjBBiD6bZQpiLlWYUhv',
            tls: null // Required for Redis Cloud
        });

        this.redis.on('connect', () => {
            console.log('✅ Connected to Redis Cloud');
        });

        this.redis.on('error', (err) => {
            console.error('❌ Redis error:', err);
        });
    }

    /**
     * Save creds.json for a session ID
     */
    async saveCreds(sessionId, credsData) {
        try {
            const key = `${sessionId}/creds.json`;
            await this.redis.setex(
                key,
                60 * 60 * 24 * 80, // 80 days expiry (80 * 24 hours)
                JSON.stringify(credsData)
            );
            console.log(`✅ Saved to Redis: ${key}`);
            return true;
        } catch (error) {
            console.error('❌ Failed to save to Redis:', error);
            return false;
        }
    }

    /**
     * Get creds.json by session ID
     */
    async getCreds(sessionId) {
        try {
            const key = `${sessionId}/creds.json`;
            const data = await this.redis.get(key);
            
            if (data) {
                console.log(`✅ Retrieved from Redis: ${key}`);
                return JSON.parse(data);
            }
            
            console.log(`❌ Not found in Redis: ${key}`);
            return null;
        } catch (error) {
            console.error('❌ Failed to get from Redis:', error);
            return null;
        }
    }

    /**
     * Check if session exists
     */
    async sessionExists(sessionId) {
        try {
            const key = `${sessionId}/creds.json`;
            const exists = await this.redis.exists(key);
            return exists === 1;
        } catch (error) {
            console.error('❌ Failed to check session:', error);
            return false;
        }
    }

    /**
     * Search for sessions by pattern
     */
    async searchSessions(pattern) {
        try {
            const keys = await this.redis.keys(`*${pattern}*/creds.json`);
            const sessions = keys.map(key => key.replace('/creds.json', ''));
            return sessions;
        } catch (error) {
            console.error('❌ Failed to search sessions:', error);
            return [];
        }
    }

    /**
     * Delete session
     */
    async deleteSession(sessionId) {
        try {
            const key = `${sessionId}/creds.json`;
            await this.redis.del(key);
            console.log(`🗑️ Deleted from Redis: ${key}`);
            return true;
        } catch (error) {
            console.error('❌ Failed to delete session:', error);
            return false;
        }
    }

    /**
     * Get all sessions (for debugging/admin)
     */
    async getAllSessions() {
        try {
            const keys = await this.redis.keys('*/creds.json');
            const sessions = keys.map(key => key.replace('/creds.json', ''));
            console.log(`📋 Found ${sessions.length} sessions in Redis`);
            return sessions;
        } catch (error) {
            console.error('❌ Failed to get all sessions:', error);
            return [];
        }
    }

    /**
     * Get session TTL (Time To Live) in days
     */
    async getSessionTTL(sessionId) {
        try {
            const key = `${sessionId}/creds.json`;
            const ttlSeconds = await this.redis.ttl(key);
            const ttlDays = Math.floor(ttlSeconds / (60 * 60 * 24));
            return ttlDays;
        } catch (error) {
            console.error('❌ Failed to get TTL:', error);
            return -1;
        }
    }
}

// Create and export singleton instance
const redisSessionStore = new RedisSessionStore();
export default redisSessionStore;
