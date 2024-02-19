(function () {
    function checkForContainerPatternMatch(str) {
        // Remove any non-alphanumeric characters and convert to upper-case.
        str = str.toUpperCase().replace(/[^A-Z0-9]+/g, '');
        // Check if length fits requirements.
        if (str.length < 10 || str.length > 11)
            return false;
        // Calculate check digit.
        var sum = 0;
        for (let i = 0; i < 10; i++) {
            // Map letters to numbers.
            let n = str.charCodeAt(i);
            n -= n < 58 ? 48 : 55;
            // Numbers 11, 22, 33 are omitted.
            n += (n - 1) / 10;
            // Sum of all numbers multiplied by weighting.
            sum += n << i;
        }
        // Modulus of 11, and map 10 to 0.
        return !isNaN(sum % 11 % 10);
    }


    let suT1 = document.extractedData.documents[0].fields.ship_unit_table.values;
    let suT2 = document.extractedData.documents[0].fields.ship_unit_table_2?.values;
    let suT3 = document.extractedData.documents[0].fields.ship_unit_table_3?.values;
    let suT4 = document.extractedData.documents[0].fields.ship_unit_table_4?.values;
    let suT5 = document.extractedData.documents[0].fields.ship_unit_table2?.values;
    let suT6 = document.extractedData.documents[0].fields.ship_unit_table3?.values;
    let suT7 = document.extractedData.documents[0].fields.ship_unit_table4?.values;

    let allRows = [];

    if (Array.isArray(suT1)) allRows = allRows.concat(suT1);
    if (Array.isArray(suT2)) allRows = allRows.concat(suT2);
    if (Array.isArray(suT3)) allRows = allRows.concat(suT3);
    if (Array.isArray(suT4)) allRows = allRows.concat(suT4);
    if (Array.isArray(suT5)) allRows = allRows.concat(suT5);
    if (Array.isArray(suT6)) allRows = allRows.concat(suT6);
    if (Array.isArray(suT7)) allRows = allRows.concat(suT7);


    let finalArr = [];


    try {
        for (let i = 0; i < allRows.length; i++) {
            let aRow = allRows[i];
            if (aRow.properties && shippingLineDetails) {

                let container = aRow.properties.containers?.value || aRow.properties.container?.value || aRow.properties["container no."]?.value || "";
                let container_type = aRow.properties.container_type?.value;
                let seal_no = aRow.properties.seal_no?.value;
                let weight = aRow.properties.weight?.value;
                let w_uom = aRow.properties.w_uom?.value;

                let liner = "", shipper = "", custom = "";

                if (shippingLineDetails.locationId == "TW.MSC"){

                    if (container.indexOf("/")!=-1){
                        container_type = container.split("/")[1];
                        container = container.split("/")[0]?.replaceAll(/\s/g, '');
                    }

                    if (!checkForContainerPatternMatch(container)) {
                        container = ""
                    }

                    

                } else if (shippingLineDetails.locationId == "TW.HAPAG_LLOYD"){
                    container = container?.replaceAll(/\s/g, '');

                } else if (shippingLineDetails.locationId == "TW.AVANA_GLOBAL_FZCO") {

                    if (container.indexOf("/") != -1) {
                        seal_no = container.split("/")[1];
                        container = container.split("/")[0]?.replaceAll(/\s/g, '');
                    }

                    if (!checkForContainerPatternMatch(container)) {
                        container = ""
                    }

                } else if (shippingLineDetails.locationId == "TW.CMA_CGM") {

                } else if (shippingLineDetails.locationId == "TW.COSCO") {

                    if (!weight){
                        let totalWeight = document.extractedData.documents[0].fields.total_calculation?.values ? document.extractedData.documents[0].fields.total_calculation?.values[0]?.properties?.gross_weight?.content : 0;
                        totalWeight = totalWeight ? totalWeight?.replaceAll("KGS", "") : 0;

                        if (i == 0) {
                            weight = totalWeight
                        } else {
                            weight = 0
                        }
                    }

                } else if (shippingLineDetails.locationId == "TW.MAEU") {

                } else if (shippingLineDetails.locationId == "TW.OOCL") {

                } else if (shippingLineDetails.locationId == "TW.EVERGREEN_LINE") {

                } else  {
                    //log("Shipping line not found")
                }


                //log("seal_no : " + seal_no)
                if (seal_no) {
                    liner = seal_no;
                    liner = liner.replace(/[^a-zA-Z0-9]/g, '').toLocaleLowerCase();
                    liner = liner.replace("seal", "");
                    liner = liner.replace("number", "");

                    if (liner.indexOf("/") != -1) {
                        liner = liner.split("/")[1]
                    }

                    if (liner.indexOf("shipper") != -1) {
                        liner = liner.replace("shipper", "");
                        shipper = liner;
                        liner = "";

                    }

                    // if (liner.indexOf("custom") != -1) {
                    //     liner = liner.replace("custom", "");
                    //     custom = liner;
                    //     liner = "";

                    // }
                }

                // log("liner : " + liner)
                // log("custom : " + custom)
                // log("shipper : " + shipper)

                if (container_type?.toLowerCase() == '400t') {
                    container_type = '40OT';
                }

                for (let r = 0; r < master_container_type.length; r++) {
                    const aContainerType = master_container_type[r];
                    if (container_type) {
                        // log(container_type?.toLowerCase()+" - "+aContainerType.text?.toLowerCase())
                        if (container_type?.toLowerCase()?.replaceAll(/\s/g, '').indexOf(aContainerType.text?.toLowerCase()?.replaceAll(/\s/g, '')) != -1) {
                            // log("Found : " + aContainerType.code)
                            container_type = aContainerType.code;
                            break;
                        }
                    }
                }

                if (weight){
                    weight = String(weight).replace(/[^\d.]/g, '');
                }

                finalArr.push({
                    itemId: Math.random().toString(36).slice(2),
                    container: container,
                    type: container_type,
                    weight: weight ? weight : 0,
                    uom: "KG",
                    liner: liner.toUpperCase(),
                    shipper: shipper.toUpperCase()
                })


                // let containerNumber = "";
                // let containerText = "";

                // if (container) {

                //     if (container?.value.length == 12 && container?.value[4] == " ") {
                //         containerText = container?.value;
                //         containerNumber = containerText.split(" ").join("");
                //     } else {
                //         containerText = container?.value;
                //         containerNumber = containerText.split(" ")[0];
                //     }

                // }


                // if (containerNumber.indexOf("/") != -1) {
                //     aRow.properties.seal_no = { value: containerNumber.split("/")[1] }
                //     containerNumber = containerNumber.split("/")[0]
                // }

                // containerNumber = containerNumber.split(" ").join("")

                // let containerType = "";

                
            }
        }
    } catch (error) {
        log("Ship unit error")
        log(error)
    }
    return finalArr
})()