Filters.warpFilter = function(image, iLines, fLines){
    var image2 = image.createImg(image.width, image.height);
    
    // initialize lines
    var a = .01;
    var b = 2;
    var p = .5;

    // morph
    for (var  j = 0; j < image.height; j++){
        for (var i = 0; i < image.width; i++){
            var dxSum = 0;
            var dySum = 0;

            var weightSum = 0;
            //console.log("i " + i);
            //console.log("j " + j);
            for (var k = 0; k < iLines.length; k++){
                var dLine = fLines[k];       
                //console.log("P: " + dLine.x0 + ", " + dLine.y0);
                //console.log("Q: " + dLine.x1 + ", " + dLine.y1);
                //calculate u, v based on PiQi
                var distQP = Math.sqrt((dLine.x1 - dLine.x0) * (dLine.x1 - dLine.x0) 
                    + (dLine.y1 - dLine.y0) * (dLine.y1 - dLine.y0));
                //console.log("QP Distance " + distQP);
                var u = ((i - dLine.x0) * (dLine.x1 - dLine.x0) + 
                    (j - dLine.y0) * (dLine.y1 - dLine.y0))/(distQP * distQP);
                //console.log("U " + u);
                //console.log("Perp: " + -dLine.y1 + ", " + dLine.x0);
                var v = ((i - dLine.x0) * (-dLine.y1 + dLine.y0) 
                    + (j - dLine.y0) * (dLine.x1 - dLine.x0))/distQP;
                //console.log("V " + v);
                //calculate X'
                var sLine = iLines[k];
                var distQP2 = Math.sqrt((sLine.x1 - sLine.x0) * (sLine.x1 - sLine.x0) 
                    + (sLine.y1 - sLine.y0) * (sLine.y1 - sLine.y0));
                //console.log("P'': " + sLine.x0 + ", " + sLine.y0);
                //console.log("Q': " + sLine.x1 + ", " + sLine.y1);
                //console.log("distQP2 " + distQP2);

                var Xx = sLine.x0 +   u * (sLine.x1 - sLine.x0) + 
                    (v * (-sLine.y1 + sLine.y0) / distQP2); 
                var Xy = sLine.y0 + u * (sLine.y1 - sLine.y0) + 
                    (v * (sLine.x1 - sLine.x0) / distQP2);

                //console.log("Displacement X: " + dispX);
                //console.log("Displacement Y: " + dispY);
                //calculate distance
                if (u > 0 && u < 1){
                    var dist = Math.abs((dLine.y1 - dLine.y0) * i - (dLine.x1 - dLine.x0) * j + 
                        dLine.x1 * dLine.y0 - dLine.y1 * dLine.x0)/distQP;
                }

                else{
                    var dist = Math.abs(v);
                }

                //console.log("Distance " + dist);
                //calculate weight
                var weight = Math.pow(Math.pow(distQP, p) / (a + dist), b);
                //console.log("Weight " + weight);
                dxSum += Xx * weight;
                dySum += Xy * weight;

                weightSum += weight;
            }
            
            var sourceX = Math.round(i + dxSum / weightSum);
            //console.log(sourceX);
            var sourceY = Math.round(j + dySum / weightSum);

            image2.setPixel(j, i, image.getPixel(sourceY, sourceX));
        }
    }

    return image2;
};

Filters.morphFilter = function( initialImg, finalImg, lines, alpha ) {
    //var finalImg = Filters.warpFilter(finalImg, lines.final, lines.initial);
    //var finalImg = initialImg.createImg(initialImg.width, initialImg.height);
    var resImg = initialImg.createImg(initialImg.width, initialImg.height);

    var curLine = new Array(lines.initial.length);

    for (var i = 0; i < lines.initial.length; i++){
        var a = (1 - alpha) * lines.initial[i].x0 + (alpha) * lines.final[i].x0;
        var b = (1 - alpha) * lines.initial[i].x1 + (alpha) * lines.final[i].x1;
        var c = (1 - alpha) * lines.initial[i].y0 + (alpha) * lines.final[i].y0;
        var d = (1 - alpha) * lines.initial[i].y1 + (alpha) * lines.final[i].y1;

        var curParam = {x0: a, x1: b, y0: c, y1: d};
        curLine[i] = curParam;
    }
    
    var warp0 = Filters.warpFilter(initialImg, lines.initial, curLine);
    var warp1 = Filters.warpFilter(finalImg, lines.final, curLine);

    for (var i = 0; i < resImg.height; i++){
        for (var j = 0; j < resImg.width; j++){
            var red = (1 - alpha) * warp0.getPixel(i, j).r + (alpha) * warp1.getPixel(i, j).r;
            var green = (1 - alpha) * warp0.getPixel(i, j).g + (alpha) * warp1.getPixel(i, j).g;
            var blue = (1 - alpha) * warp0.getPixel(i, j).b + (alpha) * warp1.getPixel(i, j).b;
        
            var pixel = new Pixel(red, green, blue);

            resImg.setPixel(i, j, pixel);
        }
    }

    return resImg;   
};
