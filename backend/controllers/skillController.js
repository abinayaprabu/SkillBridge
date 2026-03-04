import Skill from "../models/Skill.js";
import User from "../models/User.js";

// Create Skill
export const createSkill = async (req, res) => {
  try {
    const skill = await Skill.create({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      duration: req.body.duration,
      user: req.user._id,
    });

    // 🔥 Add course to instructor's createdCourses array
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { createdCourses: skill._id }
      }
    );

    res.status(201).json(skill);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Skills
export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().populate("user", "name email");
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Skill
export const getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id)
      .populate("user", "name email");

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getMySkills = async (req, res) => {
  try {
    const skills = await Skill.find({
      user: req.user._id
    });

    res.json(skills);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};