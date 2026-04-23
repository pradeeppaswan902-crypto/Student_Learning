import BackupClassRequest from "../models/backupClassRequestModel.js";
import cloudinary from "../config/cloudinary.js";

// Create a new backup class request
export const createBackupClassRequest = async (req, res) => {
  try {
    const { course, topic, description } = req.body;
    const student = req.user.id;

    const newRequest = new BackupClassRequest({
      student,
      course,
      topic,
      description,
      type: "backup", // 🔥 ADD THIS
    });

    await newRequest.save();

    res.status(201).json({
      message: "Backup class request submitted successfully",
      request: newRequest,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all backup class requests for the current student
export const getStudentBackupRequests = async (req, res) => {
  try {
    const student = req.user.id;

    const requests = await BackupClassRequest.find({ student })
      .populate("course", "name instructor")
      .sort({ requestedAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error("Error fetching backup class requests:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all backup class requests (for admin)
export const getAllBackupRequests = async (req, res) => {
  try {
    const requests = await BackupClassRequest.find()
      .populate("student", "email")
      .populate("course", "name instructor")
      .sort({ requestedAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error("Error fetching all backup class requests:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update backup class request status (for admin)
export const updateBackupRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, scheduledAt, adminNotes } = req.body;

    const updateData = { status };
    if (scheduledAt) updateData.scheduledAt = scheduledAt;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    
    if (status === "completed") {
      updateData.completedAt = new Date();
    }

    const updatedRequest = await BackupClassRequest.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate("student", "email").populate("course", "name");

    if (!updatedRequest) {
      return res.status(404).json({ message: "Backup class request not found" });
    }

    res.json({
      message: "Backup class request updated successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Error updating backup class request:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const createDoubtRequest = async (req, res) => {
  try {
    const { course, topic, description } = req.body;
    const student = req.user.id;

    let attachmentUrl = null;

    // Handle file upload to Cloudinary if attachment exists
    if (req.file) {
      try {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'doubts',
              resource_type: 'auto',
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
        attachmentUrl = result.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({ message: 'Failed to upload attachment' });
      }
    }

    const newDoubt = new BackupClassRequest({
      student,
      course,
      topic,
      description,
      type: "doubt", // 🔥 IMPORTANT
      attachment: attachmentUrl,
    });

    await newDoubt.save();

    res.status(201).json({
      message: "Doubt submitted successfully",
      doubt: newDoubt,
    });
  } catch (error) {
    console.error('Error creating doubt request:', error);
    res.status(500).json({ message: "Server error" });
  }
};