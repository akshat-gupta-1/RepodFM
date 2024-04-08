import { NextApiRequest } from "next";
import { Server as NetServer } from "http";
import { NextApiResponseServerIO } from "@/lib/types";
import { Server as ServerIO } from "socket.io";
export const config = {
  api: {
    bodyParser: false,
  },
};
const rooms: Record<string, { name: string; id: string }[]> = {};
const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path,
      addTrailingSlash: false,
      cors: {
        origin: "*",
      },
    });
    io.on("connection", (socket) => {
      socket.on("room:join", ({ name, roomId }) => {
        if (!rooms[roomId]) {
          rooms[roomId] = [];
          console.log("room created");
        }
        if (rooms[roomId].length < 2) {
          rooms[roomId].push({ name, id: socket.id });
          socket.join(roomId);
          console.log("room joined", socket.id);
          if (rooms[roomId].length === 2) {
            const currentUser = rooms[roomId].find(
              ({ name, id }) => id === socket.id,
            );
            const otherUser = rooms[roomId].find(
              ({ name, id }) => id !== socket.id,
            );
            socket.emit("room:joined", otherUser);
            io.to(otherUser!.id).emit("room:new-user", currentUser);
          }
        } else {
          socket.emit("room:full");
        }
      });
      socket.on(
        "room:offer",
        ({ offer, target, caller, cameraState, micState }) => {
          io.to(target).emit("room:offer", {
            offer,
            caller,
            target,
            cameraState,
            micState,
          });
        },
      );
      socket.on(
        "room:answer",
        ({ answer, target, caller, cameraState, micState }) => {
          io.to(target).emit("room:answer", {
            answer,
            caller,
            target,
            cameraState,
            micState,
          });
        },
      );
      socket.on("room:add-ice-candidate", ({ candidate, target }) => {
        io.to(target).emit("room:add-ice-candidate", candidate);
      });
      socket.on("room:leave", ({ id, roomId }) => {
        if (rooms[roomId].length === 2) {
          rooms[roomId] = rooms[roomId].filter((user) => user.id === id);
          io.to(id).emit("room:leave", id);
        } else {
          rooms[roomId] = [];
        }
      });
      socket.on("room:other-user-camera", ({ target, state }) => {
        io.to(target).emit("room:other-user-camera", state);
      });
      socket.on("room:other-user-mic", ({ target, state }) => {
        io.to(target).emit("room:other-user-mic", state);
      });
      socket.on("room:send-message", (message) => {
        io.to(message.reciever).emit("room:recieve-message", {
          ...message,
          type: "recieve",
          time: new Date(),
        });
      });
      socket.on("room:screen-share", ({ id, target }) => {
        io.to(target).emit("room:screen-share", id);
      });
      socket.on("room:screen-share-offer", ({ id, offer }) => {
        io.to(id).emit("room:screen-share-offer", offer);
      });
      socket.on("room:screen-share-answer", ({ id, answer }) => {
        io.to(id).emit("room:screen-share-answer", answer);
      });
    });
  }
  res.end();
};

export default ioHandler;
