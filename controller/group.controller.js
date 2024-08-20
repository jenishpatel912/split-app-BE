import mongoose from "mongoose";
import { Group } from "../models/group.model.js";
import { sendError, sendResponse } from "../utils/response.js";
import { GroupRecord } from "../models/groupRecord.model.js";

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

    const userList = [...new Set([user.id, ...users])];

    const newGroup = await Group.create({
      name,
      createdBy: user.id,
      users: userList,
    });

    const groupRecordArr = userList.map((item) => ({
      groupId: newGroup._id,
      userId: item,
      expense: 0,
    }));

    await GroupRecord.insertMany(groupRecordArr);

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
    const groupList = await GroupRecord.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(user.id) },
      },
      {
        $lookup: {
          from: "groups",
          localField: "groupId",
          foreignField: "_id",
          as: "groupDetail",
        },
      },
      {
        $unwind: "$groupDetail",
      },
      {
        $project: {
          // groupDetail:{
          //   name:1,
          //   _id:1
          // },
          id: "$groupDetail._id",
          name: "$groupDetail.name",
          expense: 1,
          _id: 0,
        },
      },
    ]);
    const sum = groupList.reduce((prev,curr)=>prev+curr.expense,0)
    
    return sendResponse(res, 200, {items:groupList,total:sum}, "Groups fetched successfully.");
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getGroupDetails = async (req, res, next) => {
  try {
    // const user = req.user;
    const { groupId } = req.params;

    if(!groupId) {
      return sendError(res, 400, "Group id is required")
    }

    let groupRecords =  GroupRecord.find({ groupId })
      .populate({
        path: "userId",
        select: "name",
      })
      .lean();

      let groupInfo = Group.findById(groupId).select("name expense createdBy").lean();

       [groupRecords,groupInfo] = await Promise.all([groupRecords,groupInfo])

    return sendResponse(
      res,
      200,
      {groupRecords,groupInfo},
      "Group details fetched successfully."
    );
  } catch (err) {
    console.log(err);
    next(err);
  }
};
