<script>

var width = 960,
    height = 500;

// Add our "custom" sketch element to the body.
var sketch = d3.select("body").append("sketch")
    .attr("width", width)
    .attr("height", height)
    .call(setCanvas);

// On each mouse move, create a circle that increases in size and fades away.
d3.select(window).on("mousedown", function() {
  sketch.append("custom:circle")
      .attr("x", d3.event.clientX)
      .attr("y", d3.event.clientY)
      .attr("radius", 200)
      .attr("strokeStyle", "red")
    .transition()
      .duration(2000)
      .ease(Math.sqrt)
      .attr("radius", 200)
      .attr("strokeStyle", "white")
      .remove();
});

// Sets canvas and draws
function setCanvas(selection) {
  selection.each(function() {
    var root = this,
        canvas = root.parentNode.appendChild(document.createElement("canvas")),
        context = canvas.getContext("2d");

    canvas.style.position = "absolute";
    canvas.style.top = root.offsetTop + "px";
    canvas.style.left = root.offsetLeft + "px";

    // It'd be nice to use DOM Mutation Events here instead.
    // However, they appear to arrive irregularly, causing choppy animation.
    d3.timer(redraw);

    // Clear the canvas and then iterate over child elements.
    function redraw() {
      canvas.width = root.getAttribute("width");
      canvas.height = root.getAttribute("height");
      for (var child = root.firstChild; child; child = child.nextSibling) draw(child);
    }

    // For now we only support circles with strokeStyle.
    // But you should imagine extending this to arbitrary shapes and groups!
    function draw(element) {
      switch (element.tagName) {
        case "circle": {
          context.strokeStyle = element.getAttribute("strokeStyle");
          context.beginPath();
          context.arc(element.getAttribute("x"), element.getAttribute("y"), element.getAttribute("radius"), 0, 2 * Math.PI);
          context.stroke();
          break;
        }
      }
    }
  });
};

</script>
