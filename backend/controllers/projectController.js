import Project from "../models/Project.js";

// Create Project
export const createProject = async (req, res) => {
  try {
    const { skillId, description } = req.body;

    const project = await Project.create({
      skill: skillId,
      buyer: req.user._id,
      description,
      status: "pending",
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Logged-in User Projects
export const getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ buyer: req.user._id }, { seller: req.user._id }],
    })
      .populate("buyer", "name email")
      .populate("seller", "name email")
      .populate("skill", "title price");

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
