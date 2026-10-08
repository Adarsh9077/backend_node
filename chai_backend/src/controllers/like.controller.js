import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new ApiError(401, "video id is required");
    }

    const likePipeline = await Like.aggregate([
      {
        $match: {
          video: new mongoose.Types.ObjectId(videoId),
          likedBy: new mongoose.Types.ObjectId(req.user._id),
        },
      },
    ]);
    let likeObject;
    let like;

    if (likePipeline[0] == null) {
      likeObject = await Like.create({
        video: videoId,
        likedBy: req.user._id,
      });
      like = await Like.findById(likeObject._id).populate({
        path: "likedBy",
        select: "username email fullName avatar",
      });
      return res.status(201).json(new ApiResponse(201, like, "Video is liked"));
    } else {
      // Todo: Delete like doc
      const query = { _id: likePipeline[0]._id };
      const deleteLikeResult = await Like.deleteOne(query);
      // console.log(deleteLikeResult);
      return res.status(201).json(new ApiResponse(201, "Like removed"));
    }
  } catch (error) {
    throw new ApiError(401, error.message, "This video is not able to like");
  }
  //TODO: toggle like on video
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
  try {
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      throw new ApiError(401, {}, "comment Id is required");
    }
    const likeObject = await Like.create({
      comment: commentId,
      likedBy: req.user._id,
    });

    const like = await Like.findById(likeObject._id).populate({
      path: "likedBy",
      select: "username email fullName avatar",
    });

    return res
      .status(201)
      .json(new ApiResponse(201, like, "This controller is on working"));
  } catch (error) {
    throw new ApiError(401, {}, "video id required");
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
