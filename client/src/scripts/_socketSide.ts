import io from "socket.io-client";

import getTime from "./getTime";
import packageJson from "../../package.json";

import { setOnline, setOffline, addMessage, removeMessage, attachEmoji } from "../features/interfaces";
import { messageI, sendFileDataI, emojiT, attachEmojiI, interfaceInitialStateValueI } from "../types/types";

const main = (roomId: string, username: string, dispatch: any) => {
  if (socket.disconnected){
    // @ts-expect-error
    socket = io.connect(domain);
  }

  // socket.emit("join", {
  //   room: reduxData.currentRoom,
  //   username: reduxData.currentUser,
  // });
  socket.emit("join", { roomId, username });
  console.log("sent join", roomId, username);

  type dataIMSG = messageI & { originalName: string };
  socket.on("M_S_O", (data: dataIMSG) => {
    let msgList: messageI[] = [
      {
        user: data.user,
        message: data.isFile ? data._id : data.message,
        date: data.date,
        isFile: data.isFile,
        fileName: data.isFile ? data.originalName : "",
        _id: data._id,
        focusMode: false,
        editMode: false,
        edited: data.edited,
        emojis: data.emojis === undefined ? [] : data.emojis,
      },
    ];

    dispatch(addMessage({ messageList: msgList }));
  });

  socket.on("messagesData", (data: dataIMSG[]) => {
    // type msgT = Omit<messageI, "focusMode">;
    // if(reduxData.messages.length >= 1){
    //   return;
    // }

    let msgList: messageI[] = data.map((el: dataIMSG) => {
      return {
        user: el.user,
        message: el.isFile ? el._id : el.message,
        date: el.date,
        isFile: el.isFile,
        fileName: el.isFile ? el.originalName : "",
        _id: el._id,
        focusMode: false,
        editMode: false,
        edited: el.edited,
        emojis: el.emojis === undefined ? [] : el.emojis,
      };
    });
    dispatch(addMessage({ messageList: msgList })); // message/messages
  });

  socket.on("messageDeleted", (data: any) => {
    dispatch(removeMessage({ _id: data.id }));
  });

  socket.on("online", (data: any) => {
    console.log("online:", data);
    dispatch(setOnline({ name: data.username }));
  });

  socket.on("offline", (data: any) => {
    console.log("offline:", data.username);
    dispatch(setOffline({ name: data.username }));
  });

  socket.on("status", (data: any) => {
    // data.forEach((el: statusI) => {
    //   if (el.status === "online") dispatch(setOnline({ name: el.username }));
    //   else dispatch(setOffline({ name: el.username }));
    // });
    
    for (const [username, value] of Object.entries(data)) {
      // @ts-ignore
      if (value.status === "online") dispatch(setOnline({ name: username }));
      else dispatch(setOffline({ name: username }));
    }
  });

  socket.on("newEmoji", (data: attachEmojiI) => {
    console.log("received:", data.emoji, data.num, data._id);
    dispatch(attachEmoji({ _id: data._id, emoji: data.emoji, num: data.num }));
  });
};

// const urlify = (text) => {
//   var urlRegex = /(https?:\/\/[^\s]+)/g;
//   return text.replace(urlRegex, function (url) {
//     return `</a12>${url}</a12>`;
//   });
// };

const editMessage = (messageHTML: string, id: string) => {
  socket.emit("editMessage", { messageHTML: messageHTML, _id: id });
};

const sendDeleteStatus = (id: string | null) => {
  socket.emit("deleteMessage", { _id: id });
};

const sendFileData = ({ reduxData, id, size, filename }: sendFileDataI) => {
  const data = {
    _id: id,
    room: reduxData.currentRoom,
    size: size,
    authentication: reduxData.authentication,
    filename: filename,
  };

  socket.emit("file", data);
  console.log("sent...........", data);
};

const sendMessage = (reduxData: interfaceInitialStateValueI, roomId: string, message: string) => {
    let datetime = getTime();
    let sdata = {
      authentication: reduxData.authentication,
      username: reduxData.currentUser,
      message: message,
      datetime: datetime,
      room: reduxData.currentRoom,
      roomId: roomId,
    };

    socket.emit("message", sdata);
};

const attackEmoji = (messageId: string, emoji: emojiT, room: string, user: string) => {
  socket.emit("attachEmoji", { _id: messageId, emoji: emoji, room: room, _user: user });
}

const disconnect = () => socket.disconnect();

const domain = packageJson.proxy;
// @ts-expect-error
var socket = io.connect(domain);

export { socket, main, sendMessage, sendFileData, sendDeleteStatus, editMessage, disconnect, attackEmoji };