
const { AzureKeyCredential, DocumentAnalysisClient } = require("@azure/ai-form-recognizer");
const Model = require("../documents.model");
const ProcessExtracted = require("./processExtractedFields.service");

async function main(documentData,clearOverrideValues) {
    try {
        const { documentUrl, shippingLineId } = documentData;
    
        // const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));
        const FORM_RECOGNIZER_API_KEY = process.env.FORM_RECOGNIZER_API_KEY
        const FORM_RECOGNIZER_ENDPOINT = process.env.FORM_RECOGNIZER_ENDPOINT
    
        const endpoint = FORM_RECOGNIZER_ENDPOINT;
        const credential = new AzureKeyCredential(FORM_RECOGNIZER_API_KEY);
        const client = new DocumentAnalysisClient(endpoint, credential);
    
    
        const poller = await client.beginAnalyzeDocument("prebuilt-invoice", documentUrl);
    
        const result = await poller.pollUntilDone();
        console.log("result",result);
        console.log("result", JSON.stringify(result,null,2));

        if (!result) {
            await Model.findByIdAndUpdate(documentData._id, {
                $set: {
                    isSuccess: false,
                    isJobDone: true,
                    error: "Expected at least one document in the result.",
                },
            });
            throw new Error(
                "Expected at least one document in the result.",
            );
        }

        await Model.findByIdAndUpdate(documentData._id, {
            $set: {
                isSuccess: true,
                isJobDone: true,
                error: "",
                extractedData: result,
            },
        });
        await ProcessExtracted(documentData._id, clearOverrideValues)
    } catch (error) {
        throw new Error("Extraction Error .");
        
    }
}

module.exports = main;