import { asyncHandler } from "../utils/asyncHandler.js";

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
  console.log("Email:-> ",email)
});

export { registerUser };
