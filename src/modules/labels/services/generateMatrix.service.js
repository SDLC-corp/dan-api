const Model = require("../labels.model");
const FieldModel = require("../../fields/fields.model");
const DocumentTypes = require("../../documentTypes/documentType.model");
const mongoose  = require("mongoose");
const generateMatrix = async ({ limit = 100, page = 0, search, orgId }) => {
    let filterQuery = { active: true, orgId: mongoose.Types.ObjectId(orgId) };
    try {
    
      const fields = await FieldModel.find(filterQuery).sort({index:1});
      const documentTypes = await DocumentTypes.find(filterQuery);
  
      const aggregateQuery = [
        { 
            "$match" : {active: true}
        }, 
        { 
            "$lookup" : {
                "from" : "fields", 
                "localField" : "fieldId", 
                "foreignField" : "_id", 
                "as" : "field"
            }
        }, 
        { 
            "$unwind" : {
                "path" : "$field", 
                "preserveNullAndEmptyArrays" : true
            }
        }, 
      ]
      const labels = await Model.aggregate(aggregateQuery);

      return {
          labels,
          fields,
          documentTypes,
      }
      
    } catch (error) {
      console.error('Error:', error);
    }
    return {
      labels: [],
      fields: [],
      documentTypes: []
    }
  
};

module.exports = generateMatrix;
  