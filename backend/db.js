const { Pool } = require('pg');
require('dotenv').config();

// Pool 1: Session Pooler → IPv4 (for Render)
const poolerPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Pool 2: Direct Connection → IPv6 (fallback)
const directPool = new Pool({
  connectionString: process.env.DATABASE_URL_DIRECT,
  ssl: { rejectUnauthorized: false }
});

let activePool = poolerPool; // Start with IPv4 by default

poolerPool.connect()
  .then(client => {
    client.release();
    console.log('✅ Connected via Session Pooler (IPv4)');
  })
  .catch(() => {
    console.warn('⚠️ Session Pooler failed, trying Direct Connection (IPv6)...');
    directPool.connect()
      .then(client => {
        client.release();
        activePool = directPool; // Switch to direct
        console.log('✅ Connected via Direct Connection (IPv6)');
      })
      .catch(err => {
        console.error('❌ Both connections failed:', err.message);
      });
  });

// This is what all your routes use
module.exports = {
  query: (...args) => activePool.query(...args)
};
