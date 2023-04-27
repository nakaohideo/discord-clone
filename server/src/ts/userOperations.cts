import UserModel from "../models/user.model.cjs";
import RoomModel from "../models/rooms.model.cjs";

import { loadRooms } from "../ts/catOperations.cjs";
import saveModel from "./saveModel.cjs";

import mongoose from "mongoose";

var sha1 = require("sha1");

import { connectedUsersT, checkDataI, checkLoginI } from "../types/types.cjs";

// const checkUser = (username: string) => {
//   let user = UserModel.find({
//     username: username,
//   })
//     .then((doc: any) => console.log(doc))
//     .catch((err: string) => console.error(err));

//   console.log(user);
//   return {};
// };

const bufferData = (username: string, password: string): string => {
  let hash = sha1(`${username}${password}`);
  return hash;
};

const registerUser = async (username: string, hashedPassword: string, ip: string | undefined): Promise<"done" | "username already exists"> => {
  const doc = await UserModel.find({
    username: username,
  });

  if (doc.length === 0) {
    let user = new UserModel({
      _id: new mongoose.Types.ObjectId(),
      username: username,
      password: hashedPassword,
      hashId: bufferData(username, hashedPassword),
      ip: ip,
    });

    saveModel(user);
    return "done";
  } else {
    return "username already exists";
  }
};

const addIp = async (username: string, ip: string | undefined): Promise<void> => {
  await UserModel.updateOne(
    {
      username: username,
    },
    {
      $set: {
        ip: ip,
      },
    }
  )
    .exec()
    .then(_ => console.log("ip added..."))
    .catch(err => console.error(err));
};

const checkData = async (hashId: string): Promise<checkDataI> => {
  const doc = await UserModel.find({
    hashId: hashId,
  }).exec();

  if (doc.length !== 0) {
    const rooms = await loadRooms();

    return {
      success: true,
      username: doc[0].username,
      rooms,
      authentication: doc[0]._id.toString(),
    };
  } else return {
    success: false
  };
};

const findLowestPositionId = (): any =>
  new Promise((resolve, reject) => {
  // return "61ed960432479c682956802b";
  RoomModel.find({})
    .sort({ position: 1 })
    .limit(1)
    .exec()
    .then((res: any) => {
      if (res.length !== 0) {
        resolve({ roomId: res[0]._id });
      }
    });
  });

const checkLogin = async (username: string, password: string): Promise<checkLoginI> => {
  let doc = await UserModel.find({ username }).exec();

  // console.log("\n checking \n");
  if (doc[0] == undefined) {
    return { success: false };
  } else {
    let pswrd = String(doc[0].password);
    if (password === pswrd) {
      let hashId = doc[0].hashId;
      let { roomId } = await findLowestPositionId();
      return {
        success: true,
        roomId: roomId,
        hashId,
      };
    } else {
      return { success: false };
    }
  }
};

const usersStatus = async (): Promise<connectedUsersT> => {
  let users: connectedUsersT = {};

  await UserModel.find()
    .exec()
    .then((doc: any) => {
      doc.forEach((el: any) => {
        users[el.username] = {
          status: "offline",
          tabsOpen: 0,
        };
      });
    });

  return users;
};

export { registerUser, addIp, checkLogin, checkData, usersStatus };