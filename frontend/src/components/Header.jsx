import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSignInAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

import ProfileSidebar from './ProfileSideBar';// ✅ import your sidebar

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);

  // Toggle functions
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleProfileSidebar = () => setIsProfileSidebarOpen(!isProfileSidebarOpen);

  // Common Tailwind classes for nav links
  const navLinkClasses = "relative text-white text-lg font-medium py-2 px-3 rounded-md transition duration-300 ease-in-out overflow-hidden group";
  const underlineClasses = "absolute bottom-0 left-0 h-0.5 bg-blue-200 w-0 group-hover:w-full transition-all duration-300 ease-out";

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-700 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Section: Logo */}
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

        {/* Center Section: Navigation */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className={navLinkClasses}>
            Home <span className={underlineClasses}></span>
          </Link>
        
          <Link to="/voting" className={navLinkClasses}>
            Elections <span className={underlineClasses}></span>
          </Link>
          <Link to="/results" className={navLinkClasses}>
            Results <span className={underlineClasses}></span>
          </Link>
        </div>

        {/* Right Section: Icons */}
        <div className="flex items-center space-x-4">
          {/* Profile Icon */}
          <button
            onClick={toggleProfileSidebar}
            className="text-white hover:text-blue-200 hidden md:block"
            aria-label="Open profile sidebar"
          >
            <FontAwesomeIcon icon={faUserCircle} size="2x" className="transform hover:scale-110 transition duration-300 ease-in-out" />
          </button>

           <SignedIn>
    <UserButton 
      afterSignOutUrl="/" 
      appearance={{
        elements: {
          avatarBox: "h-9 w-9 md:h-10 md:w-10",
        },
      }}
    />
  </SignedIn>

  {/* 🔐 Show this when signed out */}
  <SignedOut>
    <SignInButton mode="modal">
      <button className="text-white hover:text-blue-200 hidden md:block">
        <FontAwesomeIcon
          icon={faSignInAlt}
          size="2x"
          className="transform hover:scale-110 transition duration-300 ease-in-out"
        />
      </button>
    </SignInButton>
  </SignedOut>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="text-white md:hidden focus:outline-none p-2 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
            aria-label="Toggle mobile menu"
          >
            <FontAwesomeIcon icon={faBars} size="2x" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-700 py-2 mt-2 rounded-lg shadow-md">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-white px-4 py-2 hover:bg-blue-600 rounded-md">Home</Link>
          
          <Link to="/voting" onClick={() => setIsMobileMenuOpen(false)} className="block text-white px-4 py-2 hover:bg-blue-600 rounded-md">Elections</Link>
          <Link to="/results" onClick={() => setIsMobileMenuOpen(false)} className="block text-white px-4 py-2 hover:bg-blue-600 rounded-md">Results</Link>
          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block text-white px-4 py-2 hover:bg-blue-600 rounded-md">
            <FontAwesomeIcon icon={faSignInAlt} className="mr-2" /> Login
          </Link>
        </div>
      )}

      {/* ✅ Use the ProfileSidebar component */}
      <ProfileSidebar 
        isProfileSidebarOpen={isProfileSidebarOpen} 
        toggleProfileSidebar={toggleProfileSidebar} 
      />
    </nav>
  );
};

export default Header;
