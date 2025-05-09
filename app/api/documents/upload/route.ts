import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const multer = require('multer');
    const upload = multer({
      storage: multer.diskStorage({
        destination: './public/uploads/documents',
        filename: (req: any, file: any, cb: any) => {
          const uniqueName = `${uuidv4()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    });

    await new Promise((resolve, reject) => {
      upload.single('file')(req as any, res as any, (err: any) => {
        if (err) {
          console.error('Upload error:', err);
          return reject(err);
        }
        resolve(true);
      });
    });

    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = `/uploads/documents/${file.filename}`;
    
    return res.status(200).json({
      success: true,
      filePath,
      fileName: file.originalname,
      fileSize: file.size,
      fileType: file.mimetype,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}