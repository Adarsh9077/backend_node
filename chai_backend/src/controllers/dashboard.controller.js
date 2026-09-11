import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import option from "../utils/pagination_options";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const { page = 1, limit = 20 } = req.query;
  try {
    if (!channelId) {
      return res
        .status(401)
        .json(new ApiError(401, {}, "Channel Id is required"));
    }
    const channelsListedVideos = await Video.aggregatePaginate(
      [
        {
          $sort: {
            created: -1,
          },
        },
      ],
      option({ page: page, limit: limit })
    );
  } catch (error) {
    return res
      .status(501)
      .json(new ApiError(501, {}, "Channel not found,Try again"));
  }

  // TODO: Get all the videos uploaded by the channel
});

export { getChannelStats, getChannelVideos };
//! add large file uploader 