import cloudinary from 'cloudinary';
import { env } from './env.js';
import { CLOUDINARY } from '../constants/index.js';
import fs from 'node:fs/promises';
import createHttpError from 'http-errors';

const configureCloudinary = () => {
  cloudinary.v2.config({
    secure: true,
    cloud_name: env(CLOUDINARY.CLOUD_NAME),
    api_key: env(CLOUDINARY.API_KEY),
    api_secret: env(CLOUDINARY.API_SECRET),
  });
};

const checkCloudinaryConfig = () => {
  configureCloudinary();

  const config = cloudinary.v2.config();
  if (!config.cloud_name || !config.api_key || !config.api_secret) {
    throw createHttpError(503, 'Cloudinary configuration is missing');
  }
};

export const saveFileToCloudinary = async (file, folder = 'taskpro') => {
  checkCloudinaryConfig();
  try {
    const response = await cloudinary.v2.uploader.upload(file.path, {
      folder,
      resource_type: 'image',
    });
    await fs.unlink(file.path);
    return response.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw createHttpError(500, 'Failed to upload file to Cloudinary');
  }
};

export const deleteFileFromCloudinary = async (publicId) => {
  checkCloudinaryConfig();
  try {
    const response = await cloudinary.v2.uploader.destroy(publicId);
    return response.result === 'ok';
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw createHttpError(500, 'Failed to delete file from Cloudinary');
  }
};
