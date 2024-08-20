import mongoose from "mongoose";

const entrySchema = new mongoose.Schema({
  entryBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  remark: {
    type: String,
    trim: true,
  },
  total: {
    type: Number,
    required: true,
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
  },
});

export const Entry = mongoose.model("Entry", entrySchema);
