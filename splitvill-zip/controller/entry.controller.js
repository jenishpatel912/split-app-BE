import mongoose from "mongoose";
import { sendError, sendResponse } from "../utils/response.js";
import { Entry } from "../models/entry.model.js";

export const createEntry = async (req, res, next) => {
  try {
    const user = req.user;
    const { remark, users, groupId, total } = req.body;

    if (!groupId) {
      return sendError(res, 400, "Group id is required");
    }

    if (!total) {
      return sendError(res, 400, "Total is required");
    }

    if (!users?.length) {
      return sendError(res, 400, "Atleast one user is required");
    }

    const newEntry = await Entry.create({
      users,
      entryBy: user.id,
      remark,
      total,
      groupId,
    });

    // export const getDepthRecord = (list) => {
    //     const record = {};

    //     const ownList = list.filter((item) => item.amount > 0);
    //     const depthList = list.filter((item) => item.amount < 0);

    //     const totalCost = ownList.reduce((prev, curr) => prev + curr.amount, 0);

    //     depthList.forEach((elem) => {
    //       ownList.forEach((owElm) => {
    //         console.log(owElm, totalCost);
    //         const percentHold = getPercentage(owElm.amount, totalCost);
    //         console.log(percentHold,"percentage")
    //         const finalValue = (percentHold * elem.amount) / 100;
    //         record[elem.id]
    //           ? record[elem.id].push({ to: owElm, cost: finalValue })
    //           : (record[elem.id] = [{ to: owElm, cost: finalValue }]);
    //         record[owElm.id]
    //           ? record[owElm.id].push({ from: elem, cost: finalValue })
    //           : (record[owElm.id] = [{ from: elem, cost: finalValue }]);
    //       });
    //     });

    //     return record;
    //   };
  } catch (err) {
    console.log(err);
    next(err);
  }
};
