const JobModel = require("../OTMJobProcess.model");

async function updateJobStatusStep({qualifier, key, value, job_id}) {
    console.debug("***updateJobStatusStep***", qualifier, key, value, job_id)
    let updateLocation = `status.${qualifier}.${key}`;
    let updated = await JobModel.findByIdAndUpdate(job_id, { 
        $set: {
            [updateLocation]: value
        }
    })
}
/**
 * updates the data in job status {
 *  qualifier:{
 *      stepKey: {
 *          title: "", 
 *          error: "", 
 *          status: 1, 
 *          text: ""
 *      } OR value
 *    }
 * }
 * @param {Object} Obj {qualifier, qualifierStatus, stepKey, value = {title: "", error: "", status: 1, text: ""}
 */
async function updateJobStatusQualifier({qualifier, qualifierStatus, stepKey, value, jobId}) {
    let stepLocationKey = `status.${qualifier}.${stepKey}`;

   try {
        await JobModel.findByIdAndUpdate(jobId, {
            $set: {
                [stepLocationKey]: value
            }
        })

        if(qualifierStatus || qualifierStatus == 0){
            stepLocationKey = `status.${qualifier}.status`;

            await JobModel.findByIdAndUpdate(jobId, {
                $set: {
                    [stepLocationKey]: qualifierStatus
                }
            })
        }
   } catch (error) {
    console.error("updateJobStatusQualifier qualifier, qualifierStatus, stepKey, value ::", qualifier, qualifierStatus, stepKey, value, jobId, error);
   }

}

async function updateManyJobStatus(updateData, job_id) {
    console.debug("***Update Many Job Status***", updateData, job_id)
   try {
    let updated = await JobModel.findByIdAndUpdate(job_id, {
        $set: updateData
    })
   } catch (error) {
    
   }
}

/* 
  status {
    QUALFIER/BATCH_INFO {
      STEP1: {
        title: "",
        error: "",
        status: "",
        txt: ""
      }
      status
    }
  }
*/

module.exports = {
    updateJobStatusStep,
    updateManyJobStatus,
    updateJobStatusQualifier
}