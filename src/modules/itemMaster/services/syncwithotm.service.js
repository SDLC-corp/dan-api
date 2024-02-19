const { getAllContainerItemsData } = require("../../../utils/otmApiHelper");
const MODEL = require('../itemMaster.model')

async function process() {
    console.log("------------ItemMaster Sync_With_OTM----------------");
    await MODEL.deleteMany({})

    let list = await getAllContainerItemsData({limit: 1000})
    
    const containerItems = list.map(item=>{
        return {
            code: `TW.${item.itemXid}`,
            text: item.itemName
        }
    })

    list.push({
        "code" : "TW.SPL GOODS", 
        "text" : "SPL GOODS"
    })
    console.log("------------ItemMaster Sync_With_OTM containerItems ----------------", list.length);
    await MODEL.insertMany(containerItems)
}
module.exports = process