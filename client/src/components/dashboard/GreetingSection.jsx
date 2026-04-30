import React, { useState, useEffect } from 'react';

const GreetingSection = ({ studentName }) => {
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      let greetingText = '';

      if (hour < 12) {
        greetingText = 'Good Morning';
      } else if (hour < 18) {
        greetingText = 'Good Afternoon';
      } else {
        greetingText = 'Good Evening';
      }

      setGreeting(greetingText);
      setCurrentTime(new Date());
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            {greeting}, {studentName}! 
          </h1>
          <p className="text-blue-100 text-lg">
            Welcome back to your learning journey
          </p>
          <p className="text-blue-200 text-sm mt-3">
             {formatDate(currentTime)}
          </p>
        </div>
        <div className="text-right">
          <div className="text-5xl">
            {greeting === 'Good Morning'}
            {greeting === 'Good Afternoon'}
            {greeting === 'Good Evening'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GreetingSection;
