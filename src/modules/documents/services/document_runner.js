const { getPrediction } = require("./index")
const Model = require("../documents.model")

var currentJobDone = true
const FIELDS_EXTRACTION_FREQUENCY_TIME=1000*60*1 // 1 MINUTE

async function jobRunner() {
    currentJobDone = false

    if(currentJobDone) return
    
    try {
        const filterQuery = {active: true, isJobDone: false}
        let documentCount = await Model.countDocuments(filterQuery)
        
        console.log("** document RUNNER IS ACTIVE : found = ", documentCount);

        if(documentCount){
            let document = await Model.findOne(filterQuery)
            if(document){
                try {
                    await getPrediction(document)
                } catch (error) {
                    
                }
            } else {
                console.log("**** Jon not found in db ****");
            }
        }
    } catch (error) {
        
    }

    currentJobDone = true
}

function startJobRunner() {
    console.log("--JOB RUNNER STARTED--");

    jobRunner()
    setInterval(() => {
        jobRunner()
    }, FIELDS_EXTRACTION_FREQUENCY_TIME);
}

module.exports = startJobRunner