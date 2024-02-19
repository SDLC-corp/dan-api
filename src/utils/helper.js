
function convertToJSON(str) {
    var str1 = str.replace(/[{}]/g, '');
    var properties = str1.split(',');
    var obj = {};
    properties.forEach(function(property) {
        var tup = property.split(':');
        obj[tup[0]] = tup[1];
    });
    return obj;
  }

module.exports={
    convertToJSON
}