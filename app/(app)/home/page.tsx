"use client"

import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';

import VideoCard from '@/components/VideoCard';
import ConfirmModal from '@/components/ConfirmModel'; // Import the new modal component
import { Video } from '@/types';

function Home() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [, setError] = useState<string | null>(null);

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [videoToDeleteId, setVideoToDeleteId] = useState<string | null>(null);

    const fetchVideos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get("/api/videos");
            if (Array.isArray(response.data)) {
                setVideos(response.data);
            }
            else {
                throw new Error("Unexpected response format");
            };
        }
        catch (error) {
            console.error(error);
            setError("Failed to fetch videos");
            toast.error("Failed to load videos.");
        }
        finally {
            setLoading(false);
        };
    }, []);

    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    const handleDownload = useCallback((url: string, title: string) => {
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${title}.mp4`);
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.info(`Downloading "${title}"...`);

        toast.success('Video downloaded successfully')
    }, []);

    const handleOpenConfirmModal = useCallback((videoId: string) => {
        setVideoToDeleteId(videoId);
        setIsConfirmModalOpen(true);
    }, []);

    const handleCloseConfirmModal = useCallback(() => {
        setIsConfirmModalOpen(false);
        setVideoToDeleteId(null);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!videoToDeleteId) return;

        handleCloseConfirmModal(); 

        try {
            const response = await axios.delete(`/api/video-upload/${videoToDeleteId}`);

            if (response.status === 200) {
                toast.success('Video deleted successfully!');
                setVideos(prevVideos => prevVideos.filter(video => video.id !== videoToDeleteId));
            } else {
                toast.error('Failed to delete video.');
            }
        } catch (error) {
            console.error('Error deleting video:', error);
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.error || 'Failed to delete video.');
            } else {
                toast.error('An unexpected error occurred while deleting the video.');
            }
        }
    }, [videoToDeleteId, handleCloseConfirmModal]);
    
    //-----LOADING ANIMATION-----//
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-solid border-green-500 border-t-transparent"></div>
                <span className="ml-4 text-xl font-semibold">Loading...</span>
            </div>
            
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            {/* <h1 className="text-3xl font-extrabold text-blue-900 drop-shadow mb-6">Your Uploads</h1> */}
            {videos.length === 0 ?
                (<div className="text-center text-lg text-gray-500 mt-10">
                    No videos uploaded yet.
                </div>) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {
                            videos.map((video) => (
                                <VideoCard
                                    key={video.id}
                                    video={video}
                                    onDownload={handleDownload}
                                    onDelete={handleOpenConfirmModal}
                                />
                            ))
                        }
                    </div>
                )
            }
            {/* Render the ConfirmModal component */}
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={handleCloseConfirmModal}
                onConfirm={handleConfirmDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this video? This action cannot be undone."
            />
        </div>
    );
};

export default Home;