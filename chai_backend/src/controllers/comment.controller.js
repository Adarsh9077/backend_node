import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";
import option from "../utils/pagination_options.js";
import mongoose from "mongoose";

const getVideoComments = asyncHandler(async (req, res) => {
  //Todo: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  try {
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json(new ApiError(400, {}, "Invalid video ID"));
    }

    const commentObject = await Comment.aggregatePaginate(
      [
        {
          $match: {
            video: new mongoose.Types.ObjectId(videoId),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
            pipeline: [
              {
                $project: {
                  username: 1,
                  email: 1,
                  fullName: 1,
                  avatar: 1,
                },
              },
            ],
          },
        },
        {
          $addFields: {
            owner: {
              $first: "$owner",
            },
          },
        },
        {
          $project: {
            _id: 1,
            content: 1,
            createdAt: 1,
            updatedAt: 1,
            owner: 1,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ],
      option({ page: page, limit: limit })
    );

    const comments = commentObject["docs"];
    const paginationData = {
      currentPage: commentObject["page"],
      limit: commentObject["limit"],
      totalComments: commentObject["totalDocs"],
      totalPages: commentObject["totalPages"],
      hasNextPage: commentObject["hasNextPage"],
      hasPrevPage: commentObject["hasPrevPage"],
    };
    return res
      .status(202)
      .json(
        new ApiResponse(
          202,
          { comments: comments, pagination: paginationData },
          "Comments "
        )
      );
  } catch (error) {
    return res.status(501).json(new ApiError(501, {}, "comments not founds"));
  }
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
    const commentObject = await Comment.findByIdAndUpdate(
      commentId,
      {
        $set: { content },
      },
      { new: true }
    );
    return res
      .status(202)
      .json(
        new ApiResponse(202, commentObject, "comment updated successfully")
      );
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
