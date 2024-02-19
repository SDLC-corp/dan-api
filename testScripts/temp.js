(function () {

    let document = require('./data.js').document;

    let master_container_type = [{
        code: '40HC',
        text: "40HC"
    }, {
        code: '40HC',
        text: "40' High Cube"
    }, {
        code: '40OT',
        text: "40OT"
    }, {
        code: '20DV',
        text: "20DV"
    }, {
        code: '20DV',
        text: "20' Dry Van"
    }, {
        code: '40HC',
        text: "40' High Cube"
    }]

    function isNumeric(value) {
        return /^-?\d+$/.test(value);
    }
    function isCharacters(value) {
        return /^[A-Z]+$/.test(value);
    }
    function checkForContainerPatternMatch(str) {

        // Remove any non-alphanumeric characters and convert to upper-case.
        str = str.toUpperCase().replace(/[^A-Z0-9]+/g, '');

        // Check if length fits requirements.
        if (!str.length == 11) return false; 
        let firstStr = str.slice(0, 3);
        let secondStr = str.slice(4);

        // Check Number and Characters and 4th Character = U
        if (!isNumeric(secondStr) || !isCharacters(firstStr) || str[3] != "U" ) return false;

        // Calculate check digit.
        var sum = 0;
        for (let s = 0; s < 10; s++) {

            // Map letters to numbers.
            let n = str.charCodeAt(s);
            n -= n < 58 ? 48 : 55;

            // Numbers 11, 22, 33 are omitted.
            n += (n - 1) / 10;

            // Sum of all numbers multiplied by weighting.
            sum += n << s;
        }

        // Modulus of 11, and map 10 to 0.
        let checkSum = sum % 11 % 10;
        if (isNaN(checkSum)) return false;

        if (checkSum != str[str.length - 1]) return false;

        return true;

    }

    let containersObj = {};
    let startOfGrossWeight = 6.1;
    let endOfGrossWeight = 6.92;
    let endOfContainerColumn = 1.8;

    let descStart = 1.8;
    let descEnd = 6.1;

    for (let i = 0; i < document.extractedData.pages.length; i++) {
        let aPage = document.extractedData.pages[i];
        let cond1 = false;
        let cond2 = true;

        let isTareFound = false;

        let currentContainer = "";
        aPage.words = aPage.words.sort((a, b) => a.polygon[0].y - b.polygon[0].y || a.polygon[0].x - b.polygon[0].x)
        for (let j = 0; j < aPage.words.length; j++) {
            let aWord = aPage.words[j];
            try {
                if (aWord.content.toLowerCase() == "PARTICULARS".toLowerCase()) {
                    cond1 = true;
                }
                if (cond1 && aWord.content.toLowerCase() == "FREIGHT".toLowerCase()) {
                    cond2 = false;
                }

                let tempWord = aWord.content.split("/")[0];

                // find Container Pattern
                if (cond1 && cond2 && aWord.polygon[0].x < endOfContainerColumn && checkForContainerPatternMatch(tempWord)) {

                    if (currentContainer != tempWord) {
                        containersObj[tempWord] = { weight: [] };
                        currentContainer = tempWord;
                        containersObj[tempWord].aRowStartY = aWord.polygon[0].y - 0.1;
                        containersObj[tempWord].containerType = aWord.content.split("/")[1];
                        containersObj[tempWord].type = ""
                        containersObj[tempWord].text = [];
                        isTareFound=false;
                    }
                }

                // if word "tare" found, break the text 
                if (containersObj[currentContainer] &&
                    containersObj[currentContainer].aRowStartY &&
                    cond1 &&
                    cond2 &&
                    aWord.polygon[0].y >= containersObj[currentContainer].aRowStartY &&
                    aWord.polygon[0].x <= endOfContainerColumn &&
                    !isTareFound){
                        if(aWord.content.toLocaleLowerCase().indexOf("tare") != -1){
                            isTareFound = true
                        }else{
                            containersObj[currentContainer].text.push(aWord.content)
                        }
                }
                

                // Weight
                if (
                    containersObj[currentContainer] &&
                    containersObj[currentContainer].aRowStartY &&
                    cond1 &&
                    cond2 &&
                    aWord.polygon[0].y >= containersObj[currentContainer].aRowStartY &&
                    aWord.polygon[0].x >= startOfGrossWeight && aWord.polygon[1].x <= endOfGrossWeight) {
                    // todo handle condition where there is only one container and that table also has total weight in it, 
                    containersObj[currentContainer].weight.push(aWord.content)
                }


                // // Seal
                // if (containersObj[currentContainer] &&
                //     containersObj[currentContainer].aRowStartY &&
                //     cond1 &&
                //     cond2 &&
                //     aWord.content.indexOf("SEAL/") == 0) {
                //     containersObj[currentContainer].seal = aWord.content.split("SEAL/")[1];
                // }

            } catch (error) {
                console.log("word: ", aWord.content, error)
            }
        }
    }



    let containerArr = []
    for (const aContainerNo in containersObj) {
        if (Object.hasOwnProperty.call(containersObj, aContainerNo)) {
            const aContainerInfo = containersObj[aContainerNo];
            let text = aContainerInfo.text.join(" ");
            
            for (let x = 0; x < master_container_type.length; x++) {
                const aContainerType = master_container_type[x];
                if (text.toLocaleLowerCase().indexOf(aContainerType.text.toLocaleLowerCase()) != -1){
                    aContainerInfo.type = aContainerType.code;
                    break;
                }
            }

            let sealPossibleText = aContainerInfo.text[aContainerInfo.text.length -1];

            if (sealPossibleText.indexOf(":") != -1){
                sealPossibleText = sealPossibleText.split(":")[1];
            } else if (sealPossibleText.indexOf("/") != -1){
                sealPossibleText = sealPossibleText.split("/")[1];
            }else{
                // empty
            }


            containerArr.push({
                number: aContainerNo,
                seal: sealPossibleText,
                weight: aContainerInfo.weight.join(""),
                type: aContainerInfo.type,
                text: aContainerInfo.text.join(" "),
                mou : "KGS"
            })
        }
    }

    console.log("containerArr : ", containerArr)


    return containerArr;
})()