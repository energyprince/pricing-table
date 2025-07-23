/**
 * Pricing Editor Server
 * Node.js server for the auto-saving pricing editor
 * Allows direct updates to pricing-table.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3002;
const PUBLIC_DIR = __dirname;  // Files are in current directory, not parent
const PRICING_TABLE_PATH = path.join(__dirname, 'pricing-table.js');

// Create server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    console.log(`Request: ${req.method} ${pathname}`);

    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Serve static files
    if (req.method === 'GET' && pathname !== '/api/pricing') {
        let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'pricing-editor.html' : pathname);
        
        // Check if file exists
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
                return;
            }

            // Determine content type
            const ext = path.extname(filePath).toLowerCase();
            const contentTypes = {
                '.html': 'text/html',
                '.js': 'text/javascript',
                '.css': 'text/css',
                '.json': 'application/json',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif',
                '.svg': 'image/svg+xml',
                '.ico': 'image/x-icon'
            };
            const contentType = contentTypes[ext] || 'text/plain';

            // Check if it's a binary file (images)
            const isBinary = ['.jpg', '.jpeg', '.png', '.gif', '.ico'].includes(ext);

            // Read and serve file
            fs.readFile(filePath, isBinary ? null : 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                    return;
                }

                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            });
        });
    }
    // API endpoint to get current pricing data
    else if (req.method === 'GET' && pathname === '/api/pricing') {
        fs.readFile(PRICING_TABLE_PATH, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to read pricing table' }));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ data: data }));
        });
    }
    // API endpoint to save pricing data
    else if (req.method === 'POST' && pathname === '/api/save-pricing') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const { content } = JSON.parse(body);

                // Create backup before saving
                const backupPath = PRICING_TABLE_PATH + '.backup';
                const originalContent = fs.readFileSync(PRICING_TABLE_PATH, 'utf8');
                fs.writeFileSync(backupPath, originalContent, 'utf8');
                console.log('Backup created at:', backupPath);

                // Save new content
                fs.writeFile(PRICING_TABLE_PATH, content, 'utf8', (err) => {
                    if (err) {
                        console.error('Error saving file:', err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, error: 'Failed to save file' }));
                        return;
                    }

                    console.log('Pricing table updated successfully');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, message: 'File saved successfully' }));
                });
            } catch (error) {
                console.error('Error processing request:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Invalid request' }));
            }
        });
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// Start server
server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════╗
║         Pricing Editor Server Running                  ║
╠════════════════════════════════════════════════════════╣
║  Server URL: http://localhost:${PORT}                   ║
║  Editor URL: http://localhost:${PORT}/pricing-editor.html      ║
║                                                        ║
║  Press Ctrl+C to stop the server                      ║
╚════════════════════════════════════════════════════════╝
    `);
});

// Handle server shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    server.close(() => {
        console.log('Server stopped');
        process.exit(0);
    });
});