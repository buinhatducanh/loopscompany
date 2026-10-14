import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function main() {
  const localVideo = path.resolve('public/videos/Woman_holding_smartphone_showing_ad.mp4');
  console.log('Checking local file:', localVideo);
  if (!fs.existsSync(localVideo)) {
    throw new Error('File does not exist: ' + localVideo);
  }
  const stat = fs.statSync(localVideo);
  console.log(`File size: ${(stat.size / (1024 * 1024)).toFixed(2)} MB`);

  console.log('Starting Cloudinary video upload...');
  const result = await cloudinary.uploader.upload(localVideo, {
    resource_type: 'video',
    folder: 'loop_ads',
    public_id: 'google_pro_holding_smartphone',
    overwrite: true,
    eager: [
      { format: 'mp4', quality: 'auto', video_codec: 'auto' },
    ],
    eager_async: false,
  });

  console.log('--- UPLOAD SUCCESS ---');
  console.log('Secure URL:', result.secure_url);
  console.log('Public ID:', result.public_id);
  console.log('Format:', result.format);
  console.log('Duration:', result.duration);

  // Video URL with CDN optimization: f_auto,q_auto
  const optimizedUrl = cloudinary.url(result.public_id, {
    resource_type: 'video',
    fetch_format: 'auto',
    quality: 'auto',
    secure: true,
  });
  console.log('Optimized CDN URL:', optimizedUrl);

  // Also upload the original gemini pro ad video
  const oldVideo = path.resolve('public/videos/Woman_advertising_Google_Gemini_Pro.mp4');
  if (fs.existsSync(oldVideo)) {
    console.log('Uploading old video backup to Cloudinary...');
    const res2 = await cloudinary.uploader.upload(oldVideo, {
      resource_type: 'video',
      folder: 'loop_ads',
      public_id: 'google_pro_woman_gemini_ad',
      overwrite: true,
    });
    console.log('Old video URL:', res2.secure_url);
  }
}

main().catch(err => {
  console.error('Upload Error:', err);
  process.exit(1);
});
