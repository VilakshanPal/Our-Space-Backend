import multer from "multer";

const upload = multer({
  dest: "uploads/",
});

export const media = upload.single("media");