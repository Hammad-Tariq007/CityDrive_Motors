import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import * as path from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const ext = path.extname(file.originalname);
      callback(null, `${uuid()}${ext}`);
    },
  }),
};
