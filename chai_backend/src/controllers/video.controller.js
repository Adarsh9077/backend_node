import fs from "fs";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";

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
  // console.log(req);
  //   Todo: get video , upload on cloudinary, create video
  let videoFileLocalPath /*= req.files?.videoFile[0]?.path*/;

  if (req.files && req.files.videoFile && req.files.videoFile.length > 0) {
    videoFileLocalPath = req.files.videoFile[0].path;
  }
  let thumbnailLocalPath /* = req.files?.thumbnail[0]?.path*/;

  if (req.files && req.files.thumbnail && req.files.thumbnail.length > 0) {
    thumbnailLocalPath = req.files.thumbnail[0].path;
  }

  console.log(`${videoFileLocalPath} <----> ${thumbnailLocalPath}`);

  if (!videoFileLocalPath && !thumbnailLocalPath) {
    throw new ApiError(400, "video file and thumbnail are required");
  }

  const videoFileLink = await uploadOnCloudinary(videoFileLocalPath);
  const thumbnailLink = await uploadOnCloudinary(thumbnailLocalPath);

  const videoObject = await Video.create({
    videoFile: videoFileLink.url,
    thumbnail: thumbnailLink.url,
    title,
    description,
    duration: videoFileLink.duration,
    owner: req.user._id,
  });

  const video = await Video.findById(videoObject._id).populate({
    path: "owner",
    select: "username email fullname avatar coverImage",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, video, "video uploaded successfully"));
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
