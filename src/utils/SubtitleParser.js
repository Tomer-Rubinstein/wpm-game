
function parseHtmlEnteties(str) {
    str = str.replace(/([0-9]{1,3});/gi, function(match, numStr) {
        var num = parseInt(numStr, 10);
        return String.fromCharCode(num);
    });
    str = str.replace("lt;", "<");
    str = str.replace("gt;", ">");
    return str;
}

export default function parseSubtitle(text) {
    var regex;
    text = text.toLowerCase();
    text = parseHtmlEnteties(text);

    // remove (...) [...] <...> that may appear sometimes
    regex = /(\[|\(|<)([^()]+)(\]|\)|>)/gi;
    text = text.replaceAll(regex, "");

    // display only english chars, numbers and punctuation
    regex = /[^a-z0-9 \n']/gi;
    text = text.replaceAll(regex, "");

    text = text.trim();
    return text;
}
