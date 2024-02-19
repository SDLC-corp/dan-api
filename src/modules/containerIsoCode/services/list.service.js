const ContainerIsoCodeModel = require('../isoCodes.model')

const list = async (limit=10 , search) => {

	let filterQuery = {  };
console.log('search',search);

   	limit = Number(limit)
        let list
		if (search && search != "") {
			const searchRegex = new RegExp(`.*${search}.*`, "i")
			filterQuery["text"] = { $regex: searchRegex }
	        list = await ContainerIsoCodeModel.find(filterQuery).limit(limit)
		}
        // if (list.length<=0) {
        //     if (search && search != "") {
        //             const searchRegex = new RegExp(`.*${search}.*`, "i")
        //             filterQuery["code"] = { $regex: searchRegex }
        //         }
	    //     list = await ContainerIsoCodeModel.find(filterQuery).limit(limit)
        // }
    return {data: list};

};


module.exports = list