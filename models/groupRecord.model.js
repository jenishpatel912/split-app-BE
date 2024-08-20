import mongoose from "mongoose";

const groupRecordSchema = new mongoose.Schema({
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    expense: {
      type: Number,
      default: 0,
    },
  });
  
  export const GroupRecord = mongoose.model("GroupRecord", groupRecordSchema);
  