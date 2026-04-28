const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Neon PostgreSQL Connection Pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

pool.connect((err, client, release) => {
    if (err) return console.error('Error acquiring client', err.stack);
    console.log('Successfully connected to Neon PostgreSQL Database!');
    release();
});

// Generate random 6-character URL slug
const generateSlug = () => Math.random().toString(36).substring(2, 8);

// API: Create new prank link
app.post('/api/campaigns', async (req, res) => {
    const { config } = req.body;
    const slug = generateSlug();
    try {
        const result = await pool.query(
            'INSERT INTO campaigns (slug, config) VALUES ($1, $2) RETURNING slug',
            [slug, config]
        );
        const returnedSlug = result.rows?.[0]?.slug;
        if (!returnedSlug) {
            throw new Error('Failed to create campaign slug');
        }
        res.json({ success: true, slug: returnedSlug });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API: Get prank link config for the victim
app.get('/api/campaigns/:slug', async (req, res) => {
    const { slug } = req.params;
    try {
        const result = await pool.query('SELECT config FROM campaigns WHERE slug = $1', [slug]);
        if (result.rows.length > 0) {
            res.json(result.rows.config);
        } else {
            res.status(404).json({ error: 'Not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API: Save victim's entered name (We will use this in the next step)
app.post('/api/submissions', async (req, res) => {
    const { slug, responses } = req.body;
    try {
        const campaign = await pool.query('SELECT id FROM campaigns WHERE slug = $1', [slug]);
        if (campaign.rows.length > 0) {
            await pool.query(
                'INSERT INTO submissions (campaign_id, responses) VALUES ($1, $2)',
                [campaign.rows.id, responses]
            );
            await pool.query('UPDATE campaigns SET total_opens = total_opens + 1 WHERE id = $1', [campaign.rows.id]);
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Campaign not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});