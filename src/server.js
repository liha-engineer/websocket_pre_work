import express from "express";
import { createServer } from "http";
import initSocket from "./init/socket.js";

const app = express();
const server = createServer(app);

const PORT = 3444;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
initSocket(server);

app.use(express.static('public'));

app.get("/", (req, res) => {
  // 테스트를 위한 API 생성
  res.send("<h1>Hello World</h1>");
});

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});
