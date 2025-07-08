import React, { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import { filesize } from 'filesize';
import { getCldImageUrl, getCldVideoUrl } from 'next-cloudinary'; // Reverted to original imports
import { Download, Clock, FileDown, FileUp } from 'lucide-react';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// Dummy interface for Video type to make the code runnable in this environment.
// Replace with your actual Video interface from '@/types'.
interface Video {
    publicId: string;
    title: string;
    description: string;
    duration: number;
    createdAt: string;
    originalSize: number;
    compressedSize: number;
}

interface VideoCardProps {
    video: Video;
    onDownload: (url: string, title: string) => void;
}

// Your VideoCard component, with UI fixes applied from previous turns,
// but now using the original getCldImageUrl and getCldVideoUrl imports.
const VideoCard: React.FC<VideoCardProps> = ({ video, onDownload }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [previewError, setPreviewError] = useState(false);

    const getThumbnailUrl = useCallback((publicId: string) => {
        return getCldImageUrl({
            src: publicId,
            width: 400,
            height: 225,
            crop: "fill",
            gravity: "auto",
            format: "jpg",
            quality: "auto",
            assetType: "video"
        });
    }, []);

    const getFullVideoUrl = useCallback((publicId: string) => {
        return getCldVideoUrl({
            src: publicId,
            width: 400,
            height: 225,
        });
    }, []);

    const getPreviewVideoUrl = useCallback((publicId: string) => {
        return getCldVideoUrl({
            src: publicId,
            width: 400,
            height: 225,
            rawTransformations: ["e_preview:duration_15:max_seg_9:min_seg_dur_1"]
        });
    }, []);

    const formatSize = useCallback((size: number) => {
        if (typeof size === 'number' && !isNaN(size)) {
            return filesize(size);
        }
        console.log('Size value:', size);
        console.log('Type of size:', typeof size);
        return 'N/A';
    }, []);

    const formatDuration = useCallback((seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.round(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }, []);

    const compressionPercentage = Math.round(
        (1 - Number(video.compressedSize) / Number(video.originalSize)) * 100
    );

    useEffect(() => {
        setPreviewError(false);
    }, [isHovered]);

    const handlePreviewError = () => {
        setPreviewError(true);
    };

    return (
        <div
            className="bg-[#1e1e1e] p-6 rounded-xl shadow-lg card-3d flex flex-col"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Media area with conditional video/image and duration overlay */}
            <div className="relative w-full h-32 bg-gray-700 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {isHovered && !previewError ? (
                    <video
                        src={getPreviewVideoUrl(video.publicId)}
                        autoPlay
                        muted
                        loop
                        className="w-full h-full object-cover rounded-lg"
                        onError={handlePreviewError}
                    />
                ) : (
                    <img
                        src={getThumbnailUrl(video.publicId)}
                        alt={video.title}
                        className="w-full h-full object-cover rounded-lg"
                        onError={handlePreviewError}
                    />
                )}
                {/* Duration overlay - always visible and positioned over the media */}
                <div className="absolute bottom-2 right-2 flex items-center text-gray-300 text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                    <Clock size={12} className="mr-1" />
                    {formatDuration(video.duration)}
                </div>
            </div>

            {/* Title and Description */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-100 mb-1">
                    {video.title}
                </h3>
                <p className="text-xs text-gray-400">
                    {video.description}
                </p>
            </div>

            {/* Uploaded Date */}
            <p className="text-xs text-gray-500 mb-2 flex items-center">
                <Clock size={16} className="mr-1" />
                Uploaded {dayjs(video.createdAt).fromNow()}
            </p>

            {/* Original vs Compressed Sizes */}
            <div className="flex justify-between items-center text-sm mb-4">
                <div className="flex items-center">
                    <FileUp size={18} className='mr-2 text-green-400' />
                    <div>
                        <p className="text-gray-400">Original</p>
                        <p className="text-gray-200">
                            {formatSize(Number(video.originalSize))}
                        </p>
                    </div>
                </div>
                <i className="fas fa-exchange-alt text-gray-500 text-lg"></i>
                <div className="flex items-center">
                    <FileDown size={18} className="mr-2 text-blue-400" />
                    <div>
                        <p className="text-gray-400">Compressed</p>
                        <p className="text-gray-200">
                            {formatSize(Number(video.compressedSize))}
                        </p>
                    </div>
                </div>
            </div>

            {/* Compression Percentage */}
            <div className="mb-4">
                <p className="text-sm text-gray-400 mb-1">Compression: <span className="text-green-400 font-semibold">{compressionPercentage}%</span></p>
            </div>

            {/* Download Button */}
            <button
                className="bg-gray-700 text-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-600 transition-colors duration-200 btn-3d mt-auto flex items-center justify-center"
                onClick={() => onDownload(getFullVideoUrl(video.publicId), video.title)}
            >
                <Download size={16} className="mr-2" />
                Download
            </button>
        </div>
    );
};


// Main HomePage component to integrate the sidebar and the video cards
function HomePage() {
    // Dummy data to simulate multiple video uploads as seen in the second screenshot
    const videos = [
        {
            publicId: 'javascript_video_id',
            title: 'javascript',
            description: 'Master Javascript + 1 video',
            duration: 38,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            originalSize: 259328, // 253.3 KB
            compressedSize: 77414, // 75.6 KB
        },
        {
            publicId: 'store_management_video_id',
            title: 'StoreManagement Drive',
            description: 'Build real-world application',
            duration: 120,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            originalSize: 1536000, // 1.5 MB
            compressedSize: 512000, // 500 KB
        },
        // Add more dummy videos here if you want more cards to show up for testing
    ];

    // Dummy onDownload function for the HomePage
    const handleDownload = (url: string, title: string) => {
        console.log(`Downloading ${title} from ${url}`);
        // Implement actual download logic here, e.g.,
        // const link = document.createElement('a');
        // link.href = url;
        // link.download = title;
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-[#222222] flex text-gray-200">
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
                        {/* Render VideoCard components based on the videos array */}
                        {videos.map((video) => (
                            <VideoCard key={video.publicId} video={video} onDownload={handleDownload} />
                        ))}

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
    );
}

export default HomePage;
