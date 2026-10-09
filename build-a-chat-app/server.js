import http from 'http';
import fs from 'fs';
import WebSocket, { WebSocketServer } from 'ws';
import path from 'path';

const PORT = 3001;
const mimeTypes = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.svg':  'image/svg+xml'
};

const server = http.createServer((req, res) => {
    let filePath = "./public/" + ((req.url == "/" || req.url == "index") ? "index.html" : req.url ?? "index.html");
        console.log(req.url, " -filePath- " ,filePath);
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not Found');
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
})



const wss = new WebSocketServer({server});


wss.on('connection', (socket, req) => {
    const username = new URL(req.url, "http://localhost").searchParams.get("username");

    socket.on('message', (data) => {   
        const msg = JSON.parse(data.toString('utf8'));
        const chatMessage = JSON.stringify({ type: "chat", username: msg.username, text: msg.text  })
        wss.clients.forEach((cl) => {
            if (cl.readyState == WebSocket.OPEN) {
            cl.send(chatMessage);
            }
        });
    });

    socket.on('close', (data) => {   
        const leaveMessage = JSON.stringify({ type: "system", text: `${username} left` })
        wss.clients.forEach((cl) => {
        if (cl.readyState == WebSocket.OPEN) {
            cl.send(leaveMessage);
        }
    });
    });
    
    const joinMessage = JSON.stringify({ type: "system", text: `${username} joined` })

    wss.clients.forEach((cl) => {
        if (cl.readyState == WebSocket.OPEN) {
            cl.send(joinMessage);
        }
    });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});