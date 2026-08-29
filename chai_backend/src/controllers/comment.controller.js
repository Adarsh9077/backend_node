import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";

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
  const { userId } = req.user._id;
  const { content } = req.body;
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
    });
    return res
      .status(201)
      .json(new ApiResponse(201, commentObject, "comment add successfully"));
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json(
        new ApiError(401, { error: error }, "video id and content are required")
      );
  }
});

const updateComment = asyncHandler(async (req, res) => {
  //Todo: update a comment
  const { commentId } = req.params;
  const { content } = req.body;
  try {
    if (!commentId || !content) {
      return res
        .status(402)
        .json(new ApiError(402, {}, "Comment id and content are required"));
    }
  } catch (error) {
    console.log(error);
    return res.status(501).json(new ApiError(501, {}, "Server not responding"));
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  // const { videoId } = req.params;
  const { commentId } = req.params;
  //Todo: delete a comment
  try {
    if (!commentId) {
      return res.status(401).json(new ApiError(401, {}, "comment is required"));
    }

    const commentObject = await Comment.findByIdAndDelete(commentId);
    if (!commentObject) {
      return res.status(402).json(new ApiError(402, {}, "Comment not found"));
    }
    // if (commentObject)
    return res
      .status(202)
      .json(
        new ApiResponse(202, commentObject, "Comment deleted successfully")
      );
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json(new ApiError(401, "something went wrong", error.TypeError));
  }
});

export { getVideoComments, addComment, updateComment, deleteComment };
