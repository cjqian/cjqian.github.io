function setup() {
    height = 800;
    width = 1200;
    createCanvas(width, height);
    // Create object
    minCard = 1;
    maxCard = 52;

    prevdecks = [];
    previdx = 0;

    deck = [];
    idx = 0;

    for (i = minCard; i <= maxCard; i++){
        deck[idx++] = loadImage("cards/" + i + ".png");
    }

    img = deck[idx++];
    cur = new Card();
}

function draw() {
    background(0, 100, 0);
    if (!cur.isDead()){
        cur.move();
        cur.display();
    }
    //} else {
        //prevdecks[previdx++] = cur.locations.slice();
        //img = deck[idx++];
        //cur = new Car();
    //}

    //displayPrev();
}

//function displayPrev() {
    //for (i = 0; i < prevdecks.length; i++){
        //for (j = 0; j < prevdecks[i].length; j++){
            //image(img, prevdecks[i][j].x, prevdecks[i][j].y);
        //}
    //}
//}

function Card() {
    this.locations = [];
    this.idx = 0;

    //negative, positive
    xFactor = random();

    xLoc = 0;
    if (xFactor < .5){
        xFactor = -1;
        //xLoc = random(width/2, width);    
    } else {
        xFactor = 1;
        //xLoc = random(0, width/2);
    }
    this.position = createVector(random(width), random(0, height/4));
    this.acceleration = createVector(0, .3);

    this.velocity = createVector(xFactor * random(2, 4), 0);

    this.isDead = function() {
        if (this.position.x < 0 ||
            this.position.x > width) {
            return true;
        }

        return false;
    }

    this.move = function() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.lifespan -= 1;
        if (this.position.y >= height) {
            this.velocity.y = this.velocity.y * -1;
        }

        this.locations[this.idx++] = this.position.copy();

    };

    this.display = function() {
        for (i = 0; i < this.locations.length; i++){
            console.log(this.locations[i]);
            image(img, this.locations[i].x, this.locations[i].y);
        }
        //ellipse(this.position.x, thOis.position.y, this.diameter, this.diameter);
    }
};
