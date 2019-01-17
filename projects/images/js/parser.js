// this file allows us to use commands in the url for batch proessing
// this is some crazy magic. don't read too closely.

var Parser = Parser || {};

// this is an "iffe" function (see wikipedia for javascript IFFE)
Parser.commands = ( function() {
    var url = document.URL;
    var pos = url.lastIndexOf('?');
    url = url.substr(pos + 1);

    var params = {};
    url.split('&').forEach(function(item) {
        var parts = item.split('=');
        if (parts.length == 1) {
            params[parts[0]] = true;
        }else {
            params[parts[0]] = parts[1];
        }
    });
    return params;
}());


Parser.parseNumbers = function( str ) {
    var numbers = [];
    str.split(',').forEach(function(interval) {
        var parts = interval.split('-');
        if (parts.length == 1) {
            numbers.push(parseInt(parts[0]));
        }else {
            var start = parseInt(parts[0]);
            var end   = parseInt(parts[1]);
            $.merge(numbers, Parser.range(start, end + 1));
        }
    });
    return numbers;
}

Parser.parseJson = function( jsonFile ) {
    var request = new XMLHttpRequest();
    request.open("GET", jsonFile, false);
    request.overrideMimeType("application/json");
    request.send(null);
    var obj = JSON.parse( request.responseText );
    return obj;
}

