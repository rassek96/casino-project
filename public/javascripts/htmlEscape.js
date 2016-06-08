function htmlEscape(string) {
    var newString = string.
        replace(/&/g, "&amp;").
        replace(/</g, "&lt;").
        replace(/"/g, "&quot;").
        replace(/'/g, "&#39;");
    return newString;
}

module.exports.htmlEscape = htmlEscape;
