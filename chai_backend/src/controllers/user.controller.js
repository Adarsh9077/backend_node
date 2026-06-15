import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
const registerUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "ok",
  });
  //? get user detail from frontend
  //? Validation not not empty
  //? Check User already exists: username email
  //? Check for image, Check for Avatar
  //? Upload them cloudinary, avatar
  //? Create user object - create entry in db
  //? Remove password and refresh token field from response
  //? Check for user creation
  //? Return Response
  const { fullname, email, username, password } = req.body;
  console.log("Email:-> ", email);
  if (
    [fullname, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const existingUser = User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverPath[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }
});

export { registerUser };

// ? 34:35 Lec_13 Logic building | Register controller
