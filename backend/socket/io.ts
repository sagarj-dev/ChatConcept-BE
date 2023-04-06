import { Server } from "http";
import * as socketio from "socket.io";

import jwt from "jsonwebtoken";

let io: socketio.Server | null;
const createSocketServer = (server: Server) => {
  io = new socketio.Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: "*",
      // credentials: true,
    },
  });
  // check if user is authenticated
  io.use(function (socket, next) {
    let user = socket.handshake.query;
    if (socket.handshake.query && socket.handshake.query.token) {
      jwt.verify(
        user.token as string,
        process.env.JWT_SECRET as string,
        function (err, decoded) {
          if (err) return next(new Error("Authentication error"));
          next();
        }
      );
    } else {
      next(new Error("Authentication error"));
    }
  });

  return io;
};

export { createSocketServer, io };
