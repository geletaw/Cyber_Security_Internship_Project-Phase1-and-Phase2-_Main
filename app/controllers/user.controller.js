// Phase 1 controllers
exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

// ------------------- Week 4 controllers -------------------
const db = require("../models");
const User = db.user;
const mongoose = require("mongoose");

// GET all users safely (admin only, handled in routes)
exports.allUsers = (req, res) => {
  User.find()
    .select("-password")
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => res.status(500).json({ message: err.message }));
};

// GET single user safely by ID
exports.getUserById = (req, res) => {
  const userId = req.query.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  User.findById(userId)
    .select("-password")
    .then(user => {
      if (!user) return res.status(404).json({ message: "User not found" });
      res.status(200).json(user);
    })
    .catch(err => res.status(500).json({ message: err.message }));
};