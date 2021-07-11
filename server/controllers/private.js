const { User } = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");


exports.currentUser = async (req, res, next) => { //no use
  try {
    const token = req.header("x-auth-Token"); 
    console.log('user - ',token);

    const user = await User.findById(req.user).select("-password");
    if (!user) {
      return next(new ErrorResponse("Cant get user", 400));
    }

    res.status(200).json({
      name: user.name,
      userName: user.userName,
      _id: user._id,
    });
  } catch (error) {
    next(error);
  }
};

exports.allUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("_id name");

    if (!users) {
      return next(new ErrorResponse("Cant get users", 400));
    }

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

exports.userById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("_id name");
    if (!user) {
      return next(new ErrorResponse("Cant get user", 400));
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      userName: user.userName,
    });
  } catch (error) {
    next(error);
  }
};
