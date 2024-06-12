const Router = require("express");
const router = new Router();
const userController = require("../controllers/userController");
const multer = require('multer')
const path = require("path")


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {

        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

router.post("/upload-image", upload.single("file"), userController.uploadImagProfil)


// async (req, res) => {
//     console.log(req.file.filename)
//     console.log(req.body)
//     const imageName = req.file.filename;

// }

router.post("/registration", userController.registration)
router.post("/login", userController.login)
router.get("/users", userController.getUsers)



module.exports = router;



