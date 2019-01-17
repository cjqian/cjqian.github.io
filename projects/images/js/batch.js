// This is the main javascript file used for the batch version
// of the image processing assignment for COS426.
//
// Unless you are expecially interested, do not bother to
// read it closely. It's mostly just boilerplate to handle
// processing the comamnds in the URL and load inages.

// this construction helps avoid polluting the global name space
var Batch = Batch || {};

// called when image is finished loading
Batch.getImgData = function( image ) {
    var canvas = document.createElement( 'canvas' );
    canvas.width  = image.width;
    canvas.height = image.height;
    var ctx = canvas.getContext( '2d' );
    ctx.drawImage( image, 0, 0 ) ;
    
    return ctx.getImageData( 0, 0, image.width, image.height );
};

// called to load a new image
Batch.loadImage = function( imageFile, imageName, values ) {        
    var image = document.createElement( 'img' );
    image.onload = function() { 
        Batch[imageName] = new Img( image.width, image.height, Batch.getImgData(image).data );
        //all images are loaded
        if (Batch.loadedImage+1 == Batch.totalImage) {     
            Batch.controlsChangeCallback(values)
        }
        Batch.loadedImage++;
    };
    image.src = 'images/' + imageFile;  
};

// will load all images listed in the values argument
Batch.loadAllImages = function( values ) {
    // get the total number of images need to be loaded
    Batch.totalImage = 0;
    for ( var prop in values ) if ( prop.indexOf( 'File' ) > 0 ) {
        Batch.totalImage++;
    }
    
    // get how many images are already loaded
    Batch.loadedImage = 0;
    for ( var prop in values ) if ( prop.indexOf( 'File' ) > 0 ) {
        // we name the images by eliminating 'File' and adding 'Img' to it
        var imgname = prop.substring( 0,prop.length-4 ) + 'Img';
        Batch.loadImage( values[prop], imgname, values );
    }

};

// parse the command out of the url
Batch.parseUrlAndRun = function() {
    var values = {
        // if no image file is specified, default to the first one in the list
        imageFile: photoList[0],
    };
    
    // update values from url using parser
    for ( var cmd in Parser.commands ) {
        var v = unescape( Parser.commands[cmd] ).replace( '+', ' ' );
        if ( !isNaN( parseFloat(v) ) ) {
            v = parseFloat(v);
        } else if ( v == 'true' ) {
            v = true;
        } else if ( v == 'false' ) {
            v = false;
        }
        values[cmd] = v;
    }
    
    // load the first image in the file selector
    Batch.loadAllImages( values );    
}

Batch.controlsChangeCallback = function( values ) {
    // timestamp: the timestamp for gif file
    var timestamp = 1;
    // gifCmd: the command including gif 
    var gifCmd;
    // valuesGif: the values array for each grames of gif
    var valuesGif;
    // delay: gif delay(ms). Default is 200ms. 
    var delay = 200;
    
    //load marker json file if necessary, changed
    if ( 'marker' in values ) {
        var markerFile = values['marker'];
        values['marker'] = Parser.parseJson( markerFile );
    }
    
    for( var prop in values) {
        // a gif command will be (start:step:end:delay)
        // delay is optional
        if ( (typeof values[prop] == 'string' ) && (values[prop].indexOf( ':' )>=0) ) {
            gifCmd = prop;
            values[prop] = values[prop].substring(1, values[prop].length-1 );
            var tmp = values[prop].split( ':' ); 

            var start = parseFloat(tmp[0]), 
                step  = parseFloat(tmp[1]), 
                end   = parseFloat(tmp[2]);
            if (tmp.length > 3 ) delay = parseFloat( tmp[3] );
            if ( step == 0 ) step = 1;
            
            timestamp = Math.floor( (end - start) / step + 1 );
            valuesGif = [];
            for ( var i = 0; i < timestamp; i++ ) {
                valuesGif[i] = start + step * i;
            }
        }
        // the parameters for each filters can be an array like [param1, param2, ..]
        if ( (typeof values[prop] == 'string' ) && (values[prop].indexOf( ',' ) >= 0) ) {
            gifCmd = prop;
            values[prop] = values[prop].substring( 1, values[prop].length-1 );
            values[prop] = values[prop].split( ',' );
        }
    }
    
    // @param framesSeq: frame sequence
    var framesSeq = [];
    
    for ( var i = 0; i < timestamp; i++ ) {
        // 
        if( timestamp > 1 ) {
            values[gifCmd] = valuesGif[i];
        }
        // Doing filter operations
        Batch.img = Filters.update( Batch.imageImg.copyImg(), values );

        if ( Batch.totalImage == 1 ) {
            Batch.resImg = Batch.img.copyImg();
        } else if ( 'morph' in values ) {
            Batch.resImg = Filters.morphFilter(Batch.img, Batch.finalImg, values['marker'], values['morph']);
        } else if ( 'alphaFile' in values ) {
            // composite operation using alphaFile as a mask from part of foreground image to Batch.img
            Batch.resImg = Filters.compositeFilterFile(Batch.img, Batch.foregroundImg, Batch.alphaImg);
        } else if ( 'alpha' in values ) {
            // composite operation using alpha interpolation from foreground image to Batch.img
            Batch.resImg = Filters.compositeFilter(Batch.img, Batch.foregroundImg, values['alpha']);
        } else if ( 'histMatch' in values ) {
            Batch.resImg = Filters.histMatchFilter(Batch.img, Batch.foregroundImg, values['histMatch']);
        }
        
        // get result image
        var canvas = document.createElement( 'canvas' );
        canvas.width = Batch.resImg.width;
        canvas.height = Batch.resImg.height;
        var ctx = canvas.getContext( '2d' );
        ctx.putImageData( Batch.resImg.toImgData(), 0, 0 );
        // save to frame sequence
        framesSeq[i] = canvas;
    }
    // paint to the canvas
    var container = document.getElementById( 'result_div' ); 
    if ( timestamp == 1 ) {
        // single image
        container.appendChild( framesSeq[0] );
    } else {
        // gif setting
        var encoder = new GIFEncoder();
        encoder.setRepeat(0);
        //encoder.setQuality(20);
        encoder.setDelay(delay);
    
        encoder.start();
        // go in one direction, and round back
        for ( var i = 0; i < timestamp; i++ ) {
            encoder.addFrame( framesSeq[i].getContext( '2d' ) );
        }
        for ( var i = timestamp-2; i > 0; i-- ) {
            encoder.addFrame( framesSeq[i].getContext( '2d' ) );
        }
        encoder.finish();

        var binaryGif = encoder.stream().getData();
        var urlGif = 'data:image/gif;base64,' + encode64( binaryGif );
        var resGif = document.createElement( 'img' );
        resGif.src = urlGif;
        
        container.appendChild( resGif );
    }
    // the text 'processing' passes away
    document.getElementById( 'loading' ).style.display = 'none';
};


// when HTML is finished loading, do this
window.onload = function() {
    // set student info into main window
    Student.updateHTML();
    
    // wait a moment to make sure everything finishes rendering.
    // then run the batch command
    setTimeout(Batch.parseUrlAndRun, 200);
};