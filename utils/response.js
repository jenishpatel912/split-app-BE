const sendResponse = (res, statusCode = 200, data,message) => {
  res.status(statusCode).json({ data, success: true ,message});
};

const sendError = (res,statusCode=500,message) => {
    res.status(statusCode).json({success:false,message})
}

export {sendError,sendResponse}
