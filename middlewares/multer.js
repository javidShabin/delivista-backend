import multer from "multer";

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.fieldname);
  },
});

const upload = multer({ storage });

export { upload };
