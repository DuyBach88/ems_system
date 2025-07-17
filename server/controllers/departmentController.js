import Department from "../models/Department.js";

const addDepartment = async (req, res) => {
  try {
    const { dep_name, description } = req.body;

    const newDepartment = await Department.create({
      dep_name,
      description,
    });
    return res.status(201).json({
      success: true,
      message: "Department added successfully",
      department: newDepartment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const listDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    return res.status(200).json({
      success: true,
      departments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const editDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { dep_name, description } = req.body;

    if (!dep_name || dep_name.length < 3) {
      return res.status(400).json({
        success: false,
        message:
          "Department name is required and must be at least 3 characters long",
      });
    }

    const department = await Department.findByIdAndUpdate(
      id,
      { dep_name, description: description || "" },
      { new: true, runValidators: true }
    );

    if (!department) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }

    res.status(200).json({
      success: true,
      message: "Department updated successfully",
      department,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating department",
      error: error.message,
    });
  }
};
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findById({ _id: id });
    await department.deleteOne();
    if (!department) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Department deleted successfully" });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error deleting department",
      error: error.message,
    });
  }
};
export const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      department,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { addDepartment, listDepartments, editDepartment, deleteDepartment };
