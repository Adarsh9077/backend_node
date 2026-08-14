import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getAllVideos,
  getVideoById,
  publishAVideo,
  deleteVideo,
  togglePublishStatus,
  updateVideoThumbnail,
  updateVideoTitleAndDescription,
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getAllVideos)
  .post(
    upload.fields([
      { name: "videoFile", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
    publishAVideo
  );

router.route("/:videoId").get(getVideoById).delete(deleteVideo);
router
  .route("/update-thumbnail/:videoId")
  .patch(upload.single("thumbnail"), updateVideoThumbnail);

router
  .route("/update-title-desc/:videoId")
  .patch(updateVideoTitleAndDescription);
router.route("/toggle/publish/:videoId").patch(togglePublishStatus);
export default router;
