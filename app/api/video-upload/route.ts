import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

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

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (
            !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET
        ) {
            return NextResponse.json({ error: 'Cloudinary configuration is missing' }, { status: 500 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const originalSize = formData.get('originalSize') as string;
        // const parsedOriginalSize = originalSizeStr ? Number(originalSizeStr) : 0;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        };

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise<CloudinaryUploadResult>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'video',
                        timeout: 120000,
                        folder: "video-uploads",
                        transformation: {
                            quality: 'auto',
                            fetch_format: 'mp4',
                        }
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result as CloudinaryUploadResult);
                    }
                )
                uploadStream.end(buffer);
            }
        )
        const video = await prisma.video.create({
            data: {
                title: title,
                description: description,
                publicId: result.public_id,
                originalSize: originalSize,
                compressSize: String(result.bytes),
                duration: result.duration || 0
            }
        });

        return NextResponse.json(video);
    }

    catch (error) {
        console.error('Error uploading video:', error);
        return NextResponse.json({ error: 'Upload Video failed' }, { status: 500 });
    }

    finally {
        await prisma.$disconnect();
    }
}