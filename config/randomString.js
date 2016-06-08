function randomString(stringLength) {
    var string = "";
    while(string.length < stringLength && stringLength > 0) {
        var random = Math.random();
        string += (random < 0.1?
        Math.floor(random*100):String.fromCharCode(Math.floor(random*26) + (random > 0.5?
            97:65)));
    }
    return string;
}

module.exports.randomString = randomString;
