// are assumed to be handled by a root layout.tsx or globals.css file.

const Page = () => {
  return ( <>
      <style>
          {`
          /* Custom scrollbar for better aesthetics */
          ::-webkit-scrollbar {
              width: 8px;
              height: 8px;
          }

          ::-webkit-scrollbar-track {
              background: #2a2a2a;
              border-radius: 10px;
          }

          ::-webkit-scrollbar-thumb {
              background: #4a4a4a;
              border-radius: 10px;
          }

          ::-webkit-scrollbar-thumb:hover {
              background: #5a5a5a;
          }

          /* Subtle 3D effect for cards and buttons */
          .card-3d {
              transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          }

          .card-3d:hover {
              transform: translateY(-3px);
              box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
          }

          .btn-3d {
              transition: transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
          }

          .btn-3d:active {
              transform: translateY(1px);
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          }

          /* Animation for the 3D cube */
          @keyframes rotateCube {
              from {
                  transform: rotateX(0deg) rotateY(0deg);
              }
              to {
                  transform: rotateX(360deg) rotateY(360deg);
              }
          }

          .cube-container {
              perspective: 1000px;
          }

          .cube {
              width: 50px;
              height: 50px;
              position: relative;
              transform-style: preserve-3d;
              animation: rotateCube 10s infinite linear;
          }

          .cube-face {
              position: absolute;
              width: 50px;
              height: 50px;
              background: rgba(76, 175, 80, 0.7); /* Greenish color */
              border: 1px solid #333;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 1.5rem;
              color: white;
              border-radius: 8px;
          }

          .cube-front { transform: rotateY(0deg) translateZ(25px); }
          .cube-back { transform: rotateX(180deg) translateZ(25px); }
          .cube-right { transform: rotateY(90deg) translateZ(25px); }
          .cube-left { transform: rotateY(-90deg) translateZ(25px); }
          .cube-top { transform: rotateX(90deg) translateZ(25px); }
          .cube-bottom { transform: rotateX(-90deg) translateZ(25px); }
          `}
      </style>

      <div className="flex h-screen">

          {/* Left Sidebar */}
          <aside className="w-56 bg-[#1e1e1e] flex flex-col py-6 shadow-lg rounded-r-xl">
              <div className="mb-8 flex justify-center">
                  <i className="fas fa-cube text-green-500 text-3xl"></i>
              </div>
              <nav className="flex flex-col space-y-3 px-4 flex-grow">
                  <a href="#" className="flex items-center space-x-3 p-2 rounded-lg text-green-400 bg-gray-800 hover:bg-gray-700 transition-colors duration-200 btn-3d">
                      <i className="fas fa-home text-lg"></i>
                      <span className="text-sm font-medium">Home Page</span>
                  </a>
                  <a href="#" className="flex items-center space-x-3 p-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-green-400 transition-colors duration-200 btn-3d">
                      <i className="fas fa-share-alt text-lg"></i>
                      <span className="text-sm font-medium">Social Share</span>
                  </a>
                  <a href="#" className="flex items-center space-x-3 p-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-green-400 transition-colors duration-200 btn-3d">
                      <i className="fas fa-cloud-upload-alt text-lg"></i>
                      <span className="text-sm font-medium">Upload Video</span>
                  </a>
                  <hr className="border-gray-700 my-4" />
                  <a href="#" className="flex items-center space-x-3 p-2 rounded-lg text-gray-400 hover:text-green-500 hover:bg-gray-700 transition-colors duration-200 btn-3d">
                      <i className="fas fa-cog text-lg"></i>
                      <span className="text-sm font-medium">Settings</span>
                  </a>
              </nav>
              <div className="mt-auto flex flex-col items-center px-4 space-y-3">
                  <a href="#" className="flex items-center space-x-3 p-2 rounded-lg text-gray-400 hover:text-green-500 hover:bg-gray-700 transition-colors duration-200 btn-3d w-full">
                      <i className="fas fa-question-circle text-lg"></i>
                      <span className="text-sm font-medium">Help</span>
                  </a>
                  {/* Logout button added */}
                  <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors duration-200 btn-3d w-full">
                      <i className="fas fa-sign-out-alt mr-2"></i>Logout
                  </button>
              </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col bg-[#222222] rounded-l-xl overflow-hidden">
              {/* Content Area */}
              <main className="flex-1 p-6 overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-200">Your Uploads</h2>
                      <div className="flex items-center space-x-2">
                          {/* Replaced email and removed profile icon */}
                          <span className="text-gray-400 text-sm">aayushpradhan@gmail.com</span>
                          <i className="fas fa-chevron-down text-gray-400 text-sm cursor-pointer hover:text-green-500 transition-colors duration-200"></i>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* JavaScript Upload Card */}
                      <div className="bg-[#1e1e1e] p-6 rounded-xl shadow-lg card-3d flex flex-col">
                          <div className="relative w-full h-32 bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                              {/* Blank thumbnail area */}
                              <i className="fas fa-file-code text-5xl text-gray-400"></i> {/* Example icon for file type */}
                              <i className="fas fa-ellipsis-h text-gray-500 cursor-pointer hover:text-gray-300 transition-colors duration-200 absolute top-3 right-3"></i>
                          </div>
                          <div className="mb-4">
                              <h3 className="text-lg font-semibold text-gray-100 mb-1">javascript</h3>
                              <p className="text-xs text-gray-400">Master Javascript + 1 video</p>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">Uploaded 3 days ago</p>
                          <div className="flex justify-between items-center text-sm mb-4">
                              <div>
                                  <p className="text-gray-400">Original</p>
                                  <p className="text-gray-200">250.3KB</p>
                              </div>
                              <i className="fas fa-exchange-alt text-gray-500 text-lg"></i>
                              <div>
                                  <p className="text-gray-400">Compressed</p>
                                  <p className="text-gray-200">75.6KB</p>
                              </div>
                          </div>
                          <div className="mb-4">
                              <p className="text-sm text-gray-400 mb-1">compression: <span className="text-green-400 font-semibold">70%</span></p>
                          </div>
                          <button className="bg-gray-700 text-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-600 transition-colors duration-200 btn-3d mt-auto">
                              <i className="fas fa-download mr-2"></i>Download
                          </button>
                      </div>

                      {/* Store Management Drive Card */}
                      <div className="bg-[#1e1e1e] p-6 rounded-xl shadow-lg card-3d flex flex-col">
                          <div className="relative w-full h-32 bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                              {/* Blank thumbnail area */}
                              <i className="fas fa-video text-5xl text-gray-400"></i> {/* Example icon for video type */}
                              <i className="fas fa-ellipsis-h text-gray-500 cursor-pointer hover:text-gray-300 transition-colors duration-200 absolute top-3 right-3"></i>
                          </div>
                          <div className="mb-4">
                              <h3 className="text-lg font-semibold text-gray-100 mb-1">StoreManagement Drive</h3>
                              <p className="text-xs text-gray-400">Build real-world application</p>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">Uploaded 1 week ago</p>
                          <div className="flex justify-between items-center text-sm mb-4">
                              <div>
                                  <p className="text-gray-400">Original</p>
                                  <p className="text-gray-200">1.5MB</p>
                              </div>
                              <i className="fas fa-exchange-alt text-gray-500 text-lg"></i>
                              <div>
                                  <p className="text-gray-400">Compressed</p>
                                  <p className="text-gray-200">500KB</p>
                              </div>
                          </div>
                          <div className="mb-4">
                              <p className="text-sm text-gray-400 mb-1">compression: <span className="text-green-400 font-semibold">67%</span></p>
                          </div>
                          <button className="bg-gray-700 text-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-600 transition-colors duration-200 btn-3d mt-auto">
                              <i className="fas fa-download mr-2"></i>Download
                          </button>
                      </div>

                      {/* Placeholder for the 3D cube element */}
                      <div className="col-span-full flex justify-center items-center py-10">
                          <div className="cube-container">
                              <div className="cube">
                                  <div className="cube-face cube-front"></div>
                                  <div className="cube-face cube-back"></div>
                                  <div className="cube-face cube-right"></div>
                                  <div className="cube-face cube-left"></div>
                                  <div className="cube-face cube-top"></div>
                                  <div className="cube-face cube-bottom"></div>
                              </div>
                          </div>
                      </div>

                  </div>
              </main>
          </div>

      </div>
    </>
  );
};

export default Page;

