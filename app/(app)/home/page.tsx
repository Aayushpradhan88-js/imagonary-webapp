"use client"

import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import VideoCard from '@/components/VideoCard';
import { Video } from '@/types';
// import { setLazyProp } from 'next/dist/server/api-utils';

function Home() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [, setError] = useState<string | null>(null);

    const fetchVideos = useCallback(async () => {
        try {
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

    const handleDownload = useCallback((url: string, title: string) => {
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${title}.mp4`);
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [])

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
                </div>) :
                (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
