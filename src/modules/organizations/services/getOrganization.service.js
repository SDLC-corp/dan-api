const mongoose = require('mongoose');
const Model = require("../organizations.model");

const getOrgdById = async ({orgId}) => {
    try {
        let filterQuery = { _id: mongoose.Types.ObjectId(orgId) }
        let result = Model.findOne(filterQuery)
        if(result){
            return result
        }else{
            throw new ApiError(httpStatus.BAD_REQUEST, "Organization Not Found")
        }
    } catch (error) {
        return null
    }
}
module.exports = getOrgdById