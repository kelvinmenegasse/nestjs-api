import { diskStorage } from 'multer';
import path = require('path');

export const files = {
    channelThumbnail: 'files/channel-thumbnails'
};

export const channelThumbnailStorage = {
    storage: diskStorage({
        destination: `./${files.channelThumbnail}`,
        filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') +'-'+ Date.now()
            const extension: string = path.parse(file.originalname).ext;

            cb(null, `${filename}${extension}`)
        }
    })
};