Filters.bilateralFilter = function( image, value ) {
    var sigmaR, sigmaS;
    if (value.length > 1) {
        sigmaR = value[0];
        sigmaS = value[1];
    } else {
        sigmaR = value;
        sigmaS = 1;        
    }

    var winR = Math.round(Math.max(sigmaR, sigmaS) * 3);
    var winSize = 2 * Math.round(Math.max(sigmaR, sigmaS) * 3) + 1;

    var newImg = image.createImg(image.width, image.height);

    //equalizing
    sigmaR = sigmaR / (Math.sqrt(2) * winR);

    var sDen = 2 * sigmaS * sigmaS;
    var cDen = 2 * sigmaR * sigmaR;

    // store spacial
    var sNums = new Array(winSize);
    for (var i = 0; i < winSize; i++){
        sNums[i] = new Array(winSize);
        for (var j = 0; j < winSize; j++){
            sNums[i][j] = - Math.sqrt((i - winR)* (i - winR) + (j - winR) * (j - winR))/sDen;
        }
    }

    /* Check columns */
    for (var i = 0; i < image.height; i++){
        for (var j = 0; j < image.width; j++){
            var pixel = image.getPixel(i, j);
            var newPixel = new Pixel(0, 0, 0);

            var factorSum = 0;
            for (var k = -winR; k <= winR; k++){
                for (var l = -winR; l <= winR; l++){
                    if ((i + k) >= 0 && (i + k) < image.height &&
                        (j + l) >= 0 && (j + l) < image.width){
                        var curPixel = image.getPixel(i + k, j + l);

                        var rDif = (pixel.r - curPixel.r)/255;
                        var gDif = (pixel.g - curPixel.g)/255;
                        var bDif = (pixel.b - curPixel.b)/255;
                        var cDif = Math.pow((rDif * rDif) + (gDif * gDif) + (bDif * bDif), 1/3);
 
                        var factor = Math.exp(sNums[k + winR][l + winR] - (cDif * cDif / cDen));
                        factorSum += factor;

                        newPixel.r += curPixel.r * factor;
                        newPixel.g += curPixel.g * factor;
                        newPixel.b += curPixel.b * factor;
                    }
                }
            }
            
            newPixel.r = newPixel.r / factorSum;
            newPixel.g = newPixel.g / factorSum;
            newPixel.b = newPixel.b / factorSum;

            newImg.setPixel(i, j, newPixel);
        }
    }

    // ----------- STUDENT CODE END ------------
    return newImg;
};