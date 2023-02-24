const http = require('http');
const echarts = require('echarts');
const { createCanvas } = require('canvas');

const host = '0.0.0.0';
const port = 8080;

// Render error message
function renderError(res, error) {
    res.writeHead(400, {
        'Content-Type': 'text/plain',
    });
    res.end(error);
}

const server = http.createServer(function (req, res) {
    let body = [];
    let bodySize = 0;

    req.on('error', (err) => {
        renderError('Bad Request');
    }).on('data', (chunk) => {
        body.push(chunk);

        // Check body size
        bodySize += chunk.length;
        if (bodySize > 1e4) {
            renderError(res, 'Request body too large');
        }
    }).on('end', () => {
        body = Buffer.concat(body).toString();

        // Deserialize JSON
        let payload;
        try {
            payload = JSON.parse(body);
        } catch (e) {
            renderError(res, 'Invalid JSON');
            return;
        }

        if (!payload.option || payload.option.constructor !== Object) {
            renderError(res, 'Missing "option"');
            return;
        }
        let width = payload.width?payload.width:400
        let height = payload.height?payload.height:400
        const canvas = createCanvas(width, height);
        const chart = echarts.init(canvas);
        chart.setOption(payload.option);
        const png = chart.getDom().toBuffer('image/png');
        res.writeHead(200, {
            'Content-Type': 'image/png',
        });
        res.write(png);
        res.end();
    });
});

server.listen(port, host);
