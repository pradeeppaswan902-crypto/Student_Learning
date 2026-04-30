import React from 'react';

const Alumni = () => {
  const alumniProfiles = [
    {
      field: 'Software Engineering',
      details: 'Built scalable web applications and mentored junior developers through internship programs.',
      name: 'Maya Patel',
      currentCompany: 'NextGen Labs',
      currentPosition: 'Frontend Engineer',
      linkedIn: 'https://www.linkedin.com/in/maya-patel',
    },
    {
      field: 'Data Science',
      details: 'Focused on machine learning, data visualization, and real-time analytics pipelines.',
      name: 'Aarav Sharma',
      currentCompany: 'Insight Analytics',
      currentPosition: 'Data Scientist',
      linkedIn: 'https://www.linkedin.com/in/aarav-sharma',
    },
    {
      field: 'Product Design',
      details: 'Designed user-centered product experiences and collaborated closely with engineering teams.',
      name: 'Nina Roberts',
      currentCompany: 'Flow Studio',
      currentPosition: 'UX Designer',
      linkedIn: 'https://www.linkedin.com/in/nina-roberts',
    },
    {
      field: 'Digital Marketing',
      details: 'Implemented campaigns that improved conversion by 30% and expanded brand visibility.',
      name: 'Ethan Kim',
      currentCompany: 'BrandWave',
      currentPosition: 'Marketing Specialist',
      linkedIn: 'https://www.linkedin.com/in/ethan-kim',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-gray-800 font-semibold text-lg">Alumni Profiles</h3>
          <p className="text-sm text-gray-500">Explore alumni experiences and career paths.</p>
        </div>
        <span className="text-2xl">🎓</span>
      </div>

      <div className="space-y-4">
        {alumniProfiles.map((alumni, index) => (
          <div key={index} className="border border-gray-200 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h4 className="text-base font-semibold text-gray-900">{alumni.name}</h4>
                <p className="text-sm text-gray-600">{alumni.currentPosition} at {alumni.currentCompany}</p>
              </div>
              <a
                href={alumni.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
              >
                View LinkedIn
              </a>
            </div>

            <div className="grid gap-2 mt-4 text-sm text-gray-600">
              <div>
                <span className="font-semibold text-gray-700">Field:</span> {alumni.field}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Details:</span> {alumni.details}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Current Company:</span> {alumni.currentCompany}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Current Position:</span> {alumni.currentPosition}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alumni;
