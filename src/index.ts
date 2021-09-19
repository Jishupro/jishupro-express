import { Request, Response } from "express";
import { Socket } from "socket.io";

const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3001;
app.get("/", (req: Request, res: Response) => {
  res.send("running");
});

io.on("connection", function (socket: Socket) {
  console.log("connected");
  io.emit("connected");
  socket.on("disconnect", () => {
    console.log("disconnected");
  });
  app.post("/api/gestures", (req: Request, res: Response) => {
    console.log("moved");
    io.emit("moved");
    res.status(200).send("ok");
  });
});

http.listen(PORT, function () {
  console.log("server listening. Port:" + PORT);
});
