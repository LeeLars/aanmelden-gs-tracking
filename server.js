const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: ['http://localhost:3000', 'https://grafixstudio.io', 'http://grafixstudio.io'],
    credentials: true
}));
app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.redirect('/index.html');
});

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

const db = new sqlite3.Database(path.join(dataDir, 'analytics.db'), (err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to SQLite database');
        initDatabase();
    }
});

function initDatabase() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT UNIQUE NOT NULL,
            timestamp TEXT NOT NULL,
            user_agent TEXT,
            screen_width INTEGER,
            screen_height INTEGER,
            referrer TEXT,
            latitude REAL,
            longitude REAL,
            location_accuracy REAL,
            time_on_page INTEGER DEFAULT 0,
            scroll_depth INTEGER DEFAULT 0,
            language TEXT,
            platform TEXT,
            connection_type TEXT,
            downlink REAL,
            rtt INTEGER,
            page_load_time INTEGER,
            timezone TEXT,
            active_time INTEGER DEFAULT 0,
            region TEXT,
            municipality TEXT,
            country TEXT
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS video_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            event_type TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            video_time REAL,
            total_watch_time REAL,
            percentage_watched REAL,
            FOREIGN KEY (session_id) REFERENCES sessions(session_id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS button_clicks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            button_type TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            FOREIGN KEY (session_id) REFERENCES sessions(session_id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS form_submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            name TEXT,
            email TEXT,
            phone TEXT,
            timestamp TEXT NOT NULL,
            FOREIGN KEY (session_id) REFERENCES sessions(session_id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS interaction_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            event_type TEXT NOT NULL,
            details TEXT,
            timestamp TEXT NOT NULL,
            FOREIGN KEY (session_id) REFERENCES sessions(session_id)
        )`);

        console.log('Database tables initialized');
    });
}

async function reverseGeocode(latitude, longitude) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
            {
                headers: {
                    'User-Agent': 'AanmeldenGS-Analytics/1.0'
                }
            }
        );
        
        if (!response.ok) return null;
        
        const data = await response.json();
        const address = data.address || {};
        
        return {
            municipality: address.city || address.town || address.village || address.municipality || null,
            region: address.state || address.province || address.region || null,
            country: address.country || null
        };
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}

app.post('/api/track/session', async (req, res) => {
    const { 
        session_id, timestamp, user_agent, screen_width, screen_height, referrer, 
        latitude, longitude, location_accuracy,
        language, platform, connection_type, downlink, rtt, page_load_time, timezone
    } = req.body;
    
    if (!session_id || !timestamp) {
        return res.status(400).json({ error: 'session_id and timestamp are required' });
    }
    
    let locationData = null;
    if (latitude && longitude) {
        locationData = await reverseGeocode(latitude, longitude);
    }
    
    db.get("SELECT id FROM sessions WHERE session_id = ?", [session_id], (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        
        if (row) {
            let updates = [];
            let params = [];
            
            if (latitude !== null && latitude !== undefined) { updates.push('latitude = ?'); params.push(latitude); }
            if (longitude !== null && longitude !== undefined) { updates.push('longitude = ?'); params.push(longitude); }
            if (location_accuracy !== null && location_accuracy !== undefined) { updates.push('location_accuracy = ?'); params.push(location_accuracy); }
            
            if (locationData) {
                if (locationData.municipality) { updates.push('municipality = ?'); params.push(locationData.municipality); }
                if (locationData.region) { updates.push('region = ?'); params.push(locationData.region); }
                if (locationData.country) { updates.push('country = ?'); params.push(locationData.country); }
            }
            
            if (updates.length > 0) {
                params.push(session_id);
                const sql = `UPDATE sessions SET ${updates.join(', ')} WHERE session_id = ?`;
                db.run(sql, params, (err) => {
                    if (err) console.error('Error updating session:', err);
                    res.json({ success: true });
                });
            } else {
                res.json({ success: true });
            }
        } else {
            const sql = `INSERT INTO sessions 
                 (session_id, timestamp, user_agent, screen_width, screen_height, referrer, latitude, longitude, location_accuracy,
                  language, platform, connection_type, downlink, rtt, page_load_time, timezone, region, municipality, country) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            
            db.run(sql, [
                session_id, timestamp, user_agent, screen_width, screen_height, referrer, latitude, longitude, location_accuracy,
                language, platform, connection_type, downlink, rtt, page_load_time, timezone,
                locationData?.region || null, locationData?.municipality || null, locationData?.country || null
            ], function(err) {
                if (err) {
                    console.error('Error inserting session:', err);
                    return res.status(500).json({ error: 'Failed to track session' });
                }
                res.json({ success: true, id: this.lastID });
            });
        }
    });
});

app.post('/api/track/video', (req, res) => {
    const { session_id, event_type, timestamp, video_time, total_watch_time, percentage_watched } = req.body;
    
    if (!session_id || !event_type || !timestamp) {
        return res.status(400).json({ error: 'session_id, event_type, and timestamp are required' });
    }
    
    const sql = `INSERT INTO video_events 
                 (session_id, event_type, timestamp, video_time, total_watch_time, percentage_watched) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [session_id, event_type, timestamp, video_time, total_watch_time, percentage_watched], function(err) {
        if (err) {
            console.error('Error inserting video event:', err);
            return res.status(500).json({ error: 'Failed to track video event' });
        }
        res.json({ success: true, id: this.lastID });
    });
});

app.post('/api/track/click', (req, res) => {
    const { session_id, button_type, timestamp } = req.body;
    
    if (!session_id || !button_type || !timestamp) {
        return res.status(400).json({ error: 'session_id, button_type, and timestamp are required' });
    }
    
    const sql = `INSERT INTO button_clicks (session_id, button_type, timestamp) VALUES (?, ?, ?)`;
    
    db.run(sql, [session_id, button_type, timestamp], function(err) {
        if (err) {
            console.error('Error inserting button click:', err);
            return res.status(500).json({ error: 'Failed to track click' });
        }
        res.json({ success: true, id: this.lastID });
    });
});

app.post('/api/track/form', (req, res) => {
    const { session_id, name, email, phone, timestamp } = req.body;
    
    if (!session_id || !timestamp) {
        return res.status(400).json({ error: 'session_id and timestamp are required' });
    }
    
    const sql = `INSERT INTO form_submissions (session_id, name, email, phone, timestamp) VALUES (?, ?, ?, ?, ?)`;
    
    db.run(sql, [session_id, name, email, phone, timestamp], function(err) {
        if (err) {
            console.error('Error inserting form submission:', err);
            return res.status(500).json({ error: 'Failed to track form submission' });
        }
        res.json({ success: true, id: this.lastID });
    });
});

app.put('/api/track/session/:session_id', (req, res) => {
    const { session_id } = req.params;
    const { time_on_page, scroll_depth, active_time } = req.body;
    
    if (!session_id) {
        return res.status(400).json({ error: 'session_id is required' });
    }
    
    const sql = `UPDATE sessions SET time_on_page = ?, scroll_depth = ?, active_time = ? WHERE session_id = ?`;
    
    db.run(sql, [time_on_page, scroll_depth, active_time || time_on_page, session_id], function(err) {
        if (err) {
            console.error('Error updating session:', err);
            return res.status(500).json({ error: 'Failed to update session' });
        }
        res.json({ success: true });
    });
});

app.post('/api/track/interaction', (req, res) => {
    const { session_id, event_type, details, timestamp } = req.body;
    
    const sql = `INSERT INTO interaction_events (session_id, event_type, details, timestamp) VALUES (?, ?, ?, ?)`;
    
    db.run(sql, [session_id, event_type, JSON.stringify(details), timestamp], function(err) {
        if (err) {
            console.error('Error inserting interaction:', err);
            return res.status(500).json({ error: 'Failed to track interaction' });
        }
        res.json({ success: true, id: this.lastID });
    });
});

app.get('/api/analytics/overview', async (req, res) => {
    try {
        const [totalSessions, avgVideoTime, clicksByType, totalForms, avgTimeOnPage, avgActiveTime, avgScrollDepth] = await Promise.all([
            new Promise((resolve, reject) => db.get(`SELECT COUNT(*) as count FROM sessions`, [], (err, row) => err ? reject(err) : resolve(row.count))),
            new Promise((resolve, reject) => db.get(`SELECT AVG(total_watch_time) as avg_time FROM video_events WHERE event_type = 'ended' OR event_type = 'pause'`, [], (err, row) => err ? reject(err) : resolve(row.avg_time || 0))),
            new Promise((resolve, reject) => db.all(`SELECT button_type, COUNT(*) as count FROM button_clicks GROUP BY button_type`, [], (err, rows) => err ? reject(err) : resolve(rows))),
            new Promise((resolve, reject) => db.get(`SELECT COUNT(*) as count FROM form_submissions`, [], (err, row) => err ? reject(err) : resolve(row.count))),
            new Promise((resolve, reject) => db.get(`SELECT AVG(time_on_page) as avg_time FROM sessions WHERE time_on_page > 0`, [], (err, row) => err ? reject(err) : resolve(row.avg_time || 0))),
            new Promise((resolve, reject) => db.get(`SELECT AVG(active_time) as avg_time FROM sessions WHERE active_time > 0`, [], (err, row) => err ? reject(err) : resolve(row.avg_time || 0))),
            new Promise((resolve, reject) => db.get(`SELECT AVG(scroll_depth) as avg_depth FROM sessions WHERE scroll_depth > 0`, [], (err, row) => err ? reject(err) : resolve(row.avg_depth || 0)))
        ]);

        res.json({
            totalSessions,
            avgVideoTime,
            clicksByType,
            totalForms,
            avgTimeOnPage,
            avgActiveTime,
            avgScrollDepth
        });
    } catch (error) {
        console.error('Error fetching overview:', error);
        res.status(500).json({ error: 'Failed to fetch overview data' });
    }
});

app.get('/api/analytics/interactions', (req, res) => {
    const sql = `SELECT * FROM interaction_events ORDER BY timestamp DESC LIMIT 100`;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching interactions:', err);
            return res.status(500).json({ error: 'Failed to fetch interactions' });
        }
        res.json(rows);
    });
});

app.get('/api/analytics/technical', async (req, res) => {
    try {
        const [avgLoadTime, mobileCount, desktopCount, withLocation] = await Promise.all([
            new Promise((resolve, reject) => db.get(`SELECT AVG(page_load_time) as avg_time FROM sessions WHERE page_load_time > 0`, [], (err, row) => err ? reject(err) : resolve(row.avg_time || 0))),
            new Promise((resolve, reject) => db.get(`SELECT COUNT(*) as count FROM sessions WHERE user_agent LIKE '%Mobile%' OR user_agent LIKE '%Android%' OR user_agent LIKE '%iPhone%'`, [], (err, row) => err ? reject(err) : resolve(row.count))),
            new Promise((resolve, reject) => db.get(`SELECT COUNT(*) as count FROM sessions WHERE user_agent NOT LIKE '%Mobile%' AND user_agent NOT LIKE '%Android%' AND user_agent NOT LIKE '%iPhone%'`, [], (err, row) => err ? reject(err) : resolve(row.count))),
            new Promise((resolve, reject) => db.get(`SELECT COUNT(*) as count FROM sessions WHERE latitude IS NOT NULL AND longitude IS NOT NULL`, [], (err, row) => err ? reject(err) : resolve(row.count)))
        ]);

        res.json({ avgLoadTime, mobileCount, desktopCount, withLocation });
    } catch (error) {
        console.error('Error fetching technical data:', error);
        res.status(500).json({ error: 'Failed to fetch technical data' });
    }
});

app.get('/api/analytics/sessions', (req, res) => {
    const sql = `SELECT * FROM sessions ORDER BY timestamp DESC LIMIT 100`;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching sessions:', err);
            return res.status(500).json({ error: 'Failed to fetch sessions' });
        }
        res.json(rows);
    });
});

app.get('/api/analytics/form-submissions', (req, res) => {
    const sql = `SELECT 
                    f.*,
                    s.municipality,
                    s.region,
                    s.country,
                    s.user_agent,
                    s.referrer,
                    s.connection_type,
                    s.platform,
                    s.language
                 FROM form_submissions f
                 LEFT JOIN sessions s ON f.session_id = s.session_id
                 ORDER BY f.timestamp DESC
                 LIMIT 100`;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching form submissions:', err);
            return res.status(500).json({ error: 'Failed to fetch form submissions' });
        }
        res.json(rows);
    });
});

app.get('/api/analytics/video-stats', (req, res) => {
    const sql = `SELECT 
                    event_type,
                    COUNT(*) as count,
                    AVG(total_watch_time) as avg_watch_time,
                    AVG(percentage_watched) as avg_percentage
                 FROM video_events 
                 GROUP BY event_type`;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching video stats:', err);
            return res.status(500).json({ error: 'Failed to fetch video stats' });
        }
        res.json(rows);
    });
});

app.get('/api/analytics/clicks', (req, res) => {
    const sql = `SELECT * FROM button_clicks ORDER BY timestamp DESC`;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching clicks:', err);
            return res.status(500).json({ error: 'Failed to fetch clicks' });
        }
        res.json(rows);
    });
});

app.get('/api/analytics/clicks-timeline', (req, res) => {
    const sql = `SELECT 
                    DATE(timestamp) as date,
                    button_type,
                    COUNT(*) as count
                 FROM button_clicks 
                 GROUP BY DATE(timestamp), button_type
                 ORDER BY date DESC`;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching clicks timeline:', err);
            return res.status(500).json({ error: 'Failed to fetch clicks timeline' });
        }
        res.json(rows);
    });
});

app.get('/api/analytics/regions', (req, res) => {
    const sql = `SELECT 
                    COALESCE(region, 'Onbekend') as region,
                    COUNT(*) as count
                 FROM sessions 
                 GROUP BY region 
                 ORDER BY count DESC`;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching regions:', err);
            return res.status(500).json({ error: 'Failed to fetch regions' });
        }
        res.json(rows);
    });
});

app.get('/api/analytics/locations', (req, res) => {
    const sql = `SELECT 
                    s.latitude, 
                    s.longitude, 
                    s.municipality,
                    s.region,
                    COUNT(*) as visits,
                    COUNT(fs.id) as leads
                 FROM sessions s
                 LEFT JOIN form_submissions fs ON s.session_id = fs.session_id
                 WHERE s.latitude IS NOT NULL AND s.longitude IS NOT NULL
                 GROUP BY ROUND(s.latitude, 2), ROUND(s.longitude, 2)
                 ORDER BY visits DESC`;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching locations:', err);
            return res.status(500).json({ error: 'Failed to fetch locations' });
        }
        res.json(rows);
    });
});

app.get('/api/analytics/time-distribution', (req, res) => {
    const sql = `SELECT 
                    CASE 
                        WHEN time_on_page < 10 THEN '0-10s'
                        WHEN time_on_page < 30 THEN '10-30s'
                        WHEN time_on_page < 60 THEN '30-60s'
                        WHEN time_on_page < 180 THEN '1-3m'
                        ELSE '3m+'
                    END as duration_bucket,
                    COUNT(*) as count
                 FROM sessions 
                 WHERE time_on_page > 0
                 GROUP BY duration_bucket`;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching time distribution:', err);
            return res.status(500).json({ error: 'Failed to fetch time distribution' });
        }
        res.json(rows);
    });
});

app.get('/api/analytics/export', (req, res) => {
    const sql = `SELECT 
                    s.*,
                    GROUP_CONCAT(DISTINCT bc.button_type) as clicked_buttons,
                    COUNT(DISTINCT ve.id) as video_events_count,
                    MAX(ve.total_watch_time) as max_watch_time
                 FROM sessions s
                 LEFT JOIN button_clicks bc ON s.session_id = bc.session_id
                 LEFT JOIN video_events ve ON s.session_id = ve.session_id
                 GROUP BY s.session_id
                 ORDER BY s.timestamp DESC`;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error exporting data:', err);
            return res.status(500).json({ error: 'Failed to export data' });
        }
        
        const csv = convertToCSV(rows);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=analytics-export.csv');
        res.send(csv);
    });
});

function convertToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => {
        return Object.values(row).map(value => {
            if (value === null) return '';
            if (typeof value === 'string' && value.includes(',')) {
                return `"${value}"`;
            }
            return value;
        }).join(',');
    });
    
    return [headers, ...rows].join('\n');
}

app.listen(PORT, () => {
    console.log(`Analytics server running on http://localhost:${PORT}`);
    console.log(`Dashboard available at http://localhost:${PORT}/dashboard.html`);
});

process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});
