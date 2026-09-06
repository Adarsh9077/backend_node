import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";
import fs from "fs";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy } = req.query;
  console.log(req.query);

  try {
    //   Todo: get all videos based on query, sort, pagination

    //! const videoObject = await Video.aggregatePaginate([], {});

    const videoList = await Video.find({}).populate({
      path: "owner",
      select: "username email fullName avatar coverImage",
    });
    return res
      .status(200)
      .json(
        new ApiResponse(200, { videos: videoList }, "checking getAllVideos")
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, {}, "enable to load video list"));
  }
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description, isPublished } = req.body;
  console.log(
    `title -> ${title}\ndescription -> ${description}\n- \t----------\t -\n`
  );

  try {
    let videoFileLocalPath;
    let thumbnailLocalPath /* = req.files?.thumbnail[0]?.path*/;
    // 1. VALIDATE INPUT FIELDS
    if (!title || !description || typeof isPublished !== "boolean") {
      // Clean up any uploaded files if validation fails
      if (req.files) {
        if (req.files.videoFile) {
          fs.unlinkSync(req.files.videoFile[0].path);
        }
        if (req.files.thumbnail) {
          fs.unlinkSync(req.files.thumbnail[0].path);
        }
      }
      throw new ApiError(
        400,
        "Title, description, and isPublished are required"
      );
    }
    if (req.files && req.files.videoFile && req.files.videoFile.length > 0) {
      videoFileLocalPath = req.files.videoFile[0].path;
    }

    if (req.files && req.files.thumbnail && req.files.thumbnail.length > 0) {
      thumbnailLocalPath = req.files.thumbnail[0].path;
    }

    console.log(`${videoFileLocalPath} <----> ${thumbnailLocalPath}`);

    if (!videoFileLocalPath || !thumbnailLocalPath) {
      // throw new ApiError(400, "video file and thumbnail are required");
      return res
        .status(401)
        .json(new ApiError(401, {}, "video file and thumbnail are required"));
    }

    const videoFileLink = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnailLink = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoFileLink.url || !thumbnailLink.url) {
      // throw new ApiError(400, "video file and thumbnail are required");
      return res
        .status(401)
        .json(
          new ApiError(401, {}, "Error while uploading on video or thumbnail")
        );
    }

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
      select: "username email fullName avatar coverImage",
    });

    return res
      .status(200)
      .json(new ApiResponse(200, video, "video uploaded successfully"));
  } catch (error) {
    console.log("user not able to upload video on cloud");
    return res.status(500).json(new ApiError(500, {}, "Failed to upload "));
  }
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // 1. Check and increment views
  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $inc: { views: 1 },
    },
    {
      new: true,
    }
  );

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // 2. Get complete video details
  const videoObject = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },

    // Video Owner
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
              coverImage: 1,
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

    // Comments
    {
      $lookup: {
        from: "comments",
        let: {
          videoId: "$_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$video", "$$videoId"],
              },
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
                    fullName: 1,
                    username: 1,
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
        ],
        as: "comments",
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, videoObject[0], "Video found successfully"));
});
const updateVideoTitleAndDescription = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  //   Todo: update video details like, title, description
  const userId = req.user._id.toString();
  try {
    if (!title || !description) {
      return res
        .status(401)
        .json(
          new ApiError(
            401,
            { title: "not found", description: "not found" },
            "title and description are required"
          )
        );
    }
    const videoObject = await Video.findById(videoId);

    if (!videoObject) {
      throw new ApiError(404, {}, "Video not found");
    }
    // Check ownership
    if (videoObject.owner.toString() !== userId) {
      throw new ApiError(403, {}, "Not authorized");
    }
    const newVideoObject = await Video.findByIdAndUpdate(
      videoId,
      { $set: { title, description } },
      { new: true }
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          newVideoObject,
          "title and description was updated"
        )
      );
  } catch (error) {
    throw new ApiError(
      401,
      {},
      error?.message || "video not found or something else"
    );
  }
});

const updateVideoThumbnail = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  try {
    const videoObject = await Video.findById(videoId);
    if (!videoObject) {
      return res.status(404).json(new ApiError(404, {}, "Video not found"));
    }

    if (req.user._id.toString() != videoObject.owner.toString()) {
      return res.status(401).json(new ApiError(401, {}, "Unauthorized User"));
    }

    let thumbnailLocalPath;
    console.log(req.file);
    if (req.file && req.file.path) {
      thumbnailLocalPath = req.file.path;
    }
    if (!thumbnailLocalPath) {
      // throw new ApiError(400, "video file and thumbnail are required");
      return res
        .status(401)
        .json(new ApiError(401, {}, "Thumbnail is required"));
    }
    const thumbnailLink = await uploadOnCloudinary(thumbnailLocalPath);

    if (!thumbnailLink.url) {
      return res
        .status(401)
        .json(
          new ApiError(401, {}, "Error while uploading on video or thumbnail")
        );
    }
    const newVideoObject = await Video.findByIdAndUpdate(
      videoId,
      {
        $set: { thumbnail: thumbnailLink.url },
      },
      { new: true }
    );

    const deleteResult = await deleteOnCloudinary(videoObject.thumbnail);
    console.log(`${deleteResult.result}`);

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          newVideoObject,
          "Thumbnail controller in on progress"
        )
      );
    // }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError(500, [error], "Not able to upload thumbNail"));
  }
});

const updateVideoFile = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  try {
    const videoObject = await Video.findById(videoId);
    if (!videoObject) {
      return res.status(404).json(new ApiError(404, {}, "Video not found"));
    }

    if (req.user._id !== videoObject.owner.toString()) {
      return res.status(401).json(new ApiError(401, {}, "Unauthorized User"));
    }

    let videoLocalPath;
    if (req.files && req.file && req.file.path) {
      videoLocalPath = req.file.path;
    }
    if (!videoLocalPath) {
      // throw new ApiError(400, "video file and thumbnail are required");
      return res.status(401).json(new ApiError(401, {}, "video is required"));
    }
    const videoLink = await uploadOnCloudinary(videoLocalPath);

    if (!videoLink.url) {
      return res
        .status(401)
        .json(
          new ApiError(401, {}, "Error while uploading on video or thumbnail")
        );
    }
    const newVideoObject = await Video.findByIdAndUpdate(
      videoId,
      {
        $set: { video: videoLink.url },
      },
      { new: true }
    );

    const deleteResult = await deleteOnCloudinary(videoObject.video);
    console.log(`${deleteResult.result}`);

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          newVideoObject,
          "video update controller in on progress"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(404, {}, "Error video not uploaded"));
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const videoObject = await Video.findById(videoId).session(session);

    if (!videoObject) {
      throw new ApiError(404, {}, "Video not found");
    }

    // Check ownership
    if (videoObject.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, {}, "Not authorized");
    }

    // Try Cloudinary deletion first
    let cloudinarySuccess = true;
    let errorMessages = [];

    if (videoObject.videoFile) {
      const result = await deleteOnCloudinary(videoObject.videoFile);
      if (!result.success) {
        cloudinarySuccess = false;
        errorMessages.push(`Video: ${result.message}`);
      }
    }

    if (videoObject.thumbnail) {
      const result = await deleteOnCloudinary(videoObject.thumbnail);
      if (!result.success) {
        cloudinarySuccess = false;
        errorMessages.push(`Thumbnail: ${result.message}`);
      }
    }

    // If Cloudinary deletion fails, don't delete from DB
    if (!cloudinarySuccess) {
      throw new ApiError(
        500,
        {},
        `Cloudinary deletion failed: ${errorMessages.join(", ")}`
      );
    }

    // Delete from database
    const deletedVideo =
      await Video.findByIdAndDelete(videoId).session(session);

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { videoId: deletedVideo._id },
          "Video deleted successfully"
        )
      );
  } catch (error) {
    // Rollback transaction on any error
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  console.log(req.params);
  try {
    const videoObject = await Video.findById(videoId);
    if (!videoObject) {
      throw new ApiError(404, {}, "Video not found");
    }

    // Check ownership
    if (videoObject.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, {}, "Not authorized");
    }
    console.log(!videoObject.isPublished);

    const video = await Video.findByIdAndUpdate(
      videoId,
      {
        $set: { isPublished: !videoObject.isPublished },
      },
      { new: true }
    ).populate({
      path: "owner",
      select: "username email fullName avatar coverImage",
    });

    return res
      .status(200)
      .json(new ApiResponse(200, video, "toggle published video controller"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, {}, "Enable to change video state"));
  }
});

export {
  publishAVideo,
  getAllVideos,
  getVideoById,
  deleteVideo,
  updateVideoFile,
  togglePublishStatus,
  updateVideoThumbnail,
  updateVideoTitleAndDescription,
};
