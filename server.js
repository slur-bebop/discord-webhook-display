import express from "express";
import bodyParser from "body-parser";
import { WebSocketServer } from "ws";
import path from "path";

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// WebSocket Server
const wss = new WebSocketServer({ noServer: true });
let latestMessage = "";

// รับข้อความจาก Discord webhook
app.post("/discord", (req, res) => {
  latestMessage = req.body.content || "(ไม่มีข้อความ)";
  console.log("📨 ข้อความใหม่:", latestMessage);

  wss.clients.forEach(client => {
    if (client.readyState === 1) client.send(latestMessage);
  });

  res.sendStatus(200);
});

// ส่งหน้าเว็บหลัก
app.use(express.static("public"));

// สร้าง server
const server = app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);

// เชื่อม WebSocket
server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, ws => {
    wss.emit("connection", ws, request);
  });
});
