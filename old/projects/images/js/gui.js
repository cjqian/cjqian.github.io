// use strict mode (http://www.w3schools.com/js/js_strict.asp) 
"use strict";

var Gui = Gui || {};

var photoList = [
    'flower.jpg',
    'goldengate.jpg',
    'leaves.jpg',
    'woman.jpg',
    'man.jpg',
    'mesa.jpg',
    'town.jpg',
    'face_crop.jpg',
];    

// open in a new tab
var tabList = [
    'none', 
    // an example of using multiple parameters in the batch url (param1, param2)
    'bilateral',
    // this shows a fun way to make a gif animation of the swirl operation
    'swirlAnim',
    // for these operations, multiple input images are required
    'morphAnim', 
    'composite', 
    'histMatch', 
    // run slow operations in a seperate window
    'paint',
    'xDoG',
    'palette',
    // 
    'art',
];

var quantList = [ 'none', ' 2 ', ' 4 ', ' 8 ', ' 16 ', ' 32 ' ];

var paletteList = [ 'none', ' 2 ', ' 3 ', ' 4 ', ' 5 ', ' 6 ' ];

var sampleList = ['point', 'bilinear', 'gaussian'];
var sampleDefault = Filters.sampling;
// due to a bug in dat GUI we need to initialize floats to non-interger values (like 0.5)
// (the variable Gui.defaults below then carries their default values, which we set later)
Gui.values = {
    imageFile:     photoList[0],
    reset:         function () {},
    exclusive:     false,
    morphLines:    function () {},
    guiToBatch:    function () {},
    brightnessAnim:function () {},
    newTab:        tabList[0],
    brightness:    0.5,
    contrast:      0.5,
    gamma:         0.5,
    vignette:      0.5,
    histeq:        false,
    gray:          false,     
    saturation:    0.5,
    whiteBalance:  "#ffffff",
    gaussian:      0,
    sharpen:       false,
    edge:          false,
    median:        0,
    bilateral:     0,
    quantize:      quantList[0],
    random:        quantList[0],
    ordered:       quantList[0],
    floyd:         quantList[0],
    sample:        sampleDefault,
    scale:         0.5,
    rotate:        0.5,
    swirl:         0.5, 
    paint:         0.5,   
    xDoG:          0.5,
    palette:       paletteList[0], 
};

Gui.defaults = {
    //
    brightness: 0.0,
    contrast:   0.0,
    gamma:      0.0,
    vignette:   0.0,
    histeq:     false,
    //
    gray:       false,     
    saturation: 0.0,
    whiteBalance:"#ffffff",
    //
    gaussian:   0,
    sharpen:    false,
    edge:       false,
    median:     0,
    bilateral:  0,
    //
    quantize:  quantList[0],
    random:    quantList[0],
    ordered:   quantList[0],
    floyd:     quantList[0],
    //
    scale:     1.0,
    rotate:    0.0,
    swirl:     0.0,
    //    
    paint:     0.0, 
    xDoG:      0.0,
    palette:   paletteList[0],
    // 
    art:       -1, 
};

Gui.propIsStringMenuItem = function( prop ) {
    return ( prop in ['palette', 'quantize', 'random', 'ordered', 'floyd'] );
};

Gui.alertOnce = function( msg ) {
    var mainDiv = document.getElementById('main_div');
    mainDiv.style.opacity = "0.3";
    var alertDiv = document.getElementById('alert_div');
    alertDiv.innerHTML = '<p>'+msg + '</p><button id="ok" onclick="Gui.closeAlert()">ok</button>';  
    alertDiv.style.display = 'inline';  
};

Gui.closeAlert = function () {
    var mainDiv = document.getElementById('main_div');
    mainDiv.style.opacity = "1";
    var alertDiv = document.getElementById('alert_div');
    alertDiv.style.display = 'none';
};

Gui.init = function ( imageChangeCallback, controlsChangeCallback ) {
    // create top level controls
    var gui     = new dat.GUI();
    var image   = gui.add( this.values, 'imageFile', photoList );
    var reset   = gui.add( this.values, 'reset' );
    var exclu   = gui.add( this.values, 'exclusive' );
    var mline   = gui.add( this.values, 'morphLines' );
    mline.onChange(function () {window.open('morphLines.html?initialFile=chang.jpg&finalFile=halber.jpg&marker=images/marker.json')});
   
    // create folders to hold everything else
    var folder0 = gui.addFolder('BATCH MODE');
    var folder1 = gui.addFolder('LUMINANCE OPERATIONS');
    var folder2 = gui.addFolder('COLOR OPERATIONS');
    var folder3 = gui.addFolder('FILTER OPERATIONS');
    var folder4 = gui.addFolder('DITHER OPERATIONS');
    var folder5 = gui.addFolder('RESAMPLING OPERATIONS');
    var folder6 = gui.addFolder('MISCELLANEOUS');

    // batch controls (that open in a new tab) contain slow operations 
    // or operation requires multiple images
    var bc = {};
    // from gui operation to url command page
    var guiToBatch = folder0.add( this.values, 'guiToBatch' );
    // especially for gif example
    var animEx  = folder0.add( this.values, 'brightnessAnim');
    animEx.onChange(function () {window.open('batch.html?imageFile='+ Gui.values.imageFile+'&brightness=(-1:0.2:1:100)')});
    bc.newTab   = folder0.add( this.values, 'newTab', tabList);
    
    // gui controls are added to this object below            
    var gc = {};
    gc.brigh = folder1.add( this.values, 'brightness', -1.0, 1.0 ).step( 0.1 ).setValue( 0.0 );
    gc.contr = folder1.add( this.values, 'contrast',   -1.0, 1.0 ).step( 0.1 ).setValue( 0.0 );
    gc.gamma = folder1.add( this.values, 'gamma',       -2,  2   ).step( 0.5 ).setValue( 0   );
    gc.vigne = folder1.add( this.values, 'vignette',    0.0, 1.0 ).step( 0.1 ).setValue( 0.0 );
    gc.histe = folder1.add( this.values, 'histeq');
    
    gc.gray  = folder2.add( this.values, 'gray' );
    gc.satur = folder2.add( this.values, 'saturation', -1.0, 1.0 ).step( 0.1 ).setValue( 0.0 );
    gc.white = folder2.addColor( this.values, 'whiteBalance' );
    
    gc.gauss = folder3.add( this.values, 'gaussian',      0, 8   ).step(   1 ).setValue( 0   );
    gc.sharp = folder3.add( this.values, 'sharpen' );
    gc.edge  = folder3.add( this.values, 'edge' );
    gc.media = folder3.add( this.values, 'median',        0, 6   ).step(   1 ).setValue( 0   );
    gc.bilat = folder3.add( this.values, 'bilateral',     0, 6   ).step(   1 ).setValue( 0   );

    gc.quant = folder4.add( this.values, 'quantize',   quantList ).setValue( quantList[0] );
    gc.rando = folder4.add( this.values, 'random',     quantList ).setValue( quantList[0] );
    gc.order = folder4.add( this.values, 'ordered',    quantList ).setValue( quantList[0] );
    gc.floyd = folder4.add( this.values, 'floyd',      quantList ).setValue( quantList[0] );

    gc.sampl = folder5.add( this.values, 'sample',     sampleList).setValue(sampleDefault);
    gc.scale = folder5.add( this.values, 'scale',       0.1, 2.0 ).step( 0.1 ).setValue( 1.0 );
    gc.rotat = folder5.add( this.values, 'rotate',     -1.0, 1.0 ).step( 0.01).setValue( 0.0 );
    gc.swirl = folder5.add( this.values, 'swirl',      -1.0, 1.0 ).step( 0.1 ).setValue( 0.0 );
    
    gc.palet = folder6.add( this.values, 'palette',  paletteList );    
    gc.paint = folder6.add( this.values, 'paint',       0.0, 1.0 ).step( 0.1 ).setValue( 0.0 ); 
    gc.xDoG  = folder6.add( this.values, 'xDoG',        0.0, 1.0 ).step( 0.1 ).setValue( 0.0 ); 
    
    var inReset = false;
    var resetGuiValues = function () {
        inReset = true;
        for (var prop in Gui.defaults) {
            var gcname = prop.substring(0, 5);
            var control = gc[gcname];
            if (control !== undefined) {
                control.setValue(Gui.defaults[prop]);    
            }
        }
        
        inReset = false;
    }
 
    // when new image is chosen, reset all the other controls and then call the callback
    var handleImgChange = function ( newImg ) {
        resetGuiValues();
        imageChangeCallback( newImg ); // now make the callback
    };
    
    Gui.oldVals = JSON.parse( JSON.stringify(Gui.values) );
    // check to see if something really changed (for efficiency)
    var handleControlsChange = function () {
        if(inReset) return;
        var guiValsStr = JSON.stringify(Gui.values);
        var oldValsStr = JSON.stringify(Gui.oldVals);
        if ( oldValsStr !== guiValsStr ) {
           if (Gui.values.exclusive) {
                for (var prop in Gui.values) {
                    if ( (prop in Gui.defaults) && Gui.oldVals[prop] !== Gui.values[prop]) {
                        var newVal = Gui.values[prop];
                        resetGuiValues(); // set everything to default
                        Gui.values[prop] = newVal;           
                        break;
                    }
                }
            }
            
            Gui.oldVals = JSON.parse( JSON.stringify(Gui.values) );
            controlsChangeCallback();
        }    
    };
    // REGISTER CALLBACKS FOR WHEN GUI CHANGES:
    
    // when new image is chosen, reset all the other controls and then call the callback
    image.onChange( handleImgChange );

    // when reset is clicked, reset all gui values    
    reset.onChange( function (){resetGuiValues();handleControlsChange();} );

    // setup the callback function for all other gui changes
    for (var prop in gc) { 
        gc[prop].onChange( handleControlsChange );
    } 

    // these set the default values for clicking buttons that open in batch mode
    var tabValues = {
        bilateral: '(6,3)',
        paint:     1,
        xDoG:      1,
        palette:   5,
        art:       1, 
    };

    // opens new browser tab with the batch program in it
    function openBatchInNewTab( prop ) {
        var val = tabValues[prop];
        var url = 'batch.html?imageFile=' + Gui.values.imageFile +'&' + prop + '=' + val;
        window.open(url);
    };
    
    // setup the callback function for batch operations that open a new tab
    bc.newTab.onChange ( function () {
        var prop = Gui.values.newTab;
        Gui.values.newTab = 'none';
        switch ( prop ) {
            case 'none': break;
            case 'swirlAnim':
                window.open('batch.html?imageFile=flower.jpg&swirl=(0:0.2:1)');
                break;
            case 'morphAnim':     
                window.open('batch.html?imageFile=chang.jpg&finalFile=halber.jpg&marker=images/marker.json&morph=(0:0.2:1)');
                break;
            case 'composite': 
                window.open('batch.html?imageFile=man.jpg&foregroundFile=doge.jpg&alphaFile=alpha.png');
                break;
            case 'histMatch': 
                window.open('batch.html?imageFile=flower.jpg&foregroundFile=town.jpg&histMatch=0.5');
                break;
            default:
                openBatchInNewTab( prop ); 
        }
    });

    // for button which creates the corresponding url of current gui
    guiToBatch.onChange( function() {
        var url = 'batch.html?imageFile=' + Gui.values.imageFile;
        if ( Gui.values['sample'] !== sampleDefault ) {
            url += '&sample='+Gui.values['sample'];
        }
        for ( var prop in Gui.defaults ) {
            if( Gui.values[prop] !== undefined && Gui.values[prop] !== Gui.defaults[prop]) {
                url += "&";
                var val = Gui.values[prop];

                if( !isNaN(parseFloat(val)) && val.toString().indexOf('.')>=0 ) {
                    val = val.toFixed(2);
                 }
                url += prop + "=" + val;
            }
        }
        window.open(url);
    } );
 
};


