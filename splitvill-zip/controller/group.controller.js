import mongoose from "mongoose";
import { Group } from "../models/group.model.js";
import { sendError, sendResponse } from "../utils/response.js";

export const createGroup = async (req, res, next) => {
  try {
    const { name, users } = req.body;
    const user = req.user;

    if (!name) {
      return sendError(res, 400, "Group name is required");
    }

    if (!users?.length) {
      return sendError(res, 400, "Atleast one user is required");
    }

    const isExist = await Group.findOne({ createdBy: user.id, name });

    if (isExist) {
      return sendError(res, 400, "Group name already exists!");
    }

    const newGroup = await Group.create({
      name,
      createdBy: user.id,
      users: [user.id, ...users],
    });

    return sendResponse(res, 201, newGroup, "Group created successfully");
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getUserGroups = async (req, res, next) => {
  try {
    const user = req.user;
    console.log(user);
    const groupList = await Group.aggregate([
      {
        $match: { users: new mongoose.Types.ObjectId(user.id) },
      },
    ]);
    return sendResponse(res, 200, groupList, "Groups fetched successfully.");
  } catch (err) {
    console.log(err);
    next(err);
  }
};
