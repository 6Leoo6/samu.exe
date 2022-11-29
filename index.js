var backgroundImg;

var samu;
var samuSize = 0.2
var samuShiftY = 150
var samuPosX = 0
var samuPosY;
var samuMaxSpeed = 10

var item;
var itemSize = 0.05
var spawnRate = 0.5
var items = {};
var itemMinSpeed = 2
var itemMaxSpeed = 10
var timeUntilSpawn = 1000/spawnRate

var canvasWidth = 1000;
var canvasHeight = 600;

var level = 1
var minScore = 10
var numberOfItems = 0
var numberOfDestroyedItems = 0
var failed = false
var finalTextDrawn = false

var alphaValue = 0


function preload() {
    samu = loadImage('assets/samu.jpg')
    item = loadImage(`assets/lvl${level}/item.jpg`)
    backgroundImg = loadImage(`assets/lvl${level}/background.jpg`)
    samuPosY = (canvasHeight/2)-(samu.height*samuSize/2)+samuShiftY
}

function setup() {
    createCanvas(canvasWidth, canvasHeight)
    frameRate(60)
    noStroke()
}

function draw() {
    if (failed) {
        if (alphaValue < 50) {
            fill(166, 166, 166, alphaValue)
            rect(0, 0, canvasWidth, canvasHeight)
            alphaValue++
        }
        else if (!finalTextDrawn) {
            finalTextDrawn = true
            fill(0)
            textSize(50)
            text(`Your final score is ${numberOfDestroyedItems}`, 280, canvasHeight/2)
            textSize(30)
            var highscore = JSON.parse(localStorage.getItem('h'))
            if(!highscore) {
                highscore = 0
            }
            text(`Your highscore is ${highscore}`, 370, canvasHeight/2+50)
            if (highscore<numberOfDestroyedItems) {
                localStorage.setItem('h', numberOfDestroyedItems.toString())
            }     
        }
        return
    }
    var bgW = abs((backgroundImg.width-canvasWidth)/2)
    var bgH = abs((backgroundImg.height-canvasHeight)/2)

    image(backgroundImg, 0, 0, canvasWidth, canvasHeight, bgW, bgH, canvasWidth, canvasHeight)


    var mX = max(min(1000-samu.width*samuSize/2, mouseX), 0+samu.width*samuSize/2)
    if(mX !== samuPosX) {
        var d = mX-samuPosX
        
        moveOnX = min(abs(d), samuMaxSpeed)
        if(abs(d-moveOnX) > abs(d+moveOnX)) {
            samuPosX -= moveOnX
        } else {
            samuPosX += moveOnX
        }
    }

    image(samu, samuPosX-samu.width*samuSize/2, samuPosY, samu.width*samuSize, samu.height*samuSize)


    timeUntilSpawn -= deltaTime
    if(timeUntilSpawn <= 0) {
        spawnItem()
        timeUntilSpawn = 1000/spawnRate
    }

    for (const [name, data] of Object.entries(items)) {
        items[name]['y'] += data['speed']
        if (checkCollision(item.width*itemSize, item.height*itemSize, data['x'], items[name]['y'])) {
            numberOfDestroyedItems++
            delete items[name]
            continue
        }

        if (items[name]['y'] > canvasHeight) {
            failed = true
        }

        image(item, data['x'], items[name]['y'], item.width*itemSize, item.height*itemSize)
    }

    textSize(30)
    text(`Score: ${numberOfDestroyedItems}`, canvasWidth-180, 30)
}

function spawnItem() {
    var halfItem = item.width*itemSize/2
    var itemPosX = round(random(0+halfItem, canvasWidth-halfItem))
    var itemSpeed = round(random(itemMinSpeed, itemMaxSpeed))

    items[`item${numberOfItems}`] = {'x': itemPosX, 'speed': itemSpeed, 'y': -100}

    numberOfItems++
}


function checkCollision(w, h, x, y) {
    var smX = samuPosX-samu.width*samuSize/2

    var inXRange = (x < smX && x+w > smX) || (x > smX && x < smX+samu.width*samuSize)
    var inYRange = (y < samuPosY && y+h > samuPosY) || (y > samuPosY && y < samuPosY+samu.height*samuSize)

    return inXRange && inYRange
}

function checkButtonClick(x, y, w, h) {
    var inXRange = x < mouseX && x+w > mouseX
    var inYRange = (y < mouseY && y+h > mouseY)
    return inXRange && inYRange
}

function mouseClicked() {
    checkButtonClick()
}