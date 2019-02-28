var curNode;
//var fisheye = d3.fisheye.circular()
//.radius(120);

var w = 1280,
    h = 800,
    r = 720,
    x = d3.scale.linear().range([0, r]),
    y = d3.scale.linear().range([0, r]),
    node,
    root;

    var pack = d3.layout.pack()
.size([r, r])
    .value(function(d) { return d.size; })

    var vis = d3.select("body").insert("svg:svg", "h2")
    .attr("width", w)
    .attr("height", h)
    .append("svg:g")
    .attr("transform", "translate(" + (w - r) / 2 + "," + (h - r) / 2 + ")");


    //vis.on("mousemove", function() {
    //fisheye.focus(d3.mouse(this));

    //vis.selectAll("circle").each(function(d) { d.fisheye = fisheye(d); })
    //.attr("cx", function(d) { return d.fisheye.x; })
    //.attr("cy", function(d) { return d.fisheye.y; })
    //.attr("r", function(d) { return d.r + d.fisheye.z * 4.5; });

    //vis.selectAll("text").each(function(d) { d.fisheye = fisheye(d); })
    //.attr("x", function(d) { return d.fisheye.x; })
    //.attr("y", function(d) { return d.fisheye.y; })
    //.attr("r", function(d) { return d.r + d.fisheye.z * 4.5; });


    //});

    d3.json("flare.json", function(data) {
        node = root = data;

        console.log("flare");
        var nodes = pack.nodes(root);

        vis.selectAll("circle")
        .data(nodes)
        .enter().append("svg:circle")
        .attr("class", function(d) { 
            //has child
            if(d.depth == 1){
                return "year";    
            } else if (d.depth == 2){
                return "exhibit";
            } else if (d.depth == 3){
                return "piece";
            } else return "other";
        })

    .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", function(d) { return d.r; })
        .on("click", function(d) { 
            if (node == d) {
                return zoom(root);
            }

            return zoom(d);
        })
    vis.selectAll("text")
        .data(nodes)
        .enter().append("svg:text")
        .attr("lengthAdjust", "spacing")
        .attr("class", function(d) { 
            //has child
            if(d.depth == 1){
                return "year";    
            } else if (d.depth == 2){
                return "exhibit";
            } else if (d.depth == 3){
                return "piece";
            } else return "other";
        })
    .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .style("opacity", function(d) { 
            if (d.depth == 0) return 1;
            return 0;
        })
    .text(function(d) { return d.name; });

    d3.select(window).on("click", function() { zoom(root); });
    });

function zoom(d, i) {   
    var curDepth = d.depth;
    console.log(d.name, d.depth);
    var hasChildren = d.children;

    var k = r / d.r / 2;
    x.domain([d.x - d.r, d.x + d.r]);
    y.domain([d.y - d.r, d.y + d.r]);

    var t = vis.transition()
        .duration(d3.event.altKey ? 7500 : 750);

    var nPhrases = 0;
    var dPhrases = 20;

    var insertLineBreaks = function (d) {
        var el = d3.select(this);
        var words = d.name.split(' ');
        
        var charMax = d.r / 2;
        var phrases = [];
        var wIdx = 0;

        while (wIdx < words.length) {
            var curLen = 0;
            var curPhrase = "";
            while (curLen < charMax && wIdx < words.length) {
                curPhrase +=  words[wIdx++] + ' ';
                curLen = curPhrase.length;
            }            

            phrases.push(curPhrase);
        }

        el.text('');

        for (var i = 0; i < phrases.length; i ++) {


            var tspan = el.append('tspan').text(phrases[i]);
            if (i > 0)
                tspan.attr('x', x(d.x)).attr('dy', dPhrases);
        }

        nPhrases = phrases.length;
    };

    t.selectAll("circle")
        .attr("cx", function(d) { return x(d.x); })
        .attr("cy", function(d) { return y(d.y); })
        .attr("r", function(d) { return k * d.r; });

    t.selectAll("text")
        .each(insertLineBreaks)
        .attr("x", function(d) { return x(d.x); })
        .attr("y", function(d) { return y(d.y - (nPhrases * 2.6)); })
        .style("opacity", function(d) { 
            if (d.depth == curDepth + 1 ||
                (d.depth == 3 && curDepth == 3)){
                    return 1;
                }
            return 0;
        })

    node = d;
    d3.event.stopPropagation();
}


