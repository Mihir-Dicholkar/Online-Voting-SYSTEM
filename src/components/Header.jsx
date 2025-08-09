import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSignInAlt, faUserCircle, faTimes } from '@fortawesome/free-solid-svg-icons'; // Added faUserCircle and faTimes

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false); // New state for the profile sidebar

  // Dummy state for profile setup steps
  const [profileSteps, setProfileSteps] = useState(0); // Assuming 0-10 steps
  const totalSteps = 10;

  // Form data state
  const [personalDetails, setPersonalDetails] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Validation state
  const [errors, setErrors] = useState({});

  // Function to toggle the mobile menu visibility
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Function to toggle the profile sidebar visibility
  const toggleProfileSidebar = () => {
    setIsProfileSidebarOpen(!isProfileSidebarOpen);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonalDetails({
      ...personalDetails,
      [name]: value,
    });
  };

  // Simple validation function
  const validateForm = () => {
    let newErrors = {};
    if (!personalDetails.name.trim()) {
      newErrors.name = 'Name is required.';
    }
    if (!personalDetails.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(personalDetails.email)) {
      newErrors.email = 'Email address is invalid.';
    }
    if (!personalDetails.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(personalDetails.phone)) {
      newErrors.phone = 'Phone number must be 10 digits.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDetails = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Logic for saving details (simulated)
      console.log('Details saved successfully!', personalDetails);
      // Here you would typically send data to a backend
      // For now, we'll just close the sidebar
      // setIsProfileSidebarOpen(false);
    }
  };

  // Common Tailwind classes for nav links
  const navLinkClasses = "relative text-white text-lg font-medium py-2 px-3 rounded-md transition duration-300 ease-in-out overflow-hidden group";
  const underlineClasses = "absolute bottom-0 left-0 h-0.5 bg-blue-200 w-0 group-hover:w-full transition-all duration-300 ease-out";

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-700 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Section: Logo and Site Title */}
        <div className="flex-shrink-0">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/headerlogo.png"
              alt="VoteEase Logo"
              className="rounded-full h-12 w-12 shadow-md"
            />
            <span className="text-white text-2xl font-bold tracking-wide">VoteEase</span>
          </Link>
        </div>

        {/* Center Section: Navigation Links (Hidden on small screens, visible on medium and up) */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className={navLinkClasses}>
            Home
            <span className={underlineClasses}></span>
          </Link>
          <Link to="/dashboard" className={navLinkClasses}>
            Dashboard
            <span className={underlineClasses}></span>
          </Link>
          <Link to="/elections" className={navLinkClasses}>
            Elections
            <span className={underlineClasses}></span>
          </Link>
          <Link to="/results" className={navLinkClasses}>
            Results
            <span className={underlineClasses}></span>
          </Link>
        </div>

        {/* Right Section: Icons / Mobile Menu Toggle */}
        <div className="flex items-center space-x-4">
          {/* Profile Icon */}
          <button
            onClick={toggleProfileSidebar}
            className="text-white hover:text-blue-200 hidden md:block"
            aria-label="Open profile sidebar"
          >
            <FontAwesomeIcon icon={faUserCircle} size="2x" className="transform hover:scale-110 transition duration-300 ease-in-out" />
          </button>

          {/* Login Icon */}
          <Link to="/login" className="text-white hover:text-blue-200 hidden md:block">
            <FontAwesomeIcon icon={faSignInAlt} size="2x" className="transform hover:scale-110 transition duration-300 ease-in-out" />
          </Link>

          {/* Mobile Menu Button (Visible only on small screens) */}
          <button
            onClick={toggleMobileMenu}
            className="text-white md:hidden focus:outline-none p-2 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
            aria-label="Toggle mobile menu"
          >
            <FontAwesomeIcon icon={faBars} size="2x" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-700 py-2 mt-2 rounded-lg shadow-md">
          {/* ... mobile menu links ... */}
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-white px-4 py-2 hover:bg-blue-600 rounded-md transition duration-300 ease-in-out">Home</Link>
          <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block text-white px-4 py-2 hover:bg-blue-600 rounded-md transition duration-300 ease-in-out">Dashboard</Link>
          <Link to="/elections" onClick={() => setIsMobileMenuOpen(false)} className="block text-white px-4 py-2 hover:bg-blue-600 rounded-md transition duration-300 ease-in-out">Elections</Link>
          <Link to="/results" onClick={() => setIsMobileMenuOpen(false)} className="block text-white px-4 py-2 hover:bg-blue-600 rounded-md transition duration-300 ease-in-out">Results</Link>
          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block text-white px-4 py-2 hover:bg-blue-600 rounded-md transition duration-300 ease-in-out">
            <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
            Login
          </Link>
        </div>
      )}

      {/* Profile Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 w-80 bg-white shadow-xl transform ${
          isProfileSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-blue-800">Profile Setup</h2>
          <button
            onClick={toggleProfileSidebar}
            className="text-gray-500 hover:text-red-500"
            aria-label="Close profile sidebar"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        <div className="p-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-600">
              Steps Completed: {profileSteps} of {totalSteps}
            </h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
              <div
                className="bg-green-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(profileSteps / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Profile Setup Form */}
          <form onSubmit={handleSaveDetails}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={personalDetails.name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={personalDetails.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={personalDetails.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>

            {/* Simulated steps to show progress */}
            <div className="mb-4">
                <p className="text-gray-600">
                    This is a simulation of a multi-step form.
                </p>
                <div className="flex space-x-2 mt-2">
                    <button
                        type="button"
                        onClick={() => setProfileSteps(Math.max(0, profileSteps - 1))}
                        className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                    >
                        Prev Step
                    </button>
                    <button
                        type="button"
                        onClick={() => setProfileSteps(Math.min(totalSteps, profileSteps + 1))}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
                    >
                        Next Step
                    </button>
                </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Save Details
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Header;