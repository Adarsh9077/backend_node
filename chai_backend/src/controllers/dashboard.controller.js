import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import option from "../utils/pagination_options.js";

const getChannelStatus = asyncHandler(async (req, res) => {
  // TODO: Get the channel status like total video views, total subscribers, total videos, total likes etc.
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const { page = 1, limit = 20, sortBy = "asc" } = req.query;
  try {
    if (!channelId) {
      throw new ApiError(401, {}, "Channel Id is required");
    }
    console.log(channelId);
    const channelsListedVideos = await Video.aggregatePaginate(
      [
        {
          $sort: {
            createdAt: 1,
          },
        },
        {
          $match: { owner: new mongoose.Types.ObjectId(channelId) },
        },
      ],
      option({ page: page, limit: limit })
    );
    return res
      .status(202)
      .json(new ApiResponse(202, channelsListedVideos, "Testing......."));
  } catch (error) {
    throw new ApiError(501, {}, "Channel not found,Try again");
  }

  // TODO: Get all the videos uploaded by the channel
});

export { getChannelStatus, getChannelVideos };
//! add large file uploader
