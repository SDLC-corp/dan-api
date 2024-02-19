const mongoose = require("mongoose");
const counterIncrementor = require("../../utils/counterIncrement");

const modelSchema = mongoose.Schema(
  {
    documentId: {
      type: mongoose.Types.ObjectId,
    },
    createdBy:{
      type: mongoose.Types.ObjectId,
    },
    seqId: {
      type: Number,
    },
    completedTasksCount: {
      type: Number,
      default: 0,
    },
    status : {
      
    },
    startTime:{
      type:Date
    },
    endTime:{
      type:Date
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);
// OTMJobProcess
modelSchema.pre("save", async function (next) {
  const otm_job_process = this;
  otm_job_process.seqId = await counterIncrementor("otm_job_process");
  next();
});

/**
 * @typedef otm_job_process
 */
const Model = mongoose.model("otm_job_process", modelSchema);

module.exports = Model;

/* 
  status {
    QUALFIER/BATCH_INFO {
      STEP1: {
        title: "",
        response: "",
        status: "",
        txt: ""
      }
      status
    }
  }

*/