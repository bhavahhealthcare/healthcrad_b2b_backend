import dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET;
export const FAST2SMS = process.env.API_URL;
export const DLT_TEMPLATE_ID = process.env.DLT_KEY;