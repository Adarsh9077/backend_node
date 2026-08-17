import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //Todo: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  try {
  } catch (error) {}
});

const addComment = asyncHandler(async (req, res) => {
  //Todo: add a comment to a video
  const { videoId } = req.params;
  const { content } = req.body;
  const { userId } = req.user._id;
  try {
    if (!videoId || !content) {
      return res
        .status(401)
        .json(new ApiError(401, {}, "video id and content are required"));
    }
    const commentObject = await Comment.create({
      content: content,
      video: videoId,
      owner: userId,
    }).populate({ path: "owner", select: "username fullname email avatar" });
    return res
      .status(201)
      .json(new ApiResponse(201, commentObject, "comment add successfully"));
  } catch (error) {}
});

const updateComment = asyncHandler(async (req, res) => {
  //Todo: update a comment
});

const deleteComment = asyncHandler(async (req, res) => {
  //Todo: delete a comment
});

export { getVideoComments, addComment, updateComment, deleteComment };
