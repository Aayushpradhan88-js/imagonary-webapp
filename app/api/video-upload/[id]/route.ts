import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import Prisma from '@/app/lib/prisma';


const prisma = new PrismaClient();

//----------CLOUDINARY CONFIGURATION----------//
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

interface CloudinaryUploadResult {
    public_id: string;
    bytes: number;
    duration?: number;
    [key: string]: string | number | boolean | object | undefined;
};

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "UNAUTHORIZED USER" });
        };

        const videoId = params.id;
        if (!videoId) {
            return NextResponse.json(
                { error: 'Video ID is required' },
                { status: 400 }
            )
        };

        const videoToDelete = await Prisma.video.findUnique(
            {
                where: { id: videoId },
            }
        );
        if (!videoToDelete) {
            return NextResponse.json({ message: "video ID is not found" })
        };

        const cloudinaryResult = await cloudinary.uploader.destroy(videoToDelete.publicId, {
            resource_type: 'video'
        });
        if (cloudinaryResult.result !== 'ok' && cloudinaryResult.result !== 'not found') {
            console.error('Cloudinary deletion failed:',)
        };

        await Prisma.video.delete({
            where: { id: videoId }
        });

        return NextResponse.json(
            { message: "Video deleted successfully" },
            { status: 200 }
        )

    }
    catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Failed to delete video' },
            { status: 500 });

    }
    finally {
        await prisma.$disconnect();
    };
};