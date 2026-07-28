import fs from "fs";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy } = req.query;
  console.log(req.query.bool);
  // const listOfVideos = await
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "checking getAllVideos"));
  //   Todo: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  console.log(
    `title -> ${title}\ndescription -> ${description}\n- \t----------\t -\n`
  );
  //   Todo: get video , upload on cloudinary, create video
  const videoFileLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  if (!videoFileLocalPath && !thumbnailLocalPath) {
    throw new ApiError(400, "video file and thumbnail is required");
  }
  // fs.unlinkSync(videoFileLocalPath);
  // fs.unlinkSync(thumbnailLocalPath);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "checking publish a video"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  console.log(req.params);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "checking getVideoById"));
  //   Todo: get video by id
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //   Todo: update video details like, title, description,thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  publishAVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
