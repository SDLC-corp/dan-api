const mongoose = require('mongoose');
const DocumentModel = require("../../documents/documents.model");
const ProcessExtractedFields = require("./../../documents/services/getPrediction.service");
const OnlyExtract = require("./../../documents/services/processExtractedFields.service");

const extractAll = async (id, option) => {
    try {
        const shippingLineId = mongoose.Types.ObjectId(id);

        let allDocsForShippingLine = [];

        if(option == "1" || option == "3"){
            allDocsForShippingLine = await DocumentModel.find({
                shippingLineId: shippingLineId,
                active: true
            }, "_id")
        }else{
            allDocsForShippingLine = await DocumentModel.find({
                shippingLineId: shippingLineId,
                active: true
            })
        }
        console.log("Extraction Started for " + allDocsForShippingLine.length + " docs : Option : "+option);
        for (let i = 0; i < allDocsForShippingLine.length; i++) {
            const aDoc = allDocsForShippingLine[i];
            console.log("Extracting " + (i + 1) + " out of " + allDocsForShippingLine.length + " document - ", aDoc._id)

            if (option == "1"){
                await OnlyExtract(aDoc._id);
            } else if (option == "2") {
                await ProcessExtractedFields(aDoc);
            } else if (option == "3") {
                console.log("Clearing overrides values for ", aDoc._id)
                await OnlyExtract(aDoc._id, true);
            } else if (option == "4") {
                console.log("Clearing overrides values for ", aDoc._id)
                await ProcessExtractedFields(aDoc, true);
            }else {

            }
            
        }
        console.log("Extraction Done");
        return true;

    } catch (error) {
        console.log("Error : ", error);
        return false;
    }
}

module.exports = extractAll;
