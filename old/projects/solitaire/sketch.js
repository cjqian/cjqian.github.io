var canvas;
//var sourceCanvas;
//var sourceContext;

function setup() {
    height = 400;
    width = 800;

    //sourceCanvas = document.getElementById("imgCanvas");
    //sourceContext = sourceCanvas.getContext('2d');

    canvas = createCanvas(width, height);
    canvas.parent('cards');

    // min card is king of spades, max is ace of spades
    // refers to name in cards directory
    minCard = 1;
    maxCard = 52;

    // intializes previous images
    prevlocs = [];
    prevdecks = [];
    previdx = 0;

    //img = loadImage("cards/" + 1 + ".png");
    deck = [];
    idx = 0;

    //iterates through each image and loads
    for (i = minCard; i <= maxCard; i++){
        imgString = "cards/" + i + ".png";
        deck[idx++] = loadImage(imgString);
    }

    //initializes first card
    idx = 0;
    img = deck[idx++];
    cur = new Card();
}

//function copyCanvas() {
    //sourceContext.drawImage(canvas, 0, 0);
//}

function draw() {
    //background(0, 100, 0);

    displayPrev();

    if (cur.isDead()){
        //add location array and card to previous decks
        prevlocs[previdx] = cur.locations.slice();
        prevdecks[previdx++] = img;

        //copyCanvas();

        //update new card and image
        img = deck[idx++];
        cur = new Card();
    }

    cur.move();
    cur.display();
}

//display all cards rendered previously
function displayPrev() {
    //iterates through array of previous cards
    for (i = 0; i < prevlocs.length; i++){
        //print each card in its previous location
        for (j = 0; j < prevlocs[i].length; j++){
            image(prevdecks[i], prevlocs[i][j].x, prevlocs[i][j].y);
        }
    }
}

function Card() {
    this.locations = [];
    this.idx = 0;

    //negative, positive
    xFactor = random();

    //if spawn left, move right; else, move left
    xLoc = 0;
    if (xFactor < .5){
        xFactor = -1;
        xLoc = random(width/2, width);    
    } else {
        xFactor = 1;
        xLoc = random(0, width/2);
    }

    //random height at top eight of canvas
    this.position = createVector(xLoc, random(0, height/8));
    //initial speed left or right times vector xFactor
    this.velocity = createVector(xFactor * random(2, 6), 0);
    //initial acceleration in the y-direction
    this.acceleration = createVector(0, random(.25, 1));


    this.isDead = function() {
        if (this.position.x < -100 ||
                this.position.x > width + 100) {
                    return true;
                }

        return false;
    }

    this.move = function() {
        //update speed and position
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);

        //bounce back if has hit bottom of canvas
        if (this.position.y >= height - 1) {
            this.velocity.y = this.velocity.y * -1;
        }

        //add to list of locations for card
        this.locations[this.idx++] = this.position.copy();
    };

    this.display = function() {
        //display all positions for card up to now
        for (i = 0; i < this.locations.length; i++){
            image(img, this.locations[i].x, this.locations[i].y);
        }
    }
};
