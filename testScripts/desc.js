(function () {
    let document = require('./data.js').document;
    let descStart = 1.8;
    let descEnd = 6.1;
    let description = [];
    for (let i = 0; i < document.extractedData.pages.length; i++) {
        let aPage = document.extractedData.pages[i];
        let startTableY = 0, endTableY = 0;
        for (let l = 0; l < aPage.lines.length; l++) {
            const aLine = aPage.lines[l];

            if (aLine.content.toLocaleLowerCase().includes("(continued on attached") || aLine.content.toLocaleLowerCase().includes("(continued on further") ){
                startTableY = aLine.polygon[3].y;
            }

            if (aLine.content.toLocaleLowerCase().includes("cargo shall not be delivered") ) {
                endTableY = aLine.polygon[1].y;

            }
        }
        aPage.words = aPage.words.sort((a, b) => a.polygon[0].y - b.polygon[0].y || a.polygon[0].x - b.polygon[0].x)
        for (let j = 0; j < aPage.words.length; j++) {
            let aWord = aPage.words[j];
            try {
                if (
                    aWord.polygon[0].y > startTableY && aWord.polygon[0].y < endTableY && 
                    aWord.polygon[0].x > descStart && aWord.polygon[0].x < descEnd) {
                    description.push(aWord.content)
                }
            } catch (error) {
            }
        }
    }
    return description.join(" ");
})()