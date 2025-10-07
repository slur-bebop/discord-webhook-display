import express from "express";
import bodyParser from "body-parser";
import { WebSocketServer } from "ws";
import fetch from "node-fetch"; // ต้องติดตั้ง node-fetch

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1370287538194878495/b_ok-dTTW1UQXra2zAPKiTI2FkML82aitnZfpRblv3RDkqN0V_4HRlXi0d20WJNAetEs";

// WebSocket Server
const wss = new WebSocketServer({ noServer: true });
let latestMessage = "";

// รับข้อความจาก Discord webhook
app.post("/discord", (req, res) => {
  latestMessage = req.body.content || "(ไม่มีข้อความ)";
  console.log("📨 ข้อความใหม่:", latestMessage);

  // ส่งข้อความให้ทุกเว็บที่เปิดอยู่
  wss.clients.forEach(client => {
    if (client.readyState === 1) client.send(latestMessage);
  });

  // ส่งข้อความกลับไป Discord ด้วย webhook ของคุณ
  fetch(DISCORD_WEBHOOK_URL,
