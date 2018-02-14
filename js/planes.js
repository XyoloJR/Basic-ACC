var PLANE_SIZE = 7;//half icon size
var timeFactor = 1;//possibility to speed up or down
var AUTONOMY = 500;
var SPEEDVECTORWIDTH = 3;
console.log("timeFactor : x" + timeFactor);
var NmToPx = 5.08;//conversion factor

//Plane Object constructor
function Plane(actualFL, aimedFL, route, isState, name, kts){
    this.actualFL = actualFL;
    this.aimedFL = aimedFL;
    this.animId = 0;
    this.autopilot = true;
    this.exitPoint = route.exit.point;
    if (route == UM4){
        this.exitSector = "I" + (actualFL > 365 ? 3 : 2);
    } else {
        this.exitSector = route.exit.sector;
    }
    this.elt;
    this.isState = isState;
    this.name = name.toUpperCase();
    this.particular = false;
    this.route = route;
    this.kts = kts;
    this.pxSpeed = kts * NmToPx / 3600;
    this.step = 0;
    this.vector;
    this.vectorSize = 0;
    this.vectorDisp = false;
    this.warning = false;

    this.changeDisplay = function(){
        var infoBoxClass = this.elt.children[1].classList;
        var newClass = 'left';
        switch (infoBoxClass[1]){
            case 'left':
                newClass = 'top';
                break;
            case 'top':
                newClass = 'right';
                break;
            case 'right':
                newClass = 'bottom';
                break;
        }
        infoBoxClass.replace(infoBoxClass[1], newClass)
    }
    this.displayVector = function(minutes){
        this.removeVector();
        this.vectorSize = minutes;
        var color = "rgb(255, 255, 255)";
        if (this.warning){
            var color = "darkorange";
        }
        var endLine = getNextPoint({x:0,y:0}, this.pxSpeed * 60 * minutes, this.headingRad);
        var vector = createVector({x:0,y:0}, endLine, color, SPEEDVECTORWIDTH);
        vector.id = this.name + 'vect';
        this.vector = vector;
        this.elt.appendChild(this.vector);
    }
    this.removeVector = function(){
        if (this.vector){
            this.elt.removeChild(this.vector);
            this.vector = 0;
            this.vectorSize = 0;
        }
    }
    this.getPosition = function(){
        var currentStyle=window.getComputedStyle(this.elt);
        var left = currentStyle.getPropertyValue('left');
        var top = currentStyle.getPropertyValue('top');
        return {x: parseFloat(left), y: parseFloat(top)};
    }

    this.freeze = function(){//returns current coordinates
        var currentStyle=window.getComputedStyle(this.elt);
        var left = currentStyle.getPropertyValue('left');
        var top = currentStyle.getPropertyValue('top');
        clearTimeout(this.anim);
        this.elt.style.animation = "";
        this.elt.style.left = left;
        this.elt.style.top = top;
        this.pos = {x: parseFloat(left), y: parseFloat(top)};
    }
    this.setWarning = function(){
        var iconName = this.warning ? "plane" : "warning";
        this.warning = !this.warning;
        if (this.warning){
            var diamond = document.createElement('img');
            diamond.src = "../img/warningLabel.png";
            diamond.style.marginLeft = "4px";
            this.label.appendChild(diamond);
            this.displayVector(Math.max(3,this.vectorSize));
        } else{
            this.label.removeChild(this.label.lastChild);
            if (this.vectorDisp){
                this.displayVector(this.vectorSize);
            } else {
                this.removeVector();
            }
        }
        this.icon.style.backgroundImage = "url('../img/"+ iconName+"Icon.png')";
    }
    this.updateClimb = function(){
        var flDiff = this.aimedFL - this.actualFL;
        this.climb = flDiff == 0 ? 0 : (flDiff)/Math.abs(flDiff);
    }
    this.updateClimb();

    this.updatePosition = function(){
        this.pos = {x:this.route.pointsList[this.step].x,
                    y:this.route.pointsList[this.step].y};
        this.elt.style.left = this.pos.x + "px";
        this.elt.style.top = this.pos.y + "px";
    }
    this.addHeading = function(angle){
        var newHeading = (this.heading + angle - 1)% 360 + 1
        this.heading = newHeading > 0 ? newHeading : 360 + newHeading;
        this.headingRad -= Math.PI * angle / 180;
    }
    this.setHeading = function(heading){
        this.heading = heading;
        this.headingRad = Math.PI * (90 - heading)/ 180;
    }
    this.setScreenPos = function(xPx,yPx){
        this.elt.style.left = xPx;
        this.elt.style.top = yPx;
        this.pos = {x: parseFloat(xPx), y: parseFloat(yPx)};
    }
    this.updateTurn = function(){
        this.turn = this.headingAsked - this.heading;
    }

}

function msFlightTime(pxPerSec, distPx){
    return Math.round(1000 * distPx / (pxPerSec * timeFactor));
}

//animate or kill
function animPlane(plane){
    var anim = plane.route.anims[plane.step]
    if (plane.autopilot){
        plane.updatePosition();
        plane.setHeading(anim.heading);
        var distance = anim.dist
    } else {
        var endPoint = plane.route.pointsList[plane.step + 1]
        distance = pxDist(plane.pos, endPoint);
        plane.heading = getHeadingTo(plane.pos, endPoint);
        console.log(plane.heading);
        plane.autopilot = true;
    }
    var animTime = msFlightTime(plane.pxSpeed, distance);
    animText = anim.name + " " + animTime + "ms linear forwards";
    plane.elt.style.animation = animText;
    plane.icon.style.transform = "rotate("+ plane.heading % 90 +"deg)";

    plane.anim = setTimeout(
        function(){
            plane.step ++;
            if (plane.step == plane.route.anims.length){
                planeCrash(plane);
            } else {
                animPlane(plane);
            }
        }, animTime
    );
}

getHeadingTo = function(currentPoint, aimedPoint){
    var rad = Math.atan2(currentPoint.y - aimedPoint.y,
                         aimedPoint.x- currentPoint.x);
    var deg = Math.round(90 - rad * 180 / Math.PI);
    return deg > 0 ? deg : 360 + deg;
}

climbTo = function(plane, newFl){
    clearInterval(plane.climbId);
    plane.aimedFL = newFl;
    var flElt = document.getElementById(plane.name + "fl");
    var flDiff = plane.aimedFL - plane.actualFL;
    plane.climb = flDiff == 0 ? 0 : flDiff/Math.abs(flDiff);//0 or +-1
    flElt.lastElementChild.src = getFlIcon(plane.climb);
    plane.climbId = setInterval(
        function(){
            plane.actualFL += (plane.climb * 5);
            flDiff = plane.aimedFL - plane.actualFL;
            if (flDiff == 0){
                clearInterval(plane.climbId);
                flElt.lastElementChild.src = getFlIcon(0);
            }
            flElt.firstChild.textContent = plane.actualFL;
            if (plane.climb < 0 && plane.actualFL < 285){
                plane.elt.style.display = "none";
            } else if (plane.actualFL == 285){
                plane.elt.style.display = "block";
            }
        }, 15000
    );
    if (plane.climb !=0) {
        var upOrDown = plane.climb > 0 ? " climb" : " descend";
        return plane.name + upOrDown + "ing to FL"+ plane.aimedFL;
    } else {
        return "no change";
    }
}

turnTo = function(plane, newHeading) {
    var headingDiff = (newHeading - plane.heading);
    var turnTime = 0;
    var animTurnText="";
    var endTurnPoint = plane.pos;
    if (headingDiff != 0){
        var turnAngle = Math.abs(headingDiff);
        if (turnAngle > 180){
            headingDiff = Math.sign(headingDiff) * (turnAngle - 360);
        }
        var turnTime = Math.round(1000 * Math.abs(headingDiff) / 3);
        var halfRadDiff = headingDiff * Math.PI/360;
        var chord = 2 * (plane.pxSpeed * 60 / Math.PI) * Math.abs(Math.sin(halfRadDiff));
        plane.addHeading(headingDiff/2);
        endTurnPoint = getNextPoint(plane.pos, chord, plane.headingRad);
        var animTurnName = "turn" + plane.animId + plane.name + " ";
        addKeyFrames(animTurnName, endTurnPoint);
        animTurnText = animTurnName + turnTime + "ms linear forwards, ";
        plane.icon.style.transform = "rotate("+ plane.heading % 90 +"deg)";
    }
    plane.addHeading(headingDiff/2);
    var finalPoint = getNextPoint(endTurnPoint, AUTONOMY, plane.headingRad);
    var animName = "direct" + plane.animId + plane.name + " ";
    var animTime = msFlightTime(plane.pxSpeed, pxDist(endTurnPoint, finalPoint));
    addKeyFrames(animName, finalPoint);
    animTurnText += animName + animTime + "ms linear "+ turnTime +"ms forwards";
    plane.elt.style.animation = animTurnText;
    plane.animId ++;
    if (plane.autopilot){
        plane.step ++;
        plane.autopilot = false;
    }
    plane.anim = setTimeout(
        function(){
            plane.icon.style.transform = "rotate("+ plane.heading % 90 +"deg)";
        }, turnTime
    );
    return plane.name + " heading to " + newHeading + "°";
}

getNextPoint = function(position, distance, headingRad){
    var nextX = Math.round(position.x + distance * Math.cos(headingRad));
    var nextY = Math.round(position.y - distance * Math.sin(headingRad));
    return {x: nextX, y: nextY};
}
getFlIcon = function(climb){
    if (climb == 0){
        return "../img/stableIcon.png"
    } else if (climb > 0) {
        return "../img/upIcon.png"
    } else {
        return "../img/downIcon.png";
    }
}

var styleEl = document.createElement('style'),
  styleSheet;
document.head.appendChild(styleEl);// Append style element to head
styleSheet = styleEl.sheet;// Grab style sheet
addKeyFrames = function(animName, point){
    var keyFramesText = "@keyframes "+animName +
                "{100%{left:"+point.x+"px; top:"+point.y+"px;}}";
    styleSheet.insertRule(keyFramesText, styleSheet.cssRules.length);
}
//return a new animated planeElt
function createPlaneElt(plane){
    var planeElt = document.createElement('div');
    planeElt.id = plane.name;
    planeElt.setAttribute("class", "plane");

    var iconElt = document.createElement('div');
    iconElt.classList.add("planeIcon");
    iconElt.addEventListener(
        'mousedown',
        function(event){
            event.preventDefault();
            switch (event.button){
                case 0 :
                    plane.changeDisplay();
                    break;
                case 1 :
                    plane.setWarning();
                    break;
            }
        }
    );
    var infoBox = document.createElement('div');
    infoBox.classList.add("infoBox", plane.route.defaultDisplay);
    infoBox.appendChild(flightDetailsList(plane));

    planeElt.appendChild(iconElt);
    planeElt.appendChild(infoBox);
    plane.elt = planeElt;
    plane.icon = iconElt;
}

//return displayed infos of a plane as ListeElement
function flightDetailsList(plane){
    var infosElt = document.createElement('ul');
    var speedElt = document.createElement('li');
    speedElt.appendChild(document.createTextNode(plane.kts/10));
    if (plane.isState){
        var noWNotif = document.createElement('span');
        noWNotif.setAttribute("class", "now");
        noWNotif.textContent = " noW";
        speedElt.appendChild(noWNotif);
    }
    infosElt.appendChild(speedElt);

    var nameElt = document.createElement('li');
    nameElt.id = plane.name+"name";
    nameElt.appendChild(document.createTextNode(plane.name));
    nameElt.addEventListener(
        'mousedown',
        function(event){
            event.preventDefault();
            if (event.button == 1){
                iconStyle = plane.elt.firstChild.style;
                callsignStyle = plane.elt.lastChild.firstChild.children[1].style;
                plane.particular = !plane.particular;
                if (plane.particular) {
                    iconStyle.backgroundImage = "url('../img/particularIcon.png')";
                    callsignStyle.backgroundColor= "#E53";
                } else {
                    iconStyle.backgroundImage = "url('../img/planeIcon.png')";
                    callsignStyle.backgroundColor= "transparent";
                }
            }
    });
    infosElt.appendChild(nameElt);

    var flElt = document.createElement('li');
    flElt.id = plane.name + "fl";
    flElt.appendChild(document.createTextNode(plane.actualFL));
    var flIcon = document.createElement('img');
    flIcon.src = getFlIcon(plane.climb);
    flElt.appendChild(flIcon);
    infosElt.appendChild(flElt);

    var exitElt = document.createElement('li');
    exitElt.appendChild(document.createTextNode(plane.exitPoint +" "));
    var sector = document.createElement('span');
    sector.className = "exitSectorOff";
    sector.textContent = plane.exitSector;
    setTimeout(function(){
                    sector.className ="exitSectorOn";
                }, msFlightTime(plane.pxSpeed, plane.route.halfWay));
    exitElt.appendChild(sector);
    infosElt.appendChild(exitElt);
    plane.label = nameElt;
    return infosElt;
}

createVector = function(startPoint, endPoint, color, weight){
    var diffX = endPoint.x - startPoint.x;
    var diffY = endPoint.y - startPoint.y;
    var width = Math.abs(diffX);
    var height = Math.abs(diffY);
    var vector = document.createElement("canvas");
    vector.className= 'vector';
    vector.setAttribute("width", Math.max(width, weight) + "px");
    vector.setAttribute("height", Math.max(height, weight) + "px");
    var context = vector.getContext("2d");
    context.strokeStyle = color;
    context.lineWidth = weight;
    vector.style.left = startPoint.x + "px";
    vector.style.top = startPoint.y + "px";
    if (diffX < 0) {
        vector.style.left = endPoint.x + "px";
    }
    if (diffY < 0){
        vector.style.top = endPoint.y + "px";
    }
    if (diffY * diffX > 0){
        context.moveTo(0,0);
        context.lineTo(width, height);
    } else {
        context.moveTo(width,0);
        context.lineTo(0, height);
    }
    context.stroke();
    return vector;
}
