import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "avatars";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

export async function uploadBlogImage(file: File, postId: string) {
  // Validate file before upload
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(
      "Invalid file type. Please upload a JPEG, PNG, WEBP or GIF image."
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      "File size too large. Please upload an image smaller than 5MB."
    );
  }

  try {
    const supabase = createClientComponentClient();

    // Upload the file to Supabase storage
    const fileExt = file.name.split(".").pop();
    // Prefix with 'blog/' to keep blog images separate from avatars in the same bucket
    const fileName = `blog/${postId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload file
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("Error uploading blog image:", error);
    throw error;
  }
}
