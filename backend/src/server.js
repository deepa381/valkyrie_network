
const express=require("express");
const cors=require("cors");
const http=require("http");
const {Server}=require("socket.io");

const app=express();
const server=http.createServer(app);
const io=new Server(server);

app.use(cors());
app.use(express.json());

app.use("/api",require("./routes"));

io.on("connection",(socket)=>socket.emit("connected","ok"));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Unified Backend Running on port ${PORT}`);
});