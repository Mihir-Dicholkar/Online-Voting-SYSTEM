import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons'; // Import brand icons

const Footer = () => {
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    // Function to update date and time
    const updateDateTime = () => {
      const now = new Date();
      // Format date as YYYY-MM-DD
      const date = now.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
      // Format time as HH:MM:SS (24-hour format)
      const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      setCurrentDateTime(`${date} ${time}`);
    };

    // Update immediately on component mount
    updateDateTime();

    // Set up interval to update every second
    const intervalId = setInterval(updateDateTime, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  return (
    <footer className="bg-gradient-to-r from-blue-700 to-purple-800 text-white p-6 mt-8 shadow-inner">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        {/* Left Section: Copyright and Project Name */}
        <div className="mb-4 md:mb-0">
          <p className="text-lg font-semibold">&copy; {new Date().getFullYear()} VoteEase. All rights reserved.</p>
          <p className="text-sm text-blue-200">Your secure online voting platform.</p>
        </div>

        {/* Center Section: Social Media Links */}
        <div className="flex space-x-6 mb-4 md:mb-0">
          <a href="https://facebook.com/voteease" target="_blank" rel="noopener noreferrer"
             className="text-white hover:text-blue-300 transform hover:scale-125 transition-transform duration-300">
            <FontAwesomeIcon icon={faFacebookF} size="lg" />
          </a>
          <a href="https://twitter.com/voteease" target="_blank" rel="noopener noreferrer"
             className="text-white hover:text-blue-300 transform hover:scale-125 transition-transform duration-300">
            <FontAwesomeIcon icon={faTwitter} size="lg" />
          </a>
          <a href="https://instagram.com/voteease" target="_blank" rel="noopener noreferrer"
             className="text-white hover:text-blue-300 transform hover:scale-125 transition-transform duration-300">
            <FontAwesomeIcon icon={faInstagram} size="lg" />
          </a>
          <a href="https://linkedin.com/company/voteease" target="_blank" rel="noopener noreferrer"
             className="text-white hover:text-blue-300 transform hover:scale-125 transition-transform duration-300">
            <FontAwesomeIcon icon={faLinkedinIn} size="lg" />
          </a>
        </div>

        {/* Right Section: Current Date and Time */}
        <div>
          <p className="text-lg font-medium">Current Time:</p>
          <p className="text-xl font-bold text-blue-100">{currentDateTime}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
