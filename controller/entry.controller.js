import mongoose from "mongoose";
import { sendError, sendResponse } from "../utils/response.js";
import { Entry } from "../models/entry.model.js";
import { Group } from "../models/group.model.js";
import { GroupRecord } from "../models/groupRecord.model.js";

// const ObjectId = mongoose.Schema.Types.ObjectId;

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

    await Group.findByIdAndUpdate(groupId, { $inc: { expense: total } });

    let debtAmount = total / users.length;
    let ownAmount = total - debtAmount;

    debtAmount = Number(debtAmount.toFixed(2));
    ownAmount = Number(ownAmount.toFixed(2));

    const promiseRecords = users.map((item) => {
      return {
        updateOne: {
          filter: {
            groupId,
            userId: item,
          },
          update: {
            $inc: { expense: user.id === item ? ownAmount : -debtAmount },
          },
        },
      };
    });

    await GroupRecord.bulkWrite(promiseRecords);
    return sendResponse(res, 200, newEntry, "New entry added");
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

export const settleEntryRecord = async (req, res, next) => {
  try {
    const { receiverId, payerId, groupId, amount } = req.body;

    const query1 = GroupRecord.findOne({ groupId, userId: receiverId });
    const query2 = GroupRecord.findOne({ groupId, userId: payerId });

    const [receiver, payer] = await Promise.all([query1, query2]);

    const receiverExpense = receiver.expense - amount;
    const payerExpense = payer.expense + amount;

    payer.expense = Math.abs(payerExpense.toFixed(2)) < 0.1 ? 0 : payerExpense;
    receiver.expense =
      Math.abs(receiverExpense.toFixed(2)) < 0.1 ? 0 : receiverExpense;

    payer.save();
    receiver.save();

    return sendResponse(res, 200, {}, "Record settled successfully");
  } catch (err) {
    console.log(err);
    next(err);
  }
};
