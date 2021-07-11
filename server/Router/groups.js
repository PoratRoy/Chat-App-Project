const express = require("express");
const router = express.Router();
const { Group } = require("../models/Group");
const { User } = require("../models/User");

//post new group
//http://localhost:5000/chat/api/groups
router.post("/", async (req, res) => {
  try {

    const sender = await User.findById(req.body.senderId).select('_id name');
    if(!sender) return {error: 'Cant get group sender'};
    
    const receiver = await User.findById(req.body.receiverId).select('_id name');
    if(!receiver) return {error: 'Cant get group receiver'};

    const newGroup = new Group({
    members: [sender, receiver],
    });
    const savedGroup = await newGroup.save();
    res.status(200).json(savedGroup);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get group by id
//http://localhost:5000/chat/api/groups/:id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('_id name');

    const group = await Group.find({
      members: { $in: [user] },
    });
    res.status(200).json(group);
  } catch (err) {
    res.status(500).json('err');
  }
});

module.exports = router;
