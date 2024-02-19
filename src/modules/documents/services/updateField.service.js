const Model = require("../documents.model")
const mongo = require("mongoose")

async function singleDocumentUpdateField({ documentId, fieldName, overrideValue ,isShipUnit}) {

    console.log('documentId, fieldName, overrideValue ,isShipUnit',documentId, fieldName, overrideValue ,isShipUnit);

    const document = await Model.findById(documentId,'fieldsAndValues')

    if(isShipUnit){

        let fieldIndex = document.fieldsAndValues.findIndex((aField) => {
            return aField.fieldName == 'ship_unit_table';
        })

        let fieldValueArr = document.fieldsAndValues[fieldIndex].fieldValue;

        let valueIndex = fieldValueArr.findIndex((aValue) => {
            return aValue.itemId == fieldName.itemId;
        })
        let keyToBeUpdated
        if (valueIndex != -1) {
            keyToBeUpdated = `fieldsAndValues.${fieldIndex}.fieldValue.${valueIndex}.${fieldName.attr}`;
            document.fieldsAndValues[fieldIndex].fieldValue[valueIndex][fieldName.attr] = overrideValue;
            console.log("keyToBeUpdated : ", keyToBeUpdated, " - ", overrideValue)            
        } else{
            //add new row with new obj
            valueIndex = fieldValueArr?.length
            keyToBeUpdated = `fieldsAndValues.${fieldIndex}.fieldValue.${valueIndex}.${fieldName.attr}`;
            document.fieldsAndValues[fieldIndex].fieldValue[valueIndex] = {[fieldName.attr]:overrideValue,itemId : fieldName.itemId};
        }


        let updated = await Model.updateOne( {_id:mongo.Types.ObjectId(documentId)} , {
            $set: {
                fieldsAndValues: document.fieldsAndValues
            }
        })

        return true;



    }else{
        let fieldIndex = document.fieldsAndValues.findIndex((aField) => {
            return aField.fieldName == fieldName;
        })
    
        let keyToBeUpdated = `fieldsAndValues.${fieldIndex}`;
    
        let newValueObj = { ...document.fieldsAndValues[fieldIndex], overrideValue } ;


        let updated = await Model.updateOne( {_id:mongo.Types.ObjectId(documentId)}, {
            $set: {
                [keyToBeUpdated]: newValueObj
            }
        })
        return true;
    }

    
}

module.exports = singleDocumentUpdateField