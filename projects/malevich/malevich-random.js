/* malevich.js 
 * a random malevich composition generator 
 * using d3 framework/ javascript
 * by crystal qian
 */

// Sets dom
d3.ns.prefix.custom = "http://github.com/mbostock/d3/examples/dom";

// Screen width
var width = 1200,
    height = 800;

// Add sketch to body
var sketch = d3.select("body").append("custom:sketch")
.attr("width", width)
.attr("height", height)
.call(drawCanvas);

// On each click, generate a random shape and print it
d3.select(window).on("mousedown", function() {
    var shape = getRandomShape();

    switch (shape) {
        case "polygon" : {
            sketch.append("polygon")
    .attr("fillStyle", getRandomShapeColor())
    .attr("x", d3.event.clientX)
    .attr("y", d3.event.clientY)
    .attr("hasSetPolygon", "false");
return;
        }

        case "circle" : {
            sketch.append("circle")
    .attr("fillStyle", getRandomShapeColor())
    .attr("x", d3.event.clientX)
    .attr("y", d3.event.clientY)
    //random radius from 20 to 100
    .attr("r", Math.random() * 80 + 20);
return;
        }

        case "line" : {
            sketch.append("line")
                .attr("strokeStyle", getRandomShapeColor())
                .attr("x1", d3.event.clientX)
                .attr("y1", d3.event.clientY)
                //random stroke width from one to 10
                .attr("lineWidth", Math.ceil(Math.random() * 10))
                .attr("x2", Math.random() * width)
                .attr("y2", Math.random() * height);
            return;
        }
    }
});

// returns a polygon with 1/2 probability, circle with 3/10 probability,
// and line with 2/10 probability.
function getRandomShape(){
    var probability = Math.floor(Math.random() * 10);

    if (probability < 5) return "polygon";
    if (probability < 8) return "circle";
    return "line";
}

// returns a random background color for the display
function getRandomBackgroundColor(){
    var chanel = "#fbc9b0";
    var antique = "#faebd7";
    var white = "#fff";
    var beige = "#f5f5dc";
    var snow = "#fffafa";
    var smoke = "#f5f5f5";
    var lavender = "#fff0f5";

    var white_palette = [chanel, antique, white, beige, snow, smoke, lavender];

    return white_palette[Math.floor(Math.random() * white_palette.length)]; 
}

// returns a shape color from the suprematist palette
function getRandomShapeColor(){
    var vermillion = "#e34234";
    var yellow = "#fff600";
    var orange = "#f08f00";
    var red = "#bb2404";
    var teal = "#8ba396";
    var black = "#030400";
    var blue = "#4166f5";
    var emerald = "#50c878";
    var ochre = "#f5c52c";

    var suprematist_palette = [yellow, orange, red, teal, black, blue, emerald, ochre];

    return suprematist_palette[Math.floor(Math.random() * suprematist_palette.length)]; 
}

// generates a noise value (for polygons) between -10 and 10.
function makeNoise(){
    return (Math.random() * 20) - 10;
}

// sets coordinates of the polygon
function setPolygon(child){
    var x = parseInt(child.getAttribute("x"), 10);
    var y = parseInt(child.getAttribute("y"), 10);

    child.setAttribute("hasSetPolygon", "true");

    var xFactor = 20 + (Math.random() * 80);
    var yFactor = 20 + (Math.random() * 80);

    var smallX = x - xFactor;
    var largeX = x + xFactor;

    var smallY = y - yFactor;
    var largeY = y + yFactor;

    child.setAttribute("x0", smallX);
    child.setAttribute("y0", smallY);

    child.setAttribute("x1", largeX);
    child.setAttribute("y1", smallY);

    child.setAttribute("x2", largeX + makeNoise());
    child.setAttribute("y2", largeY + makeNoise());

    child.setAttribute("x3", smallX + makeNoise());
    child.setAttribute("y3", largeY + makeNoise());

}

function drawCanvas(selection) {
    selection.each(function() {
        var root = this,
    canvas = root.parentNode.appendChild(document.createElement("canvas")),
    context = canvas.getContext("2d");

    canvas.style.position = "absolute";
    canvas.style.top = root.offsetTop + "px";
    canvas.style.left = root.offsetLeft + "px";


    // sets color
    var backgroundColor = getRandomBackgroundColor(); 

    // set canvas style
    canvas.width = root.getAttribute("width");
    canvas.height = root.getAttribute("height");

    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, width, height);


    // redraws on mouseclick
    d3.select(window).on("mouseup", redraw);
    // clear the canvas and then iterate over child elements.
    function redraw() {
        for (var child = root.firstChild; child; child = child.nextSibling) draw(child);
    }

    // draws shapes
    function draw(element) {
        switch (element.tagName) {
            case "polygon" : {
                if (element.getAttribute("hasSetPolygon") == "false") 
                    setPolygon(element);

                context.fillStyle = element.getAttribute("fillStyle");

                context.beginPath();
                context.moveTo(element.getAttribute("x0"), element.getAttribute("y0"));
                context.lineTo(element.getAttribute("x1"), element.getAttribute("y1"));
                context.lineTo(element.getAttribute("x2"), element.getAttribute("y2"));
                context.lineTo(element.getAttribute("x3"), element.getAttribute("y3"));
                context.closePath();
                context.fill();

                return;
            }

            case "circle" : {
                context.fillStyle = element.getAttribute("fillStyle"); 

                context.beginPath();
                context.arc(element.getAttribute("x"), element.getAttribute("y"), 
                        element.getAttribute("r"), 0, 2 * Math.PI);
                context.closePath();
                context.fill();

                return;
            }

            case "line" : {
                context.lineWidth = element.getAttribute("lineWidth");
                context.strokeStyle = element.getAttribute("strokeStyle");

                context.beginPath();
                context.moveTo(element.getAttribute("x1"), element.getAttribute("y1"));
                context.lineTo(element.getAttribute("x2"), element.getAttribute("y2"));
                context.stroke();
                context.closePath();
                context.stroke();
            }
        }
    }

    });
};


