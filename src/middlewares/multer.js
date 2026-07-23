import multer from "multer";

const upload = multer({
  dest: "uploads/",
});

export const media = upload.single("media");


// export const media = (req, res, next) => {
//   console.log("before upload.single");

//   upload.single("media")(req, res, (err) => {
//     console.log("inside callback");

//     if (err) {
//       console.log(err);
//       return res.status(400).json(err);
//     }

//     console.log(req.file);

//     next();
//   });

//   console.log("after upload.single");
// };