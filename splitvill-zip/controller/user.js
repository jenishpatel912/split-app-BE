import { User } from "../models/user.model.js";
import { sendError, sendResponse } from "../utils/response.js";

const createUserController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // check fields
    if (!name || !email || !password) {
      return sendError(res, 400, "Every fields are required.");
    }

    // check email or username exists
    const findUser = await User.findOne({ $or: [{ email }, { name }] });

    if (findUser) {
      return sendError(
        res,
        400,
        "User with given username or email already exists."
      );
    }

    // create user
    let user = await User.create({ name, email, amount: 0, password });
    user = JSON.parse(JSON.stringify(user));
    delete user.password;
    console.log(user, "created user");
    return sendResponse(res, 201, user, "User created Successfully");
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const loginUserController = async (req, res, next) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return sendError(res, 400, "Every fields are required.");
    }

    // check user exists
    let findUser = await User.findOne({
      $or: [{ email: name }, { name }],
    });

    if (!findUser) {
      return sendError(res, 404, "Invalid username or password!");
    }

    const isPasswordCorrect = await findUser.comparePassword(password);

    if (!isPasswordCorrect) {
      return sendError(res, 404, "Invalid username or password!");
    }

    const data = {
      id: findUser._id,
      name: findUser.name,
    };

    const token = findUser.generateToken(data);
    findUser = JSON.parse(JSON.stringify(findUser)); 

    delete findUser.password;
    return sendResponse(
      res,
      200,
      { user:findUser, token },
      "User Loggedin Successfully"
    );
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export { createUserController, loginUserController };
