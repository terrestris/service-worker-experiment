var startZ = 0;
var startX = 0;
var startY = 0;
var endZ = 5;

var baseUrl = "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png";

var showInfo = true; // whether some meta oinformation will be printed
var wrapForJSArray = true; // whether output is plain or copy-pasteable

var urls = [];

/**
 * Takes an object with z, x and yproperties and a base URL and then
 * replaces the respective placeholders (`{z}`, …) in that URL. The result
 * is stored in the global array of URLs.
 */
function addUrl(tile, baseUrl) {
    var url = baseUrl
        .replace(/\{z\}/g, "" + tile.z)
        .replace(/\{x\}/g, "" + tile.x)
        .replace(/\{y\}/g, "" + tile.y)
    urls.push(url);
}

/**
 * Given an object with z, x and yproperties, an end zoomlevel and a base URL,
 * This method constructs all subtiles of the original tile. It will call itself
 * recursively to achive thsi; the storing is done by addUrl.
 */
function subUrls(tile, endZ, baseUrl) {
    addUrl(tile, baseUrl);
    if (tile.z < endZ) {
        var nextZ = tile.z + 1;
        var twoX = tile.x * 2;
        var twoY = tile.y * 2;
        var subTileOL = {z: nextZ, x: twoX, y: twoY};
        var subTileOR = {z: nextZ, x: twoX + 1, y: twoY};
        var subTileUL = {z: nextZ, x: twoX, y: twoY + 1};
        var subTileUR = {z: nextZ, x: twoX + 1, y: twoY + 1};
        subUrls(subTileOL, endZ, baseUrl);
        subUrls(subTileOR, endZ, baseUrl);
        subUrls(subTileUL, endZ, baseUrl);
        subUrls(subTileUR, endZ, baseUrl);
    }
}

if (showInfo) {
    console.log("URLs for zoomlevels " + startZ + " to " + endZ +
        " (first tile " + startZ + "/" + startX + "/" + startY + ")");
    console.log("------------------------------------------");
}

subUrls({z: startZ, x: startX, y: startY}, endZ, baseUrl);

urls.sort();

if (wrapForJSArray) {
    console.log('"' + urls.join('",\n"') + '"\n');
} else {
    console.log(urls.join('\n'));
}

if (showInfo) {
    console.log("");
    console.log("------------------------------------------");
    console.log("Total number of URLs: " + urls.length);
}
