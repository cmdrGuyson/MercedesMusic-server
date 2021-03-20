const multer = require("multer");

//Set filename and destination to be stored
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/tmp/");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `${Math.floor(Math.random() * 10000)}-${Date.now()}.${ext}`);
  },
});

//Filter out filetypes other than image
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("audio")) {
    cb(null, true);
  } else {
    cb(
      {
        message: "Invalid file type",
      },
      false
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 * 1024,
  },
});

exports.multerUpload = upload.single("audio");
