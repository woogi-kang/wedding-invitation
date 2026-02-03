import { v2 as cloudinary } from 'cloudinary';

// Cloudinary configuration (server-side only)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface GalleryImage {
  publicId: string;
  alt: string;
  width: number;
  height: number;
}

interface CloudinaryResource {
  public_id: string;
  width: number;
  height: number;
  asset_folder?: string;
  display_name?: string;
}

/**
 * Fetch all images from a Cloudinary folder
 * Used in Server Components or API routes
 */
export async function getGalleryImages(folder: string = 'wedding/gallery'): Promise<GalleryImage[]> {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 100,
      resource_type: 'image',
    });

    // Filter by asset_folder and map to GalleryImage
    const images = result.resources
      .filter((resource: CloudinaryResource) => resource.asset_folder === folder)
      .map((resource: CloudinaryResource, index: number) => ({
        publicId: resource.public_id,
        alt: `웨딩 사진 ${index + 1}`,
        width: resource.width,
        height: resource.height,
      }))
      .sort((a: GalleryImage, b: GalleryImage) => {
        // Sort by number in filename (photo1, photo2, ...)
        const numA = parseInt(a.publicId.match(/photo(\d+)/)?.[1] || '0');
        const numB = parseInt(b.publicId.match(/photo(\d+)/)?.[1] || '0');
        return numA - numB;
      });

    return images;
  } catch (error) {
    console.error('Failed to fetch gallery images:', error);
    return [];
  }
}

export default cloudinary;
