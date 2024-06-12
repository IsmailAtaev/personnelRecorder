const axios = require("axios");
const ApiError = require("../error/ApiError");
const PdfService = require("../service/pdfService");


class PdfController {

    async addDocument(req, res, next) {
        try {
            const pathPdf = req.file.filename;
            const { title, userId } = req.body;
            const resultPdf = await PdfService.addFile(title, pathPdf, userId);
            return res.json(resultPdf)
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getByUserDocument(req, res, next) {
        try {
            //const userId = req.params.id;
            const { userId } = req.body;
            console.log("userId ", userId);
            const pdfDocs = await PdfService.getFiles(userId);
            console.log("pdfDocs ", typeof pdfDocs[0])
            console.log("pdfDocs ", pdfDocs.length)

            console.log("arr ", Array.isArray(pdfDocs))
            return res.json(pdfDocs);
            //return res.json({ staus: "haramF" });

        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }


    async deleteDocument(req, res) {
        try {
            const { id, deleted, userId } = req.body
            console.log(id, deleted, userId)

            const removeDoc = await PdfService.deleteDoc(id, deleted, userId)

            return res.json(true)
        } catch (e) {
            return res.json(e)
        }
    }



}

module.exports = new PdfController();