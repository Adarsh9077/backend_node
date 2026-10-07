import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new ApiError(401, {}, "video id required");
    }

    const likeObject = await Like.create({
      video: videoId,
      likedBy: req.user._id,
    });

    const like = await Video.findById(likeObject._id).populate({
      path: "owner",
      select: "username email fullName avatar",
    });

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          like,
          "This controller is on working"
        )
      );
  } catch (error) {
    throw new ApiError(401, {}, "video id required");
  }
  //TODO: toggle like on video
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
