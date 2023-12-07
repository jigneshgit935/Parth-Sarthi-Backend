import express from 'express';

const router = express.Router();
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();
import multer from 'multer';
import sharp from 'sharp';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// router.post('/uploadimage', upload.single('myimage'), async (req, res) => {
//   const file = req.file;
//   if (!file) {
//     return res.status(400).json({ ok: false, error: 'No image file provided' });
//   }

//   sharp(file.buffer)
//     .resize({ width: 800 })
//     .toBuffer(async (err, data, info) => {
//       if (err) {
//         console.error('Image processing error:', err);
//         return res
//           .status(500)
//           .json({ ok: false, error: 'Error processing image' });
//       }

//       cloudinary.uploader
//         .upload_stream({ resource_type: 'auto' }, async (error, result) => {
//           if (error) {
//             console.error('Cloudinary Upload Error:', error);
//             return res.status(500).json({
//               ok: false,
//               error: 'Error uploading image to Cloudinary',
//             });
//           }

//           res.json({
//             ok: true,
//             imageUrl: result.url,
//             message: 'Image uploaded successfully',
//           });
//         })
//         .end(data);
//     });
// });

router.post('/uploadimages', upload.array('myimages', 10), async (req, res) => {
  const files = req.files;
  if (!files || files.length === 0) {
    return res
      .status(400)
      .json({ ok: false, error: 'No image files provided' });
  }

  try {
    const uploadPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        sharp(file.buffer)
          .resize({ width: 800 })
          .toBuffer(async (err, data, info) => {
            if (err) {
              console.error('Image processing error:', err);
              reject('Error processing image');
            }

            cloudinary.uploader
              .upload_stream(
                { resource_type: 'auto' },
                async (error, result) => {
                  if (error) {
                    console.error('Cloudinary Upload Error:', error);
                    reject('Error uploading image to Cloudinary');
                  }
                  resolve(result.url);
                }
              )
              .end(data);
          });
      });
    });

    const uploadedImagesUrls = await Promise.all(uploadPromises);

    res.json({
      ok: true,
      imageUrl: uploadedImagesUrls,
      message: 'Images uploaded successfully',
    });
  } catch (error) {
    res.status(500).json({ ok: false, error });
  }
});

export default router;
