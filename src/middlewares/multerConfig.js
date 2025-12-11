// import multer from "multer";

// const storage = multer.memoryStorage(); // files will be stored in memory as Buffer in req.file.buffer or req.files[i].buffer

// const upload = multer({ storage });

// export default upload;

import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "assets");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

export default upload;
