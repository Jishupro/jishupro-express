import { Request, Response } from "express";
import { Socket } from "socket.io";

const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 8000;
app.get("/test", (req: Request, res: Response) => {
  res.send("running");
});

io.on("connection", function (socket: Socket) {
  console.log("connected");
  io.emit("connected");
  socket.on("disconnect", () => {
    console.log("disconnected");
  });
  socket.on("moved", (data) => {
    console.log("moved", data);
    io.emit("moved", data);
  });

  // 動作検証用
  app.get("/test/next", (req: Request, res: Response) => {
    io.emit("moved", { action: "next" });
    res.send("next");
  });
  app.get("/test/prev", (req: Request, res: Response) => {
    io.emit("moved", { action: "prev" });
    res.send("prev");
  });
});

http.listen(PORT, function () {
  console.log("server listening. Port:" + PORT);
});
