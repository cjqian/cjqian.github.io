var Filters = Filters || {};

// default sampling method is point sampling
// after implementing bilinear sampling, you may wish to change this to 'bilinear'
Filters.sampling = 'gaussian';

Filters.samplePixel = function ( image, x, y ) {
    if ( this.sampling == 'bilinear') {
        var i = Math.max( 0, Math.min(Math.round(x), image.height- 1) );
        var j = Math.max( 0, Math.min(Math.round(y), image.width - 1) );

        var up = Math.max( 0, Math.min(Math.round(x - 1), image.height- 1) );
        var down = Math.max( 0, Math.min(Math.round(x + 1), image.height- 1) );
        var left = Math.max( 0, Math.min(Math.round(y - 1), image.width - 1) );
        var right = Math.max( 0, Math.min(Math.round(y + 1), image.width - 1) );

        var ra = image.getPixel(up, left).r;
        var ga = image.getPixel(up, left).g;
        var ba = image.getPixel(up, left).b;

        var rb = image.getPixel(up, right).r;
        var gb = image.getPixel(up, right).g;
        var bb = image.getPixel(up, right).b;

        var rc = image.getPixel(down, left).r;
        var gc = image.getPixel(down, left).g;
        var bc = image.getPixel(down, left).b;

        var rd = image.getPixel(down, right).r;
        var gd = image.getPixel(down, right).g;
        var bd = image.getPixel(down, right).b;

        var topr = (ra + rb)/2;
        var topg = (ga + gb)/2;
        var topb = (ba + bb)/2;

        var botr = (rc + rd)/2;
        var botg = (gc + gd)/2;
        var botb = (bc + bd)/2;

        var avgr = (topr + botr)/2;
        var avgg = (topg + botg)/2;
        var avgb = (topb + botb)/2;

        var pixel = new Pixel(avgr, avgg, avgb);

        return pixel;

    } else if ( this.sampling == 'gaussian' ) {
        var sigma = 1;
        var R = 3;

        var pixel = new Pixel(0, 0, 0);

        var factorSum = 0;
        for (var k = -R; k <= R; k++){
            for (var l = -R; l <= R; l++){
                if ((x + k) < image.height && (x + k) >= 0 &&
                    (y + l) < image.width && (y + l) >= 0){
                    var curPixel = image.getPixel(x + k, y + l);
                    var factor = Math.exp(-(k * k + l * l)/(2 * sigma * sigma));
                    factorSum += factor;

                    pixel.r += curPixel.r * factor;
                    pixel.g += curPixel.g * factor;
                    pixel.b += curPixel.b * factor;
                }
            }
        }

        pixel.r = pixel.r / factorSum;
        pixel.g = pixel.g / factorSum;
        pixel.b = pixel.b / factorSum;

        return pixel;
        
    } else { // point sampling
        var i = Math.max( 0, Math.min(Math.round(x), image.height- 1));
        var j = Math.max( 0, Math.min(Math.round(y), image.width - 1));

        return image.getPixel(i, j);
    } 
}

Filters.brightnessFilter = function( image, ratio ) {
    var alpha, dirLuminance;
    if (ratio < 0.0) {
        alpha = 1 + ratio;
        dirLuminance = 0;   // blend with black
    } else {
        alpha = 1 - ratio;
        dirLuminance = 255; // blend with white
    }
    for (var i = 0; i < image.height; i++) {
        for (var j = 0; j < image.width; j++) {
            var pixel = image.getPixel(i, j);
            
            pixel.r = alpha * pixel.r + (1-alpha) * dirLuminance;
            pixel.g = alpha * pixel.g + (1-alpha) * dirLuminance;
            pixel.b = alpha * pixel.b + (1-alpha) * dirLuminance;

            image.setPixel(i, j, pixel)
        }
    }
    return image;
};

Filters.contrastFilter = function( image, ratio ) {
    var constRatio = Math.tan((ratio + 1) * Math.PI/4);
    for (var i = 0; i < image.height; i++) {
        for (var j = 0; j < image.width; j++) {
            var pixel = image.getPixel(i, j);
            
            pixel.r = (pixel.r - 128) * constRatio + 128;
            pixel.g = (pixel.g - 128) * constRatio + 128;
            pixel.b = (pixel.b - 128) * constRatio + 128;

            image.setPixel(i, j, pixel)
        }
    }

    return image;
};

Filters.gammaFilter = function( image, logOfGamma ) {
    var gamma = Math.exp(logOfGamma);

    for (var i = 0; i < image.height; i++) {
        for (var j = 0; j < image.width; j++) {
            var pixel = image.getPixel(i, j);
            
            pixel.r = pixel.r / 255;
            pixel.g = pixel.g / 255;
            pixel.b = pixel.b / 255;

            pixel.r = Math.pow(pixel.r, gamma);
            pixel.g = Math.pow(pixel.g, gamma);
            pixel.b = Math.pow(pixel.b, gamma);

            pixel.r = pixel.r * 255;
            pixel.g = pixel.g * 255;
            pixel.b = pixel.b * 255;

            image.setPixel(i, j, pixel)
        }
    }

    return image;    
};

Filters.vignetteFilter = function( image, value ) {
    var innerRadius, outerRadius;
    if (value.length > 1) {
        innerRadius  = 0.5 - 0.5 * value[0];
        outerRadius = 0.5 + 0.5 * value[1];
    } else {
        innerRadius  = 0.5 - 0.5 * value;
        outerRadius = 1;        
    }
    
    innerRadius = innerRadius * Math.min(image.height, image.width);
    outerRadius = outerRadius * Math.min(image.height, image.width);
      // ----------- STUDENT CODE BEGIN ------------
    for (var i = 0; i < image.height; i++){
        for (var j = 0; j < image.width; j++){
            var xdist = (i - (image.height/2));
            xdist = xdist * xdist;

            var ydist = (j - (image.width/2));
            ydist = ydist * ydist;

            var dist = Math.sqrt(xdist + ydist);
 
            //Do nothing if inside inner radius
            var blackPixel = new Pixel(0, 0, 0);
        
            
            if (dist >= outerRadius){
                image.setPixel(i, j, blackPixel);
            }

             else if (dist > innerRadius && dist < outerRadius){
                var pixel = image.getPixel(i, j);
                var diff = (dist - innerRadius)/(outerRadius - innerRadius);
                pixel.r = (1-diff)*pixel.r;
                pixel.g = (1-diff)*pixel.g;
                pixel.b = (1-diff)*pixel.b;

                image.setPixel(i, j, pixel);
            }
        }
    }
    // ----------- STUDENT CODE END ------------
    return image;
};

Filters.histeqFilter = function( image ) {
    /* initialize arrays */
    var cdfArray= new Array(image.height);
    var hArray = new Array(image.height);
    var sArray = new Array(image.height);
    var lArray = new Array(image.height);

    for (var i = 0; i < image.width; i++){
        hArray[i] = new Array(image.width);
        sArray[i] = new Array(image.width);
        lArray[i] = new Array(image.width);
        cdfArray[i] = new Array(image.width);
    }

    /* get HSL values */
    for (var i = 0; i < image.height; i++){
        for (var j = 0; j < image.width; j++){
            var pixel = image.getPixel(i, j);
            var curArray = pixel.convertToHSL();
            hArray[i][j] = curArray[0];
            sArray[i][j] = curArray[1];
            lArray[i][j] = curArray[2];
        }
    }

    var histoBin = new Array(256);
    for (var i = 0; i < 256; i++){
        histoBin[i] = 0;
    }

    /* Count sets. */
    for (var i = 0; i < image.height; i++) {
        for (var j = 0; j < image.width; j++) {
            histoBin[Math.round(lArray[i][j] * 255)]++;
        }
    }

    // make it cdf
    var nonZero = 0;
    var minVal = -1;

    if (histoBin[0] != 0){
        nonZero++;
        minVal = 0;
    }

    for (var i = 1; i < 256; i++){
        if (histoBin[i] != 0){
            nonZero++;

            if (minVal == -1) minVal = i;
        }

        histoBin[i] = histoBin[i] + histoBin[i - 1];
    }

    // scale it
    for (var i = 0; i < 256; i++){
        histoBin[i] = (histoBin[i] - histoBin[minVal])/(image.width * image.height - histoBin[minVal]) * 255;
    }

    // set the cdf for each pixel
    for (var i = 0; i < image.height; i++) {
        for (var j = 0; j < image.width; j++) {
            cdfArray[i][j] = histoBin[Math.round(lArray[i][j] * 255)];
        }
    }

    for (var i = 0; i < image.height; i++){
        for (var j = 0; j < image.width; j++){
            var pixel = new Pixel(0, 0, 0);
            pixel.convertFromHSL(hArray[i][j], sArray[i][j], cdfArray[i][j] / 255);
            image.setPixel(i, j, pixel);
        }
    }

    return image;
};

Filters.grayFilter = function( image ) { 
    for (var i = 0; i < image.height; i++) {
        for (var j = 0; j < image.width; j++) {
            var pixel = image.getPixel(i, j);
            var luminance = 0.2126 * pixel.r + 0.7152 * pixel.g + 0.0722 * pixel.b;
            pixel.r = luminance;
            pixel.g = luminance;
            pixel.b = luminance;

            image.setPixel(i, j, pixel);
        }
    }

    return image;
};

Filters.saturationFilter = function( image, ratio ) {
    var alpha = 1 + ratio;
    for (var i = 0; i < image.height; i++) {
        for (var j = 0; j < image.width; j++) {
            var pixel = image.getPixel(i, j);
            var luminance = 0.2126 * pixel.r + 0.7152 * pixel.g + 0.0722 * pixel.b;
    
            pixel.r = alpha * pixel.r + (1 - alpha) * luminance;
            pixel.g = alpha * pixel.g + (1 - alpha) * luminance;
            pixel.b = alpha * pixel.b + (1 - alpha) * luminance;

            image.setPixel(i, j, pixel);
        }
    }

    return image;
}; 

Filters.whiteBalanceFilter = function( image, hex ) {
    var white = new Pixel(0, 0, 0);
    white.copyFromHex(hex);

    // Convert to XYZ color space
    var Xw = .4124 * white.r + .3576 * white.g + .1805 * white.b;
    var Yw = .2126 * white.r + .7152 * white.g + .0722 * white.b;
    var Zw = .0193 * white.r + .1192 * white.g + .9502 * white.b;

    // Convert to LMS color space
    var Lw = .40024 * Xw + .7076 * Yw + -.08081 * Zw;
    var Mw = -.2263 * Xw + 1.16532 * Yw + .0457 * Zw;
    var Sw = .91822 * Zw;

    for (var i = 0; i < image.height; i++) {
        for (var j = 0; j < image.width; j++) {
            var pixel = image.getPixel(i, j);

            // Convert to XYZ color space
            var x = .4124 * pixel.r + .3576 * pixel.g + .1805 * pixel.b;
            var y = .2126 * pixel.r + .7152 * pixel.g + .0722 * pixel.b;
            var z = .0193 * pixel.r + .1192 * pixel.g + .9502 * pixel.b;

            // Convert to LMS color space
            var L = .40024 * x + .7076 * y + -.08081 * z;
            var M = -.2263 * x + 1.16532 * y + .0457 * z;
            var S = .91822 * z;

            // Divide by L_wM_wS_w
            L = L / Lw;
            M = M / Mw;
            S = S / Zw;

            // Convert back
            x = 1.85973 * L - 1.12925 * M + .219873 * S;
            y = .36131 * L + .63874 * M + .00000767514 * S;
            z = 1.08906 * S;

            pixel.r = 3.24062 * x - 1.53718 * y - .498787 * z;
            pixel.g = -.96893 * x + 1.87575 * y + .0415307 * z;
            pixel.b = .0557278 * x - .204086 * y + 1.05733 * z;

            pixel.r = pixel.r * 255;
            pixel.g = pixel.g * 255;
            pixel.b = pixel.b * 255;

            image.setPixel(i, j, pixel);
        }
    }
     
    return image;
};

Filters.gaussianFilter = function( image, sigma ) {
    var newImg = image.createImg(image.width, image.height);
    var newImg2 = image.createImg(image.width, image.height);

    // the filter window will be [-winR, winR];
    var winR = Math.round(sigma*2);
    // ----------- STUDENT CODE BEGIN ------------
     /* Check rows */
    for (var i = 0; i < image.height; i++){
        for (var j = 0; j < image.width; j++){
            var pixel = new Pixel(0, 0, 0);

            var factorSum = 0;
            for (var k = -winR; k <= winR; k++){
                if ((i + k) >= 0 && (i + k) < image.height){
                    var curPixel = image.getPixel(i + k, j);

                    var factor = Math.exp(-(k*k)/(2*sigma*sigma));
                    factorSum += factor;
                    pixel.r += curPixel.r * factor;
                    pixel.g += curPixel.g * factor;
                    pixel.b += curPixel.b * factor;
                }  
            }

            pixel.r = pixel.r / factorSum;
            pixel.g = pixel.g / factorSum;
            pixel.b = pixel.b / factorSum;

            newImg.setPixel(i, j, pixel);
        }
    }

    /* Check columns */
    for (var i = 0; i < image.height; i++){
        for (var j = 0; j < image.width; j++){
            var pixel = new Pixel(0, 0, 0);

            var factorSum = 0;
            for (var k = -winR; k <= winR; k++){
                if ((j + k) >= 0 && (j + k) < image.width){
                    var curPixel = newImg.getPixel(i, j + k);
                    curPixel.clamp();

                    var factor = Math.exp(-(k*k)/(2*sigma*sigma));
                    factorSum += factor;

                    pixel.r += curPixel.r * factor;
                    pixel.g += curPixel.g * factor;
                    pixel.b += curPixel.b * factor;
                }
            }

            pixel.r = pixel.r / factorSum;
            pixel.g = pixel.g / factorSum;
            pixel.b = pixel.b / factorSum;

            newImg2.setPixel(i, j, pixel);
        }
    }


    // ----------- STUDENT CODE END ------------
    return newImg2;
};

Filters.edgeFilter = function( image ) {
    var newImg = image.createImg(image.width, image.height);

    for (var i = 0; i < image.height; i++) {
        for (var j = 0; j < image.width; j++) {
            var pixel = image.getPixel(i, j);
            var newPixel = new Pixel(0, 0, 0);

            /* Top */
            if (i != 0){
                newPixel.r += Math.abs(pixel.r - image.getPixel(i - 1, j).r);
                newPixel.g += Math.abs(pixel.g - image.getPixel(i - 1, j).g);
                newPixel.b += Math.abs(pixel.b - image.getPixel(i - 1, j).b);
            }

            /* Bottom */
            if (i != image.height - 1){
                newPixel.r += Math.abs(pixel.r - image.getPixel(i + 1, j).r);
                newPixel.g += Math.abs(pixel.g - image.getPixel(i + 1, j).g);
                newPixel.b += Math.abs(pixel.b - image.getPixel(i + 1, j).b);
            }
    
            /* Left */
            if (j != 0){
                newPixel.r += Math.abs(pixel.r - image.getPixel(i, j - 1).r);
                newPixel.g += Math.abs(pixel.g - image.getPixel(i, j - 1).g);
                newPixel.b += Math.abs(pixel.b - image.getPixel(i, j - 1).b);
            }
      
             /* Bottom */
            if (j != image.width - 1){
                newPixel.r += Math.abs(pixel.r - image.getPixel(i, j + 1).r);
                newPixel.g += Math.abs(pixel.g - image.getPixel(i, j + 1).g);
                newPixel.b += Math.abs(pixel.b - image.getPixel(i, j + 1).b);
            }
          
            /* Top left */
            if (i != 0 && j != 0){
                newPixel.r += Math.abs(pixel.r - image.getPixel(i - 1, j - 1).r);
                newPixel.g += Math.abs(pixel.g - image.getPixel(i - 1, j - 1).g);
                newPixel.b += Math.abs(pixel.b - image.getPixel(i - 1, j - 1).b);
            }
          
            /* Top right */
            if (i != 0 && j != image.width - 1){
                newPixel.r += Math.abs(pixel.r - image.getPixel(i - 1, j + 1).r);
                newPixel.g += Math.abs(pixel.g - image.getPixel(i - 1, j + 1).g);
                newPixel.b += Math.abs(pixel.b - image.getPixel(i - 1, j + 1).b);
            }

            /* Bottom left */
            if (i != image.height - 1 && j != 0){
                newPixel.r += Math.abs(pixel.r - image.getPixel(i + 1, j - 1).r);
                newPixel.g += Math.abs(pixel.g - image.getPixel(i + 1, j - 1).g);
                newPixel.b += Math.abs(pixel.b - image.getPixel(i + 1, j - 1).b);
            }
             
            /* Top right */
            if (i != image.height - 1 && j != image.width - 1){
                newPixel.r += Math.abs(pixel.r - image.getPixel(i + 1, j + 1).r);
                newPixel.g += Math.abs(pixel.g - image.getPixel(i + 1, j + 1).g);
                newPixel.b += Math.abs(pixel.b - image.getPixel(i + 1, j + 1).b);
            }

            newPixel.r = 255 - newPixel.r;
            newPixel.g = 255 - newPixel.g;
            newPixel.b = 255 - newPixel.b;

            newImg.setPixel(i, j, newPixel);
        }
    }

    return newImg;
};

Filters.sharpenFilter = function( image ) {
    var newImg = image.createImg(image.width, image.height);
    for (var i = 0; i < image.height; i++) {
        for (var j = 0; j < image.width; j++) {
            var pixel = image.getPixel(i, j);

            pixel.r = pixel.r * 9;
            pixel.g = pixel.g * 9;
            pixel.b = pixel.b * 9;

            /* Top */
            if (i != 0){
                pixel.r += -1 * image.getPixel(i - 1, j).r;
                pixel.g += -1 * image.getPixel(i - 1, j).g;
                pixel.b += -1 * image.getPixel(i - 1, j).b;
            }

            /* Down */
            if (i != image.height - 1){
                pixel.r += -1 * image.getPixel(i + 1, j).r;
                pixel.g += -1 * image.getPixel(i + 1, j).g;
                pixel.b += -1 * image.getPixel(i + 1, j).b;
            }
        
            /* Left */
            if (j != 0){
                pixel.r += -1 * image.getPixel(i, j - 1).r;
                pixel.g += -1 * image.getPixel(i, j - 1).g;
                pixel.b += -1 * image.getPixel(i, j - 1).b;
            }
          
            /* Right */
            if (j != image.width - 1){
                pixel.r += -1 * image.getPixel(i, j + 1).r;
                pixel.g += -1 * image.getPixel(i, j + 1).g;
                pixel.b += -1 * image.getPixel(i, j + 1).b;
            }
              
            /* Top left */
            if (i != 0 && j != 0){
                pixel.r += -1 * image.getPixel(i - 1, j - 1).r;
                pixel.g += -1 * image.getPixel(i - 1, j - 1).g;
                pixel.b += -1 * image.getPixel(i - 1, j - 1).b;
            }
                 
            /* Top right */
            if (i != 0 && j != image.width - 1){
                pixel.r += -1 * image.getPixel(i - 1, j + 1).r;
                pixel.g += -1 * image.getPixel(i - 1, j + 1).g;
                pixel.b += -1 * image.getPixel(i - 1, j + 1).b;
            }

            /* Bottom left */
            if (i != image.height - 1 && j != 0){
                pixel.r += -1 * image.getPixel(i + 1, j - 1).r;
                pixel.g += -1 * image.getPixel(i + 1, j - 1).g;
                pixel.b += -1 * image.getPixel(i + 1, j - 1).b;
            }
                 
            /* Bottom right */
            if (i != image.height - 1 && j != image.width - 1){
                pixel.r += -1 * image.getPixel(i + 1, j + 1).r;
                pixel.g += -1 * image.getPixel(i + 1, j + 1).g;
                pixel.b += -1 * image.getPixel(i + 1, j + 1).b;
            }

            newImg.setPixel(i, j, pixel);
        }
    }

    return newImg;
};

Filters.medianFilter = function( image, winR ) {
    var newImg = image.createImg(image.width, image.height);

    // winR: the window will be  [-winR, winR];
    // ----------- STUDENT CODE BEGIN ------------
    for (var i =0; i < image.height; i++){
        for (var j = 0; j < image.width; j++){
            var r = [];
            var g = [];
            var b = [];    

            for (var row = -winR; row <= winR; row++){
                for (var col = -winR; col <= winR; col++){
                    if (i + row >= 0 && i + row < image.height &&
                        j + col >= 0 && j + col < image.width){
                        var curPixel = image.getPixel(i + row, j + col);
                    }

                    else var curPixel = image.getPixel(i, j);

                    r[r.length] = curPixel.r;
                    g[g.length] = curPixel.g;
                    b[b.length] = curPixel.b;
                }
            }

            r.sort();
            g.sort();
            b.sort();

            var pixel = new Pixel(0, 0, 0);
            var size = (2 * winR + 1) * (2 * winR + 1);

            if (size % 2 == 0) {
                pixel.r = (r[size / 2] + r[(size / 2) - 1]) / 2;
                pixel.g = (g[size / 2] + g[(size / 2) - 1]) / 2;
                pixel.b = (b[size / 2] + b[(size / 2) - 1]) / 2;
            }

            else{
                pixel.r = r[(size - 1) / 2];
                pixel.g = g[(size - 1) / 2];
                pixel.b = b[(size - 1) / 2];
            }

            newImg.setPixel(i, j, pixel);
        }
    }

    // ----------- STUDENT CODE END ------------
    return newImg;
};


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
    var winSize = 2 * winR + 1;

    var newImg = image.createImg(image.width, image.height);

    //normalize
    sigmaR = sigmaR / (Math.sqrt(2) * winR);

    var sDen = 2 * sigmaS * sigmaS;
    var cDen = 2 * sigmaR * sigmaR;

    // store spacial values
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


Filters.quantizeFilter = function( image, numBits ) {
    numBits--;

    for (var i = 0; i < image.height; i++){
        for (var j = 0; j < image.width; j++){
            var pixel = image.getPixel(i, j);
            var r = Math.round(pixel.r * numBits / 255) * 255 / numBits;
            var g = Math.round(pixel.g * numBits / 255) * 255 / numBits;
            var b = Math.round(pixel.b * numBits / 255) * 255 / numBits;

            var newPixel = new Pixel(r, g, b);
            image.setPixel(i, j, newPixel);
        }
    }
    return image;

};

Filters.randomFilter = function( image, numBits ) {
    for (var i = 0; i < image.height; i++){
        for (var j = 0; j < image.width; j++){
            var pixel = image.getPixel(i, j);
            var r = Math.round(pixel.r * numBits / 255 + (Math.random() - .5) * 2) * 255 / numBits;
            var g = Math.round(pixel.g * numBits / 255 + (Math.random() - .5) * 2) * 255 / numBits;
            var b = Math.round(pixel.b * numBits / 255 + (Math.random() - .5) * 2) * 255 / numBits;

            var newPixel = new Pixel(r, g, b);
            image.setPixel(i, j, newPixel);
        }
    }
    return image;

};

Filters.orderedFilter = function( image, numBits ) {
    var bayer = [[15, 7, 13, 5],
                 [3, 11, 1, 9],
                 [12, 4, 14, 6],
                 [0, 8, 2, 10]];

    var tempBits = numBits;

    for (var i = 0; i < image.height; i++){
        for (var j = 0; j < image.width; j++){
            var pixel = image.getPixel(i, j);

            var threshold = ((bayer[i % 4][j % 4]) + 1) / 17;

            var re = ((pixel.r * tempBits / 255) - Math.floor(pixel.r * tempBits/ 255));
            var ge = ((pixel.g * tempBits / 255) - Math.floor(pixel.g * tempBits/ 255));
            var be = ((pixel.b * tempBits / 255) - Math.floor(pixel.b * tempBits/ 255));

            if (re > threshold) pixel.r = Math.ceil((pixel.r / 255) * tempBits);
            else pixel.r = Math.floor((pixel.r / 255) * tempBits);

            if (ge > threshold) pixel.g = Math.ceil((pixel.g / 255) * tempBits);
            else pixel.g = Math.floor((pixel.g / 255) * tempBits);

            if (be > threshold) pixel.b = Math.ceil((pixel.b / 255) * tempBits);
            else pixel.b = Math.floor((pixel.b / 255) * tempBits);
        
            pixel.r = pixel.r *  (255 / tempBits);
            pixel.g = pixel.g *  (255 / tempBits);
            pixel.b = pixel.b *  (255 / tempBits);
            
            image.setPixel(i, j, pixel);
        }
    }
    return image;            
};

Filters.floydFilter = function( image, numBits ) {
    /* constants */
    var a = 7/16;
    var b = 3/16;
    var c = 5/16;
    var d = 1/16;

    /* initialize arrays */
    var rArray = new Array(image.height);
    var gArray = new Array(image.height);
    var bArray = new Array(image.height);

    for (var i = 0; i < image.height; i++){
        rArray[i] = new Array(image.width);
        gArray[i] = new Array(image.width);
        bArray[i] = new Array(image.width);

        for (var j = 0; j < image.width; j++){
            rArray[i][j] = image.getPixel(i, j).r;
            gArray[i][j] = image.getPixel(i, j).g;
            bArray[i][j] = image.getPixel(i, j).b;
        }
    }

    // calculate errors, store in array
    for (var i = 0; i < image.height; i++){
        for (var j = 0; j < image.width; j++){
            var newR = Math.round(rArray[i][j] * numBits / 255) * 255 / numBits;
            var newG = Math.round(gArray[i][j] * numBits / 255) * 255 / numBits;
            var newB = Math.round(bArray[i][j] * numBits / 255) * 255 / numBits;
       
            var errR = rArray[i][j] - newR;
            var errG = gArray[i][j] - newG;
            var errB = bArray[i][j] - newB;

            rArray[i][j] = newR;
            gArray[i][j] = newG;
            bArray[i][j] = newB;

            if (j < image.width - 1){
                rArray[i][j + 1] += errR * a;
                gArray[i][j + 1] += errG * a;
                bArray[i][j + 1] += errB * a;
            }

            if (j > 0 && i < image.height - 1){
                rArray[i + 1][j - 1] += errR * b;
                gArray[i + 1][j - 1] += errG * b;
                bArray[i + 1][j - 1] += errB * b;
            }

            if (i < image.height - 1){
                rArray[i + 1][j] += errR * c;
                gArray[i + 1][j] += errG * c;
                bArray[i + 1][j] += errB * c;
            }

            if (j < image.width - 1 && i < image.height - 1){
                rArray[i + 1][j + 1] += errR * d;
                gArray[i + 1][j + 1] += errG * d;
                bArray[i + 1][j + 1] += errB * d;
            }
        }
    }

    // apply calculations
    for (var i = 0; i < image.height; i++){
        for (var j = 0; j < image.width; j++){
            var pixel = new Pixel(rArray[i][j], gArray[i][j], bArray[i][j]);
            image.setPixel(i, j, pixel);
        }
    }
    return image; 
};

Filters.scaleFilter = function( image, ratio ) {
    //bicubic
    var w = Math.round(ratio * image.width);
    var h = Math.round(ratio * image.height);

    var newImg = image.createImg(w, h);

    for (var i = 0; i < newImg.height; i++){
        for (var j = 0; j < newImg.width; j++){

                var x = Math.floor(1/ratio * i);
                var y = Math.floor(1/ratio * j);
                var pixel = Filters.samplePixel(image, x, y);

                newImg.setPixel(i, j, pixel);
        }
    }

    return newImg;
};

Filters.rotateFilter = function( image, value ) {
    // Note: set pixels outside the image to RGBA(0,0,0,0)
    var angle = value * Math.PI;
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    
    var h = Math.abs(sin) * image.width + Math.abs(cos) * image.height;
    var w = Math.abs(cos) * image.width + Math.abs(sin) * image.height;

    w = Math.ceil(w);
    h = Math.ceil(h);

    var newImg = image.createImg(w, h);

    var xCenter = 0;
    var yCenter = 0;

    if (value <= .5 && value > 0){
        xCenter = w - ((image.width - 1) * Math.cos(-angle));
        yCenter = h - ((image.height - 1) * Math.cos(-angle) - (image.width - 1) * Math.sin(-angle));
    }

    if (value <= .5 && value < 0){
        xCenter = w;
        yCenter = h - ((image.height - 1) * Math.cos(-angle)); 
    }

    if (value <= -.5){
        xCenter = w - ((image.height - 1) * Math.sin(-angle));
        yCenter = - ((image.height - 1) * Math.cos(-angle) - (image.width - 1) * Math.sin(-angle));
    }

    else if (value >= .5){
        yCenter = h + (image.width - 1) * Math.sin(-angle);
    }

    for (var i = 0; i < image.height; i++){
        for (var j = 0; j < image.width; j++){
            var x = i * Math.cos(-angle) - j * Math.sin(-angle) + yCenter;
            var y = i * Math.sin(-angle) + j * Math.cos(-angle) + xCenter;
            
            var pixel = Filters.samplePixel(image, i, j);
            newImg.setPixel(Math.round(x), Math.round(y), pixel);
        }
    }
            

            //var pixel = image.getPixel(i, j);


    return newImg;
};

Filters.swirlFilter = function( image, value ) {
    var angle = value * 2.0 * Math.PI;
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- STUDENT CODE END ------------
    Gui.alertOnce ('swirlFilter is not implemented yet');
    return image;
};

Filters.compositeFilterFile = function( backgroundImg, foregroundImg, alphaImg ) {
    var image = backgroundImg.createImg(backgroundImg.width, backgroundImg.height);

    for (var i = 0; i < image.height; i++){
        for (var j = 0; j < image.width; j++){
            var ra = alphaImg.getPixel(i, j).r / 255;
            var ga = alphaImg.getPixel(i, j).g / 255;
            var ba = alphaImg.getPixel(i, j).b / 255;

            var red = (1 - ra) * backgroundImg.getPixel(i, j).r +
                        ra * foregroundImg.getPixel(i, j).r;
            var green = (1 - ga) * backgroundImg.getPixel(i, j).g +
                        ra * foregroundImg.getPixel(i, j).g;
            var blue = (1 - ba) * backgroundImg.getPixel(i, j).b +
                        ra * foregroundImg.getPixel(i, j).b;

            var pixel = new Pixel(red, green, blue);
            image.setPixel(i, j, pixel);
        }
    }

    return image;
};

Filters.compositeFilter = function( backgroundImg, foregroundImg, alpha ) {
    var image = backgroundImg.createImg(backgroundImg.width, backgroundImg.height);
    for (var i = 0; i < image.height; i++){
        for (var j = 0; j < image.width; j++){
            var red = (1 - alpha) * backgroundImg.getPixel(i, j).r +
                        alpha * foregroundImg.getPixel(i, j).r;
            var green = (1 - alpha) * backgroundImg.getPixel(i, j).g +
                        alpha * foregroundImg.getPixel(i, j).g;
            var blue = (1 - alpha) * backgroundImg.getPixel(i, j).b +
                        alpha * foregroundImg.getPixel(i, j).b;

            var pixel = new Pixel(red, green, blue);
            image.setPixel(i, j, pixel);
        }
    }
    return image;
};

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

                //console.log("X " + Xx);
                //console.log("Y " + Xy);

                //console.log("Displacement X: " + dispX);
                //console.log("Displacement Y: " + dispY);
                //calculate distance
                if (u > 0 && u < 1){
                    var dist = Math.abs((dLine.y1 - dLine.y0) * i - (dLine.x1 - dLine.x0) * j + 
                        dLine.x1 * dLine.y0 - dLine.y1 * dLine.x0)/distQP;
                }

                else{
                    var distXP = Math.sqrt((i - sLine.x0) * (i - sLine.x0) 
                    + (j - sLine.y0) * (j - sLine.y0));
                    var distXQ = Math.sqrt((i - sLine.x1) * (i - sLine.x1) 
                    + (j - sLine.y1) * (j - sLine.y1));

                    var dist = Math.min(distXP, distXQ);
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


Filters.paintFilter = function( image, value ) {
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- STUDENT CODE END ------------
    Gui.alertOnce ('compositeFilter is not implemented yet');
    return image;
};

Filters.xDoGFilter = function( image, value ) {
    // value could be an array
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- STUDENT CODE END ------------
    Gui.alertOnce ('xDoGFilter is not implemented yet');
    return image;
};

Filters.paletteFilter = function( image, colorNum ) {
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- STUDENT CODE END ------------
    Gui.alertOnce ('paletteFilter is not implemented yet');
    return image;
};

Filters.artFilter = function(image, value) {
    var adam = document.createElement('img');
    adam.src = 'images/glad.jpg';
    return image;
    /*
    var madam = document.createElement('img');
    madam.src = 'images/madam.jpg';

    var gradam = document.createElement('img');
    gradam.src = 'images/grad.jpg';

    var badam = document.createElement('img');
    badam.src = 'images/bad.jpg';

    var madamfilt = document.createElement('img');
    madamfilt.src = 'images/madamfilter.jpg';

    var gradfilt = document.createElement('img');
    gradfilt.src = 'images/gradfilter.jpg';

    var badfilt = document.createElement('img');
    badfilt.src = 'images/badfilter.jpg';

    var m = Filters.compositeFilterFile(madam, adam, madamfilt);
    var gr = Filters.compositeFilterFile(adam, grad, gradfilt);
    var gray = Filters.grayFilter(adam);
    var b = Filters.compositeFilterFile(bad, grayadam, badfilt);
    *//*
    var art = adam.createImg(2 * adam.width, 2 * adam.height);

    for (var i = 0; i < art.height; i++){
        for (var j = 0; j < art.width; j++){
            //gladam
            if (i < adam.height && j < adam.width){
                art.setPixel(i, j, adam.getPixel(i, j));
            }
            
            //badam
            if (i < adam.height && j > adam.width){
                art.setPixel(i, j, b.getPixel(i, j - adam.width));
            }

            //gradam
            if (i > adam.height && j < adam.width){
                art.setPixel(i, j, gr.getPixel(i - adam.height, j));
            }

            //madam
            else{
                art.setPixel(i, j, m.getPixel(i - adam.height, j - adam.width));
            }
        }
    }

    return art;*/
};


// gui params have changed; run the image through all the active filters
Filters.update = function( image, values ) {
    var time = performance.now();
    
    this.sampling = values['sample'];
    
    for ( var prop in values ) {
        if ( (prop in Gui.defaults) && (values[prop] !== Gui.defaults[prop]) ) {
            var val = values[prop];
            if (Gui.propIsStringMenuItem(prop)) {
                val = parseInt(val.trim());
            }
            image = Filters[prop+'Filter']( image, val );
        }
    }
    time = Math.round( performance.now() - time );
    console.log('Filter operation took ' + time + ' ms.');
    
    return image;
};