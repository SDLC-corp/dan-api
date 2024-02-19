const {
    AzureKeyCredential,
    DocumentAnalysisClient,
} = require("@azure/ai-form-recognizer");
const Model = require("../documents.model");
const DocumentTypeModel = require("../../documentTypes/documentType.model");
const ProcessExtracted = require("./processExtractedFields.service");

async function formRecognizerExtractFields(documentData, clearOverrideValues) {
    console.log("Extract Fields START ::");

    try {
        const { documentUrl, documentTypeId } = documentData;

        const found = await DocumentTypeModel.findOne(documentTypeId);

        if (found && found.modelId) {

            const modelId = found.modelId;

            const FORM_RECOGNIZER_API_KEY = process.env.FORM_RECOGNIZER_API_KEY
            const FORM_RECOGNIZER_ENDPOINT = process.env.FORM_RECOGNIZER_ENDPOINT

            const endpoint = FORM_RECOGNIZER_ENDPOINT;
            const credential = new AzureKeyCredential(FORM_RECOGNIZER_API_KEY);
            const client = new DocumentAnalysisClient(endpoint, credential);

            const poller = await client.beginAnalyzeDocument(
                modelId,
                documentUrl, //"YOUR-DOCUMENT"
            );

            const result = await poller.pollUntilDone();

            console.log("DocumentData Extracted :", documentData._id.toString());
            console.log("DocumentData Extracted modelId :", modelId);
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

            await ProcessExtracted(documentData._id, clearOverrideValues);

        } else {
          throw new Error("Document Type not found or modelId not present : documentTypeId ::" + documentTypeId);
        }
    } catch (error) {
        console.error("Extraction Error ::", error);
    }
}

module.exports = formRecognizerExtractFields;