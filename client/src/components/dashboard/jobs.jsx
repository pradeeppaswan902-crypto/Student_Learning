import React, { useState, useEffect } from 'react';
import api from '../../confiq/api';
import toast from 'react-hot-toast';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs');
      setJobs(response.data);
      console.log('✅ Jobs fetched:', response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load job listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApply = (applicationLink) => {
    window.open(applicationLink, '_blank');
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen my-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Job & Internship Opportunities
        </h1>

        {/* Equal Size Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden h-full flex flex-col"
            >
              <div className="p-6 flex flex-col flex-1">
                {/* Top Section */}
                <div className="mb-4">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2">
                    {job.field}
                  </span>

                  <span
                    className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ml-2 ${
                      job.type === 'internship'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {job.type === 'internship' ? 'Internship' : 'Job'}
                  </span>

                  <h2 className="text-xl font-bold text-gray-900 mt-3 mb-2 line-clamp-2">
                    {job.role}
                  </h2>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-1">
                    {job.companyName}
                  </p>
                </div>

                {/* Middle Section */}
                <div className="space-y-4 flex-1">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">
                      Details
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-4">
                      {job.details}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Required Skills
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills?.slice(0, 6).map((skill, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Button */}
                <button
                  onClick={() => handleApply(job.applicationLink)}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {jobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No job listings available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;