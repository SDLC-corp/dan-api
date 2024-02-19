const { markOtmSuccessFlagAPI } = require("../../../utils/otmApiHelper");
const JobModel = require("../OTMJobProcess.model");
const { TOTAL_TASK_TO_COMPLETE_COUNTS, ORDER_RELEASES_ORDER_TYPE } = require("./const");
const { updateJobStatusStep, updateJobStatusQualifier } = require("./service.updateJobStatus");

async function markTaskCompletion({qualifier, jobId, orderType, domainName, documentNo}) {
    try {
        let job = await JobModel.findById(jobId)
        if(job){
            let completedTasksCount = job.completedTasksCount ? Number(job.completedTasksCount) : 0
            completedTasksCount++

            await JobModel.findByIdAndUpdate(jobId, {$set: {completedTasksCount}})

            console.debug("\n MarkTaskCompletion ::", qualifier, "completedTasksCount:", completedTasksCount, "TOTAL_TASK_TO_COMPLETE_COUNTS:", TOTAL_TASK_TO_COMPLETE_COUNTS);
            if(completedTasksCount >= TOTAL_TASK_TO_COMPLETE_COUNTS) {
                await markSuccessInOTM({orderType, domainName, documentNo, jobId})
            }
        }
    } catch (error) {
        console.error("Error markTaskCompletion ::", qualifier, jobId, orderType, domainName, documentNo, error);
    }
}

async function markSuccessInOTM({orderType, domainName, documentNo, jobId}) {
     splitDomain = domainName.split("/")
     const entityDomain = splitDomain[0] + "/" + splitDomain[1]
    const qualifierGID = `${entityDomain}.SCANNED_DATA_RECEIVED`

    let payload = {
        "items": [
            {
                "obRefnumQualGid": qualifierGID,
                "obRefnumValue": "Y"
            }
        ]
    }

    if(orderType === ORDER_RELEASES_ORDER_TYPE) {
        payload = {
                "items": [
                    {
                        "orderReleaseRefnumQualGid": qualifierGID,
                        "orderReleaseRefnumValue": "Y"
                    }
                ]
            }
    }
    

    let res = await markOtmSuccessFlagAPI({orderType, domainName, documentNo, payload, qualifierGID})
    console.log("\n MarkSuccessInOTM ::", res);

    try {
        let juRes = await JobModel.findByIdAndUpdate(jobId, {$set: {
              endTime: new Date()
        }})
    } catch (error) {
        console.error(" JobModel.findByIdAndUpdate error", error);
    }

    if(res.success) {
        await updateJobStatusQualifier({
            qualifier: "OTM SUCCESS FLAG",
            stepKey: "STEP1",
            value: {
                title: "OTM SUCCESS FLAG",
                status: 1,
                payload: JSON.stringify(payload),
            },
            qualifierStatus: 1,
            jobId
        });
    }
    else {
        await updateJobStatusQualifier({
            qualifier: "OTM SUCCESS FLAG",
            stepKey: "STEP1",
            value: {
                title: "OTM SUCCESS FLAG",
                status: 3,
                payload: JSON.stringify(payload),
                response: res.response
            },
            qualifierStatus: 3,
            jobId
        });
    }
    return res
}

module.exports = {
    markTaskCompletion,
    markSuccessInOTM
}