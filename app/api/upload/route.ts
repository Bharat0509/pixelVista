import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
    const { path } = await request.json();
    if (!path) {
        return NextResponse.json(
            { message: "Image path is required" },
            { status: 400 }
        );
    }
    try {
        const options = {
            folder: "pixelVista",
            use_filename: true,
            unique_filename: true,
            overwrite: true,
            transformation: [{ width: 1000, height: 752, crop: "scale" }],
        };
        const res = await cloudinary.uploader.upload(path, options);
        return NextResponse.json(res, { status: 200 });
    } catch (error) {
        return new NextResponse("Something Went Wrong!", { status: 500 });
    }
}
