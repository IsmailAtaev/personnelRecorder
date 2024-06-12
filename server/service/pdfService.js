const { model } = require("../database");
const { PdfDocument } = require("../models/model");
const ApiError = require("../error/ApiError");
const pdfController = require("../controllers/pdfController");


class PdfService {

    async addFile(title, pathPdf, userId) {
        try {
            const pdfDoc = await PdfDocument.create({ title, pathPdf, userId });
            return pdfDoc;
        } catch (e) {
            ApiError.badRequest(e);
        }
    }


    async getFiles(userId) {
        // const arrayDoc = await PdfDocument.findAll({ where: { userId }, raw: true, })
        const arrayDoc = await PdfDocument.findAll({ where: { userId, deleted: false }, raw: true, })

        console.log("arrayDoc ", arrayDoc)
        return arrayDoc;
    }

    async deleteDoc(id, deleted, userId) {
        const updateStatusDeleted = await PdfDocument.update(
            { deleted }, {
            where: {
                id, userId
            }
        })
        return updateStatusDeleted



    }





}
//arrayDoc.map(el => console.log(JSON.stringify(el)))
//  where: { userId }, console.log("arrayDoc" + arrayDoc.get({ plain: true }));


module.exports = new PdfService();