const { Group } = require("../models/Group");
const { User } = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

exports.addGroup = async (req, res, next) => {
  try {
    const sender = await User.findById(req.body.senderId).select("_id name");
    if (!sender) {
      return next(new ErrorResponse("Can't get group sender", 400));
    }

    const receiver = await User.findById(req.body.receiverId).select("_id name");
    if (!receiver) {
      return next(new ErrorResponse("Can't get group receiver", 400));
    }

    const newGroup = new Group({
      members: [sender, receiver],
    });
    const savedGroup = await newGroup.save();
    res.status(200).json(savedGroup);
  } catch (error) {
    next(error);
  }
};

exports.getGroupById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("_id name");
    if (!user) {
      return next(new ErrorResponse("Can't get group user", 400));
    }

    const group = await Group.find({
      members: { $in: [user] },
    });
    if (!group) {
      return next(new ErrorResponse("Can't get group", 400));
    }

    res.status(200).json(group);
  } catch (error) {
    next(error);
  }
};
