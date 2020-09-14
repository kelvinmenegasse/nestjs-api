import { diskStorage } from 'multer';
import path = require('path');

export const files = {
    channelThumbnailDirectory: 'files/channel-thumbnails',
    attachsDirectory: 'files/attachs',
};

export const channelThumbnailStorage = {
    storage: diskStorage({
        destination: `./${files.channelThumbnailDirectory}`,
        filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') +'-'+ Date.now()
            const extension: string = path.parse(file.originalname).ext;

            cb(null, `${filename}${extension}`)
        }
    })
};

export const fileStorage = {
    storage: diskStorage({
        destination: `./${files.attachsDirectory}`,
        filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') +'-'+ Date.now()
            const extension: string = path.parse(file.originalname).ext;

            cb(null, `${filename}${extension}`)
        }
    })
};