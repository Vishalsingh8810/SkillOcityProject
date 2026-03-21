import multer from 'multer';
import path from 'path';
import fs from 'fs';
import config from '../config/env.js';

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), config.uploadDir);
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const subDir = file.fieldname === 'avatar' ? 'avatars' : 'attachments';
        const dir = path.join(uploadDir, subDir);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'avatar') {
        // Only images for avatars
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed for avatars'), false);
        }
    } else {
        // Allow common file types for attachments
        const allowed = ['image/', 'application/pdf', 'text/', 'application/msword',
            'application/vnd.openxmlformats-officedocument'];
        if (allowed.some(type => file.mimetype.startsWith(type))) {
            cb(null, true);
        } else {
            cb(new Error('File type not supported'), false);
        }
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
