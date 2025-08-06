import React, { useState } from 'react';
import { RefreshCw, Heart, User, Film, LogOut, Play, Menu, X } from 'lucide-react';

const Header = ({ user = null, onSignOut, onStartOver, onProfileClick, onGalleryClick, onLogoClick, onSignIn }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAuthenticated = !!user;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
  <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-xl border-b border-red-500/20 shadow-2xl">
    <div className="container mx-auto px-4 sm:px-6 py-3">
      <div className="flex justify-between items-center">
        {/* Logo/Brand - Clickable */}
        <button 
          onClick={onLogoClick}
          className="flex items-center space-x-3 group hover:scale-105 transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-red-500/50 rounded-lg p-2"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative bg-gradient-to-r from-red-600 to-red-700 p-3 rounded-xl group-hover:from-red-500 group-hover:to-red-600 transition-all duration-300">
              <Play className="w-7 h-7 text-white group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-2xl font-black bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent group-hover:from-red-400 group-hover:to-red-300 transition-all duration-300">
              CinemaHint
            </h1>
            <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-200 -mt-1">
              AI-Powered Movie Discovery
            </p>
          </div>
          <div className="sm:hidden">
            <h1 className="text-xl font-black bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">
              CinemaHint
            </h1>
          </div>
        </button>
        
        {/* Desktop Navigation & User section */}
        <div className="hidden md:flex items-center space-x-2 sm:space-x-3">
          {/* Navigation Buttons - Show Gallery for everyone */}
          <button
            onClick={onGalleryClick}
            className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-200 bg-gray-800/50 hover:bg-gray-700/50 px-3 py-2 rounded-lg backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Film className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
            <span className="text-sm font-medium">Gallery</span>
          </button>
          
          {/* Auth-specific buttons */}
          {isAuthenticated && (
            <>
              <button
                onClick={onProfileClick}
                className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-200 bg-gray-800/50 hover:bg-gray-700/50 px-3 py-2 rounded-lg backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium">Profile</span>
              </button>
            
              
              <button
                onClick={onStartOver}
                className="group flex items-center space-x-2 text-gray-300 hover:text-green-400 transition-all duration-200 bg-gray-800/50 hover:bg-green-500/10 px-3 py-2 rounded-lg backdrop-blur-sm border border-gray-700/50 hover:border-green-500/30 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                <span className="text-sm font-medium">New Pick</span>
              </button>
              
              {/* User Profile Section */}
              <div className="flex items-center space-x-3 bg-gradient-to-r from-gray-800/70 to-gray-900/70 backdrop-blur-sm rounded-xl px-3 py-2 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200">
                <img 
                  src={user.profilePicture} 
                  alt={user.name}
                  className="w-8 h-8 rounded-full ring-2 ring-red-500/30 hover:ring-red-500/50 transition-all duration-200"
                />
                {/* <div className="hidden lg:block">
                  <div className="text-white text-sm font-medium">{user.name}</div>
                  <div className="text-gray-400 text-xs">{user.email}</div>
                </div> */}
                <button
                  onClick={onSignOut}
                  className="group text-gray-300 hover:text-red-400 transition-all duration-200 p-1.5 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
                </button>
              </div>
            </>
          )}

          {/* Sign In button for non-authenticated users */}
          {!isAuthenticated && onSignIn && (
            <button
              onClick={onSignIn}
              className="group flex items-center space-x-2 text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-200 px-4 py-2 rounded-lg shadow-lg hover:shadow-red-500/20 hover:-translate-y-0.5"
            >
              <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm font-medium">Sign In</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 text-gray-300 hover:text-white transition-colors rounded-lg bg-gray-800/30 hover:bg-red-600/20 border border-gray-700/30 hover:border-red-500/30"
        >
          <div className="relative w-5 h-5">
            <Menu className={`w-5 h-5 absolute transition-all duration-300 ${
              isMobileMenuOpen ? 'opacity-0 rotate-180 scale-75' : 'opacity-100 rotate-0 scale-100'
            }`} />
            <X className={`w-5 h-5 absolute transition-all duration-300 ${
              isMobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-180 scale-75'
            }`} />
          </div>
        </button>
      </div>

      {/* Mobile Menu Slide-out */}
      <>
        {/* Backdrop - Full screen overlay with fade animation */}
        <div 
          className={`fixed inset-0 bg-black/80 backdrop-blur-md z-40 md:hidden transition-opacity duration-400 ease-out ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={toggleMobileMenu}
          style={{ top: 0, left: 0, right: 0, bottom: 0 }}
        />
        
        {/* Slide-out Menu with slide animation */}
        <div className={`fixed top-0 right-0 h-screen w-80 max-w-[90vw] bg-gradient-to-b from-gray-900 via-black to-gray-900 border-l border-red-500/30 shadow-2xl z-50 md:hidden transform transition-all duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] overflow-y-auto ${
          isMobileMenuOpen 
            ? 'translate-x-0 opacity-100 scale-100' 
            : 'translate-x-full opacity-0 scale-95'
        }`}>
            <div className="p-6">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white">Menu</h2>
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 text-gray-300 hover:text-white transition-colors rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/30"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Menu Items */}
              <div className={`space-y-4 transition-all duration-500 delay-100 ${
                isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                {/* Gallery - Always visible */}
                <button
                  onClick={() => {
                    onGalleryClick();
                    toggleMobileMenu();
                  }}
                  className="w-full flex items-center space-x-3 text-gray-300 hover:text-white transition-all duration-200 bg-gray-800/30 hover:bg-red-600/20 border border-gray-700/30 hover:border-red-500/30 px-4 py-3 rounded-lg"
                >
                  <Film className="w-5 h-5" />
                  <span className="font-medium">Gallery</span>
                </button>

                {isAuthenticated ? (
                  <>
                    {/* Authenticated Menu Items */}
                    <button
                      onClick={() => {
                        onProfileClick();
                        toggleMobileMenu();
                      }}
                      className="w-full flex items-center space-x-3 text-gray-300 hover:text-white transition-all duration-200 bg-gray-800/30 hover:bg-red-600/20 border border-gray-700/30 hover:border-red-500/30 px-4 py-3 rounded-lg"
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        onStartOver();
                        toggleMobileMenu();
                      }}
                      className="w-full flex items-center space-x-3 text-gray-300 hover:text-green-400 transition-all duration-200 bg-gray-800/30 hover:bg-green-500/20 border border-gray-700/30 hover:border-green-500/30 px-4 py-3 rounded-lg"
                    >
                      <RefreshCw className="w-5 h-5" />
                      <span className="font-medium">New Pick</span>
                    </button>

                    {/* User Profile Info */}
                    <div className="border-t border-gray-700/50 pt-4 mt-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <img 
                          src={user.profilePicture} 
                          alt={user.name}
                          className="w-10 h-10 rounded-full ring-2 ring-red-500/30"
                        />
                        <div>
                          <div className="text-white font-medium">{user.name}</div>
                          <div className="text-gray-400 text-sm">{user.email}</div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          onSignOut();
                          toggleMobileMenu();
                        }}
                        className="w-full flex items-center space-x-3 text-gray-300 hover:text-red-400 transition-all duration-200 bg-gray-800/30 hover:bg-red-500/20 border border-gray-700/30 hover:border-red-500/30 px-4 py-3 rounded-lg"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  </>
                ) : (
                  /* Sign In for non-authenticated users */
                  onSignIn && (
                    <button
                      onClick={() => {
                        onSignIn();
                        toggleMobileMenu();
                      }}
                      className="w-full flex items-center justify-center space-x-3 text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-200 px-4 py-3 rounded-lg shadow-lg"
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">Sign In</span>
                    </button>
                  )
                )}
              </div>
            </div>
        </div>
      </>
    </div>
  </header>
  )}

export default Header;

