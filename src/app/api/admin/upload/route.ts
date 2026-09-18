import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { put } from "@vercel/blob";
import { adminAuth } from "@/lib/admin-auth";

// Generous but bounded — team photos and portfolio images should be well
// under this; video uploads (portfolio/testimonial clips) are the reason
// it's this high rather than a tight image-only limit.
const MAX_FILE_BYTES = 100 * 1024 * 1024; // 100MB

const ALLOWED_TYPES = [
  "image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml",
  "video/mp4", "video/webm", "video/quicktime",
];

export async function POST(request: NextRequest) {
  const authResult = await adminAuth(request);
  if (!authResult) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { message: "File storage isn't configured yet (BLOB_READ_WRITE_TOKEN missing). See DEPLOYMENT.md." },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { message: `Unsupported file type: ${file.type}` },
        { status: 400 }
      );
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { message: `File too large — max ${MAX_FILE_BYTES / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Prefix by folder (passed from the form, e.g. "team", "portfolio",
    // "blog") so the Blob store stays organized rather than one flat list.
    const folder = (formData.get("folder") as string) || "uploads";
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const pathname = `${folder}/${Date.now()}-${safeName}`;

    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return NextResponse.json({ url: blob.url, message: "Uploaded" }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}
