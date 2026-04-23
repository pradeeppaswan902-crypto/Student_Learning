import Job from '../models/jobModel.js';

// Get all active jobs and internships
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });

    console.log('✅ Jobs fetched:', jobs.length);
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
};

// Get job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ message: 'Failed to fetch job' });
  }
};

// Create a new job listing (admin only)
export const createJob = async (req, res) => {
  try {
    const { field, details, companyName, role, requiredSkills, applicationLink, type } = req.body;

    const job = new Job({
      field,
      details,
      companyName,
      role,
      requiredSkills,
      applicationLink,
      type: type || 'job'
    });

    const savedJob = await job.save();

    console.log('✅ Job created:', savedJob._id);
    res.status(201).json(savedJob);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Failed to create job' });
  }
};

// Update job listing (admin only)
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    console.log('✅ Job updated:', job._id);
    res.json(job);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ message: 'Failed to update job' });
  }
};

// Delete job listing (admin only)
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    console.log('✅ Job deactivated:', job._id);
    res.json({ message: 'Job listing deactivated successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Failed to delete job' });
  }
};