import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthCheck = asyncHandler(async (req, res) => {
  //Todo: build a healthCheck response that simply return the OK status as json with a message
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Server is running. Everything is ok"));
});

export { healthCheck };
