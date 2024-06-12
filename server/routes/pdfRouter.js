const Router = require("express");
const PdfController = require("../controllers/pdfController");
const router = new Router();
const multer = require("multer");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './files')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
    }
})

const upload = multer({ storage: storage })


router.post("/upload-files", upload.single("file"), PdfController.addDocument);
//router.get("/get-files/:id", PdfController.getByUserDocument);

router.post("/get-files", PdfController.getByUserDocument);
router.post("/delete", PdfController.deleteDocument)

// router.get("/", async (req, res) => {
//     res.send("sucsess")
// })

// router.post("/upload-files", upload.single("file"), async (req, res) => {
//     console.log(req.file);
//     console.log(req.body)
//     res.json("Hiii")


// });








module.exports = router;
