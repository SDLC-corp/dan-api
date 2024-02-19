const Model = require("../documents.model")
const mongo = require("mongoose")

async function singleDocumentDeleteField({itemId,isShipUnit,documentId}) {

    console.log('documentId, itemId ,isShipUnit',documentId, itemId ,isShipUnit);

    const document = await Model.findById(documentId,'fieldsAndValues')

    if(isShipUnit){

        let fieldIndex = document.fieldsAndValues.findIndex((aField) => {
            return aField.fieldName == 'ship_unit_table';
        })

        let fieldValueArr = document.fieldsAndValues[fieldIndex].fieldValue;

        let valueIndex = fieldValueArr.findIndex((aValue) => {
            return aValue.itemId == itemId;
        })
        console.log('valueIndex',valueIndex);
            document.fieldsAndValues[fieldIndex].fieldValue = document.fieldsAndValues[fieldIndex].fieldValue.filter(item=>item.itemId != itemId) 

        console.log('document.fieldsAndValues[fieldIndex].fieldValue',document.fieldsAndValues[fieldIndex].fieldValue);
        let updated = await Model.updateOne( {_id:mongo.Types.ObjectId(documentId)} , {
            $set: {
                fieldsAndValues: document.fieldsAndValues
            }
        })

        // return document.fieldsAndValues;
        return true;

    }else{
    return false;
    }

    
}

module.exports = singleDocumentDeleteField