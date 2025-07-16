"use client"

import Head from 'next/head';
import {useRouter} from 'next/navigation';

const MediaKitPage = () => {

  const router = useRouter();

  const handleHomeClick = () => {
    router.push('/home');
  };

  const handleLoginClick = () => {
    router.push('/sign-in')
  }
  const handleRegisterClick = () => {
    router.push('/sign-up')
  }

  return (
    // Apply body-like classes to this outermost div
    // Ensuring it takes full height and uses flexbox to center content vertically
    <div className="bg-gray-900 min-h-screen flex flex-col items-center text-white py-8 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>MediaKit</title>
      </Head>

      {/* Header - Removed absolute positioning, now part of the flex column flow */}
      <header className="w-full max-w-7xl flex justify-between items-center mb-16"> {/* Increased bottom margin */}
        <div className="text-2xl font-bold text-white">MediaKit</div>
        <div className="flex space-x-4">
          <button 
          onClick={handleLoginClick}
          className="px-5 py-2 rounded-md border border-gray-700 hover:border-white transition-colors duration-200 text-base">Login</button>
          <button
          onClick={handleRegisterClick}
           className="px-5 py-2 rounded-md bg-purple-700 hover:bg-purple-800 transition-colors duration-200 text-base">Register</button>
        </div>
      </header>

      {/* Main Content - Centered horizontally using mx-auto */}
      <main className="text-center flex flex-col items-center justify-center flex-grow"> {/* flex-grow to push footer down */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4">
          Compress your videos, <span className="text-purple-500">re-size images</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-12"> {/* Added bottom margin */}
          Fast, reliable, and completely free to use.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center space-y-8 sm:space-y-0 sm:space-x-12 mt-8 mb-16"> {/* Increased margins and added responsive flex */}
          {/* Video Compress */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-purple-700 flex items-center justify-center cursor-pointer hover:bg-purple-800 transition-colors duration-200 shadow-lg"> {/* Slightly larger circles, added shadow */}
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832L13 10.417V9.583L9.555 7.168z" clipRule="evenodd"></path>
              </svg>
            </div>
            <p className="mt-4 text-gray-300 text-lg">Video Compress</p>
          </div>

          {/* Image Resize */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-purple-700 flex items-center justify-center cursor-pointer hover:bg-purple-800 transition-colors duration-200 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414zM10 3a1 1 0 011 1v7a1 1 0 11-2 0V4a1 1 0 011-1z" clipRule="evenodd"></path>
              </svg>
            </div>
            <p className="mt-4 text-gray-300 text-lg">Image Resize</p>
          </div>
        </div>

        <p className="mt-8 text-gray-400 text-lg">Demo UI? Click below</p> 
        <button 
        onClick={handleHomeClick}
        className="mt-4 px-10 py-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 flex cursor-pointer items-center justify-center text-xl font-semibold shadow-lg">
          Home
        </button>
      </main>
    </div>
  );
};

export default MediaKitPage;