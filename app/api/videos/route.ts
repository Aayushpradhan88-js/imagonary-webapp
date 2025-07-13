import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const videos = await prisma.video.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })

        const formattedVideos = videos.map(video => ({
            ...video,

            originalSize: Number(video.originalSize || '0'), // Ensure it's a number, even if null/undefined
            compressedSize: Number(video.compressSize || '0'), // Ensure it's a number
            duration: Number(video.duration || '0'), // Ensure duration is a number too
            createdAt: video.createdAt instanceof Date ? video.createdAt.toISOString() : video.createdAt,
            updatedAt: video.updatedAt instanceof Date ? video.updatedAt.toISOString() : video.updatedAt,
        }));

        
        return NextResponse.json(formattedVideos)
    }

    catch (error) {
        console.error("Failed to fetch videos: ", error)
        return NextResponse.json({ error: "Failed to fetch error" }, { status: 500 });
    }

    finally {
        await prisma.$disconnect();
    };


};