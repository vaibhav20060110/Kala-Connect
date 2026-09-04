import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer disk storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || (file.mimetype.includes('audio') ? '.wav' : '.jpg');
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

// File filter accepting images and common audio formats
const fileFilter = (req, file, cb) => {
  const allowed = [
    'image/jpeg', 'image/png', 'image/webp', 'image/jpg',
    'audio/wav', 'audio/webm', 'audio/mp3', 'audio/mpeg', 'audio/m4a', 'audio/aac', 'audio/ogg'
  ];
  if (allowed.includes(file.mimetype) || file.mimetype.startsWith('image/') || file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
  fileFilter
});

export function getPublicUrl(filename) {
  if (!filename) return null;
  return `/uploads/${filename}`;
}

export function saveBufferToFile(buffer, extension = '.jpg') {
  const filename = `enhanced-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, buffer);
  return {
    filename,
    filePath,
    publicUrl: getPublicUrl(filename)
  };
}
