"use client"

import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'

import VideoCard from '@/components/VideoCard';
import { Video } from '@/types';
import { toast } from 'react-toastify';

function Home() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [, setError] = useState<string | null>(null);

    const fetchVideos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            //-----FETCHING VIDEOS-----//
            const response = await axios.get("/api/videos");
            if (Array.isArray(response.data)) {
                setVideos(response.data);
            }
            else {
                throw new Error("Unexcepted response format");
            };
        }

        catch (error) {
            console.log(error);
            setError("Failed to fetch videos");
        }

        finally {
            setLoading(false);
        };
    }, [])

    useEffect(() => {
        fetchVideos()
    }, [fetchVideos]);

    //-----DOWNLOAD-----//
    const handleDownload = useCallback((url: string, title: string) => {
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${title}.mp4`);
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, []);

    //------DELETE HANDLER-----//
    const handleDeleteVideo = useCallback(async(videoId: string) => {
        if(!confirm('Are you sure you want to delete this video?')){
            return; //canclled
        }

        try{
            //-----DELETE REQUEST TO API ROUTE-----//
            const response = await axios.delete(`/api/video-upload/${videoId}`)

            if(response.status === 200) {
                toast.success('Video delted successfully');
                setVideos(prevVideos => prevVideos.filter(video => video.id !== videoId));
            }
            else{
                toast.error('Failed to delete video');
            };
        }
        catch(error) {
            console.error('Error deleting video:', error);
            if(axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.error || 'Failed to delete video');
            } 
            else {
                toast.error('An unexpected error occurred while deleting the video.');
            }
        }
    },[]);

    //-----LOADING ANIMATION-----//
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-solid border-green-500 border-t-transparent"></div>
                <span className="ml-4 text-xl font-semibold">Loading...</span>
            </div>
        )
    }

    return (
        <div>
            {videos.length === 0 ?
                (<div className="text-center text-lg text-gray-500">
                    deiro
                </div>) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                        {
                            videos.map((video) => (
                                <VideoCard
                                    key={video.id}
                                    video={video}
                                    onDownload={handleDownload}
                                />
                            ))
                        }
                    </div>
                )
            }
        </div>
    );
};

export default Home;