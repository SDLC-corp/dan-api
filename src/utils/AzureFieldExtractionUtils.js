const { TOTAL_TASK_TO_COMPLETE_COUNTS } = require("../modules/OTMJobProcess/services_push_Otm/const")
const { markSuccessInOTM } = require("../modules/OTMJobProcess/services_push_Otm/service.otmCompletionStatus")
const JobModel = require('../modules/OTMJobProcess/OTMJobProcess.model')
/**
 * 
 * @param {object} document Document from db
 * @param {string} fieldKey qualifier key from extracted fields 
 */
function getFieldDataFromExtractedObj(extractedData, fieldKey) {
    let fields = extractedData.documents[0].fields
    return fields[fieldKey].value
}

function isSameAsConsigneePresentInText(str) {
    if(str){
        str = str?.toLowerCase()
        if(str.trim() == "same as consignee") return true
        if(str.indexOf("same as consignee") != -1) return true
    }
    return false
}
function hasToOrderInString(str) {
    if(str){
        str = str?.toLowerCase()
        if(str.trim() == "to order") return true
        if(str.indexOf("to order") != -1) return true
    }

    return false
}

function isBookingCancelled(statusValueGid="") {
    statusValueGid = statusValueGid.split(".")[1]
    return statusValueGid == "BOOKING_CANCELLED_CANCELLED" || statusValueGid == "OR_BOOKING_CANCELLED_CANCELLED"
}

function getWeightFromString(input="") {
    const REGEX = /[^0-9.]/g
    let str = input.replace(REGEX, "")
    if(`${Number(str)}` == "NaN") return null
    else return Number(str)
}

class ExtractedFields {
    _keyMap = {}
    constructor (extractedFieldArr=[]) {
        extractedFieldArr.map(obj=>this._keyMap[obj.fieldName]=obj)
    }
    getField(fieldName) {
        return this._keyMap[fieldName]
    }
    getFieldVal(fieldName) {
        return this._keyMap[fieldName]?.overrideValue || this._keyMap[fieldName]?.fieldValue
    }
    getLocationFieldVal(fieldName, withGID) {
        let locationId = this._keyMap[fieldName]?.overrideValue || this._keyMap[fieldName]?.fieldValue
        if(locationId) {
            locationId = locationId.split('-')[0].trim()
            if(withGID) return `TW.${locationId}`
        }
        return locationId || ""
    }
}
class ShipUnitsMap {
    _keyMap = {}
    constructor (shipUnitArr=[], idKey) {
        shipUnitArr.map(item=>this._keyMap[item[idKey]] = item)
    }
    getShipUnitData (id) {
        return this._keyMap[id]
    }
}
class TaskCompletionUtils {
    doneTasksCount = 0
    _orderType
    _domainName
    _documentNo
    _jobId
    constructor({orderType, domainName, documentNo, jobId}) {
        this._orderType = orderType
        this._domainName = domainName
        this._documentNo = documentNo
        this._jobId = jobId
    }
    async taskDone(qualifier) {
        this.doneTasksCount++

        console.log("\n MarkTaskCompletion ::", qualifier, "completedTasksCount:", this.doneTasksCount, "TOTAL_TASK_TO_COMPLETE_COUNTS:", TOTAL_TASK_TO_COMPLETE_COUNTS);
        if(this.doneTasksCount == TOTAL_TASK_TO_COMPLETE_COUNTS) {
            await markSuccessInOTM({orderType: this._orderType, domainName: this._domainName, documentNo: this._documentNo, jobId: this._jobId})
        }
    }
    getTaskCompletionCount() {
        return this.doneTasksCount
    }
}
module.exports = {
    getFieldDataFromExtractedObj,
    getWeightFromString,
    isSameAsConsigneePresentInText,
    hasToOrderInString,
    isBookingCancelled,
    ExtractedFields,
    ShipUnitsMap,
    TaskCompletionUtils
}