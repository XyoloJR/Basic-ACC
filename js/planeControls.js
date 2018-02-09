var PLANE_SIZE = 15;//half icon size
var timeFactor = 1;//possibility to speed up or down
var AUTONOMY = 2000
console.log("timeFactor : x" + timeFactor);
var NmToPx = 10.84;//conversion factor

//Plane Object constructor
function Plane(actualFL, aimedFL, route, isState, name, kts){
    this.actualFL = actualFL;
    this.aimedFL = aimedFL;
    this.exitPoint = route.exit.point;
    if (route == UM4){
        this.exitSector = "I" + (actualFL > 365 ? 3 : 2);
    } else {
        this.exitSector = route.exit.sector;
    }
    this.isState = isState;
    this.name = name.toUpperCase();
    this.route = route;
    this.kts = kts;
    this.pxSpeed = kts * NmToPx / 3600;
    this.step = 0;
    this.updateClimb = function(){
        var flDiff = this.aimedFL - this.actualFL;
        this.climb = flDiff == 0 ? 0 : (flDiff)/Math.abs(flDiff);
    }
    this.updatePosition = function(){
        this.pos = {x:this.route.pointsList[this.step].x,
                    y:this.route.pointsList[this.step].y};
        this.elt.style.left = this.pos.x + "px";
        this.elt.style.top = this.pos.y + "px";
    }
    this.setScreenPos = function(xPx,yPx){
        this.elt.style.left = xPx;
        this.elt.style.top = yPx;
        this.pos = {x: parseFloat(xPx), y: parseFloat(yPx)};
    }
    this.updateTurn = function(){
        this.turn = this.headingAsked - this.heading;
    }
    this.updateClimb();
}

var planesList= [];
var planeNames=[];
var screenElt = document.getElementById('mainScreen');
var DialogElt = document.getElementById('dialogBox');
var launchElt = document.getElementById('launch');
var newFlForm = document.getElementById('fl');
var flChangeField = newFlForm.firstElementChild;
var newFLInput = document.getElementById('newfl');
var flPlaneInput = document.getElementById('flplane');
var flNamesList = document.getElementById('flnames');
var planeOrderForm = document.getElementById('heading')
var ctrlChangeField = planeOrderForm.firstElementChild;
var ctrlPlaneInput = document.getElementById('ctrlplane');
var ctrlNamesList = document.getElementById('ctrlnames');
var newHeadInput = document.getElementById('newhead');
var newDirectInput = document.getElementById('newdirect');
var fieldElts = [flChangeField, ctrlChangeField];
var nextAnim = [];

//create a Plane and put on screen the corresponding Element
//from the launch form values
launchElt.addEventListener(
    'submit',
    function (event){
        event.preventDefault();
        nameGiven = launchElt["name"].value.toUpperCase();
        if (!(planeNames.indexOf(nameGiven)<0)){
            dial("!!!---AVION DEJA EN VOL---!!!", "darkred",2000)
        } else {
            var plane = new Plane(
                launchElt["fl"].valueAsNumber,
                launchElt["fl"].valueAsNumber,
                ROUTES[launchElt["route"].selectedIndex],
                launchElt["state"].checked,
                nameGiven,
                launchElt["kts"].valueAsNumber,
            );
            createPlaneElt(plane);
            animPlane(plane);
            screenElt.appendChild(plane.elt);
            dial(plane.name + " on air", "darkgreen", 3000)
        }
});

//return a new animated planeElt
function createPlaneElt(plane){
    var planeId = -1;
    updateLists(plane, planeId);

    var planeElt = document.createElement('div');
    planeElt.id = plane.name;
    planeElt.setAttribute("class", "plane");

    var iconElt = document.createElement('div');
    iconElt.setAttribute("class", "planeIcon");

    var infoBox = document.createElement('div');
    infoBox.setAttribute("class", "infoBox");
    infoBox.appendChild(flightDetailsList(plane));

    planeElt.appendChild(iconElt);
    planeElt.appendChild(infoBox);
    plane.elt = planeElt;
    plane.icon = iconElt;
}

//animed or killed
function animPlane(plane){
    plane.updatePosition();
    var anim = plane.route.anims[plane.step]
    plane.heading = anim.heading;
    plane.radH = Math.PI * (90 - anim.heading)/ 180;
    var animTime = msFlightTime(plane.pxSpeed, anim.dist);
    animText = anim.name + " " + animTime + "ms linear forwards";
    plane.elt.style.animation = animText;
    plane.icon.style.transform = "rotate("+ anim.angle +")";
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

planeOrderForm.addEventListener(
    'submit',
    function(event){
        event.preventDefault();
        plane = getPlane(ctrlPlaneInput.value);
        actualPosition=window.getComputedStyle(plane.elt);
        var left = actualPosition.getPropertyValue('left');
        var top = actualPosition.getPropertyValue('top');
        console.log(left, top);
        plane.setScreenPos(left, top);
        clearTimeout(plane.anim);
        plane.elt.style.animation = "";
        plane.headingAsked = newHeadInput.valueAsNumber;
        console.log(plane.pos);
        turn(plane);
    }
);

function turn(plane){
    plane.updateTurn();
    console.log(plane);
    if (plane.turn == 0){
        //goStraight(plane);
        console.log(plane.pos);
        var nextX = Math.round(plane.pos.x + AUTONOMY * Math.cos(plane.radH));
        var nextY = Math.round(plane.pos.y - AUTONOMY * Math.sin(plane.radH));
        var endPoint={x: nextX, y: nextY};
        console.log(endPoint);
        var animName = "direct" + plane.name + " ";
        var animTime = msFlightTime(plane.pxSpeed, pxDist(plane.pos, endPoint));
        addKeyFrames(animName, endPoint);
        var animText = animName + animTime + "ms linear forwards";
        plane.elt.style.animation = animText
        console.log(animText);
    } else {
        console.log(plane.pos);
        console.log("cap actuel", plane.radH);
        var curveAngle = plane.headingAsked - plane.heading;
        console.log("variation de cap", curveAngle);
        var halfRadDiff = curveAngle * Math.PI/360;
        console.log("demi angle radian", halfRadDiff);
        var curveRay = plane.pxSpeed * 60 / Math.PI;
        console.log("rayon de courbue", curveRay);
        var chord = 2 * curveRay * Math.abs(Math.sin(halfRadDiff));
        console.log("taille de la corde", chord);
        plane.radH -= halfRadDiff;
        console.log("cap artificiel de virage", plane.radH);
        var nextX = Math.round(plane.pos.x + chord * Math.cos(plane.radH));
        var nextY = Math.round(plane.pos.y - chord * Math.sin(plane.radH));
        var endTurnPoint={x: nextX, y: nextY};
        var animTurnName = "turn" + plane.name + " ";
        addKeyFrames(animTurnName, endTurnPoint);
        console.log(endTurnPoint);
        var arcSize = 2 * curveRay * Math.abs(halfRadDiff)
        var animTime = msFlightTime(plane.pxSpeed, arcSize);
        var animText = animTurnName + animTime + "ms linear forwards";
        plane.elt.style.animation = animText
        setTimeout(function(){
            plane.heading = plane.headingAsked;
            plane.radH -= halfRadDiff;
            plane.setScreenPos(endTurnPoint.x + "px", endTurnPoint.y + "px");
            turn(plane);
        },animTime);
        console.log(animText);
    }
}
var styleEl = document.createElement('style'),
  styleSheet;
// Append style element to head
document.head.appendChild(styleEl);
// Grab style sheet
styleSheet = styleEl.sheet;

addKeyFrames = function(animName, point){
    var keyFramesText = "@keyframes "+animName +
                "{100%{left:"+point.x+"px; top:"+point.y+"px;}}";
    console.log(keyFramesText);
    styleSheet.insertRule(keyFramesText, styleSheet.cssRules.length);
}

function updateLists(plane, planeId){
    var flNamesList = document.getElementById('flnames');
    var ctrlNamesList = document.getElementById('ctrlnames');
    if (planeId<0){
        if (planesList.length == 0){
            disenableElts(fieldElts);
        }
        planesList.push(plane);
        planeNames.push(plane.name);
        var newEntryFL = document.createElement('li');
        newEntryFL.textContent = plane.name;
        newEntryFL.addEventListener(
            'click',
            function(){
                flPlaneInput.value = plane.name;
                if (newFLInput.value == 0){
                newFLInput.value = plane.actualFL;
            }
        });
        var newEntryCtrl = document.createElement('li');
        newEntryCtrl.textContent = plane.name;
        newEntryCtrl.addEventListener(
            'click',
            function(){
                ctrlPlaneInput.value = plane.name;
                newHeadInput.value = plane.heading;
            }
        )
        flNamesList.appendChild(newEntryFL);
        ctrlNamesList.appendChild(newEntryCtrl);
    } else {
        planeNames.splice(planeId, 1);
        planesList.splice(planeId, 1);
        flNamesList.removeChild(flNamesList.children[planeId]);
        ctrlNamesList.removeChild(ctrlNamesList.children[planeId]);
        if (flNamesList.childElementCount == 0){
            disenableElts(fieldElts);
        }
    }
}

function disenableElts(Elts){
    if (Elts[0].hasAttribute("disabled")){
        Elts.forEach(function(Elt){Elt.removeAttribute("disabled");});
    } else {
        Elts.forEach(function(Elt){Elt.setAttribute("disabled", "disabled");});
    }
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
    nameElt.appendChild(document.createTextNode(plane.name));
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
    return infosElt;
}

function planeCrash(plane){
    var planeId = planeNames.indexOf(plane.name);
    updateLists(plane, planeId);
    screenElt.removeChild(document.getElementById(plane.name));
}

function msFlightTime(pxPerSec, distPx){
    return Math.round(1000 * distPx / (pxPerSec * timeFactor));
}

function dial(message, color, msTime){
    DialogElt.textContent = message;
    DialogElt.style.color = color;
    setTimeout(function(){
                    DialogElt.textContent = "Status ok";
                    DialogElt.style.color = "black";
                }, msTime
    );
}

function getPlane(planeName){
    return planesList[planeNames.indexOf(planeName)]
}

function getFlIcon(climb){
    if (climb == 0){
        return "../img/stableIcon.png"
    } else if (climb > 0) {
        return "../img/upIcon.png"
    } else {
        return "../img/downIcon.png";
    }
}

newFlForm.addEventListener(
    'submit',
    function(event){
        event.preventDefault();
        var plane = getPlane(flPlaneInput.value);
        var flElt = document.getElementById(plane.name +"fl");
        plane.aimedFL = newFLInput.valueAsNumber;
        plane.updateClimb();
        if (plane.climb !=0) {
            var upOrDown = plane.climb > 0 ? " climb" : " descend";
            dial(plane.name + upOrDown + "ing to FL"+ plane.aimedFL, "darkgreen", 4000);
        }
        flElt.lastElementChild.src = getFlIcon(plane.climb);
        plane.climbId = setInterval(
            function(){
                plane.actualFL += 5 * plane.climb;
                flDiff = plane.aimedFL - plane.actualFL;
                if (flDiff == 0){
                    clearInterval(plane.climbId);
                    plane.climb = 0;
                    flElt.lastElementChild.src = getFlIcon(0);
                }
                flElt.firstChild.textContent = plane.actualFL;
            }, 15000);
});

flPlaneInput.addEventListener(
    'click',
    function(event){
        event.preventDefault();
        event.stopPropagation();
        flNamesList.style.display = "block";
});

flPlaneInput.addEventListener(
    'keyup',
    function(event){
        event.preventDefault();
        event.stopPropagation();
        console.log(event.key);
    }
)

ctrlPlaneInput.addEventListener(
    'click',
    function(event){
        event.preventDefault();
        event.stopPropagation();
        ctrlNamesList.style.display = "block";
    }
)

document.addEventListener(
    'click',
    function(event){
        ctrlNamesList.style.display = "none";
        flNamesList.style.display = "none";
});
