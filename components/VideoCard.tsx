import React, { useState, useEffect, useCallback } from 'react';
import { filesize } from 'filesize';
import { getCldImageUrl, getCldVideoUrl } from 'next-cloudinary';
import { Download, Clock, FileDown, FileUp, Trash2 } from 'lucide-react';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';

import { Video } from '@/types';

dayjs.extend(relativeTime); //-----gives relative time 2day, 3hours not exact date-----//

interface VideoCardProps {
    video: Video;
    onDownload: (url: string, title: string) => void;
    onDelete: (videoId: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onDownload, onDelete }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [previewError, setPreviewError] = useState(false);

    //-----Thumbnail URL-----//
    const getThumbnailUrl = useCallback((publicId: string) => {
        return getCldImageUrl(
            {
                src: publicId,
                width: 400,
                height: 225,
                crop: "fill",
                gravity: "auto",
                format: "jpg",
                quality: "auto",
                assetType: "video"
            }
        )
    }, []);

    //----VIDEO URL-----//
    const getFullVideoUrl = useCallback((publicId: string) => {
        return getCldVideoUrl(
            {
                src: publicId,
                width: 400,
                height: 225,
            }
        )
    }, []);

    //-----VIEEO PREVIEW URL-----//
    const getPreviewVideoUrl = useCallback((publicId: string) => {
        return getCldVideoUrl(
            {
                src: publicId,
                width: 400,
                height: 225,
                rawTransformations: ["e_preview:duration_15:max_seg_9:min_seg_dur_1"]
            }
        )
    }, []);

    const handlePreviewError = () => {
        setPreviewError(true);
    };

    //-----FORMAT SIZE-----//
    const formatSize = useCallback((size: number | string | null | undefined) => {
        const numSize = Number(size);
        if (typeof numSize === 'number' && !isNaN(numSize) && numSize > 0) {
            return filesize(numSize);
        };
        return 'N/A'
    }, []);

    const originalSize = Number(video.originalSize);
    const compressedSize = Number(video.compressedSize);

    let compressionPercentage: number | string = 'N/A';

    if (!isNaN(originalSize) && !isNaN(compressedSize) && originalSize > 0) {
        compressionPercentage = Math.round(
            (1 - compressedSize / originalSize) * 100
        );
    };

    //-----FORMATING DURATION-----//
    const formatDuration = useCallback((seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.round(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }, []);


    useEffect(() => {
        setPreviewError(false);
    }, [isHovered]);

    return (
        <>
            {/*---------- Main Content Area----------*/}
            <div
                className="card  bg-grey-800 w-3xs shadow-lg hover:shadow-xl transition-all duration-300 text-gray-100 rounded-lg overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <figure className="aspect-video relative ">
                    {isHovered ? (
                        previewError ? (
                            // -----preview error-----//
                            <div className="w-full h-full flex items-center justify-center bg-gray-700">
                                <p className="text-gray-500">
                                    Preview not available
                                </p>
                            </div>
                        ) :
                            (
                                <video
                                    src={getPreviewVideoUrl(video.publicId)}
                                    autoPlay
                                    muted
                                    loop
                                    className="w-full h-full object-cover"
                                    onError={handlePreviewError}
                                />
                            )
                    ) :
                        (
                            <img
                                src={getThumbnailUrl(video.publicId)}
                                alt={video.title}
                                className="w-full h-full object-cover"
                            />
                        )};

                    {/* //-----DURATION-----// */}
                    <div className="absolute bottom-2 right-2 bg-base-900 bg-opacity-70 px-2 py-1 rounded-lg text-sm flex items-center">
                        <Clock size={16} className="mr-1" />
                        {formatDuration(video.duration)}
                    </div>
                </figure>

                <div className="card-body p-4">
                    <h2 className="card-title text-lg font-bold">
                        {video.title}</h2>

                    {/* //-----description-----// */}
                    <p className="text-sm text-base-400 mb-4">
                        {video.description}
                    </p>

                    {/* //-----UPLOADED TIME-----// */}
                    <p className="text-sm text-gray-400 mb-4">
                        Uploaded {dayjs(video.createdAt).fromNow()}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        {/* //------ORIGINAL FILE SIZE-----// */}
                        <div className="flex items-center">
                            <FileUp size={18} className="mr-2 text-blue-400" />
                            <div>
                                <div className="font-semibold">
                                    Original
                                </div>
                                <div>
                                    {formatSize(video.originalSize)}
                                </div>
                            </div>
                        </div>

                        {/* //------COMPRESSED FILE SIZE-----// */}
                        <div className="flex items-center">
                            <FileDown size={18} className="mr-2 text-green-400" />
                            <div>
                                <div className="font-semibold">
                                    Compressed
                                </div>
                                <div>
                                    {formatSize(video.compressedSize)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* //------COMPRESSION FILE SIZE PERCENTAGE-----// */}
                    <div className="flex justify-between items-center mt-4">
                        <div className="text-sm font-semibold">
                            Compression:{" "}
                            <span className="text-purple-400">{
                                typeof compressionPercentage === 'number'
                                    ? `${compressionPercentage}`
                                    : 'N/A'
                            }%</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        {/* ... (compression percentage) */}
                        <div className="flex items-center gap-2">
                            {/* //------DOWNLOAD BUTTON-----// */}
                            <button
                                className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-none p-2 rounded-md"
                                onClick={() =>
                                    onDownload(getFullVideoUrl(video.publicId), video.title)
                                }
                                title="Download Video"
                            >
                                <Download size={16} /> {/* Added the "Download" text here */}
                            </button>

                            {/* //-----DELETE BUTTON-----// */}
                            <button
                                className="btn btn-sm cursor-pointer bg-red-600 hover:bg-red-700 text-white border-none p-2 rounded-md" // Delete button style
                                onClick={() =>
                                    onDelete(video.id)
                                }
                                title="Delete Video"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default VideoCard;