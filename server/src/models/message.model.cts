import mongoose, { Types } from "mongoose";

// mongoose.Document, mongodb.collection
export interface messageSchemaI extends mongoose.Document {
  _id: Types.ObjectId;
  date: string;
  message?: string;
  user: string;
  room: string;
  roomId: string;
  isFile?: boolean;
  path?: string;
  originalName?: string;
  downloadCount?: number;
  size?: number;
  edited: boolean;
}

const messageSchema = new mongoose.Schema<messageSchemaI>(
  {
    _id: mongoose.Schema.Types.ObjectId,
    date: {
      type: String,
      unique: false,
      trim: true,
      required: [true, "Please add date"],
    },
    message: {
      type: String,
      unique: false,
      trim: true,
      required: false,
    },
    user: {
      type: String,
      unique: false,
      trim: true,
      required: [true, "Please add a username"],
    },
    room: {
      type: String,
      unique: false,
      trim: true,
      required: [true, "Please add a room name"],
    },
    roomId: {
      type: String,
      trim: true,
      unique: false,
      required: [true, "Please add a room id"],
    },
    isFile: {
      type: Boolean,
      unique: false,
      required: true,
    },
    path: {
      type: String,
      unique: false,
      required: false,
    },
    originalName: {
      type: String,
      trim: true,
      unique: false,
      required: false,
    },
    downloadCount: {
      type: Number,
      unique: false,
      required: false,
    },
    size: {
      type: Number,
      unique: false,
      required: false,
    },
    edited: {
      type: Boolean,
      unique: false,
      required: true,
      default: false,
    },
  },
  {
    timestamps: false,
  }
);

const Message = mongoose.model<messageSchemaI>("Message", messageSchema);

// module.exports = Message;
export default Message;

// export function findOneAndUpdate(filter: { _id: any; }, update: { message: any; }) {
//   throw new Error("Function not implemented.");
// }

// export function find(arg0: { _id: any; }) {
//   throw new Error("Function not implemented.");
// }

// export function findOne(arg0: { size: string; originalName: string; }) {
//   throw new Error("Function not implemented.");
// }
// export { messageSchemaI };
