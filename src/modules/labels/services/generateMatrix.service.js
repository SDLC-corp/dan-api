const Model = require("../labels.model");
const FieldModel = require("../../fields/fields.model");
const ShippingLines = require("../../shippingLine/shippingLine.model");
const generateMatrix = async ({ limit = 100, page = 0, search }) => {
    let filterQuery = { active: true };
    try {
    
      const fields = await FieldModel.find(filterQuery).sort({index:1});
      const shippingLines = await ShippingLines.find(filterQuery);
  
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
          shippingLines,
      }
      
    } catch (error) {
      console.error('Error:', error);
    }
    return {
      labels: [],
      fields: [],
      shippingLines: []
    }
  
};

module.exports = generateMatrix;
  