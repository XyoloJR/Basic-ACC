var PLANE_SIZE = 15;//half icon size
var timeFactor = 1;//possibility to speed up or down
var AUTONOMY = 2000
console.log("timeFactor : x" + timeFactor);
var NmToPx = 10.84;//conversion factor

//Plane Object constructor
function Plane(actualFL, aimedFL, route, isState, name, kts){
    this.actualFL = actualFL;
    this.aimedFL = aimedFL;
    this.animId = 0;
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

getNextPoint = function(position, distance, headingRad){
    var nextX = Math.round(position.x + distance * Math.cos(headingRad));
    var nextY = Math.round(position.y - distance * Math.sin(headingRad));
    return {x: nextX, y: nextY};
}

var planesList= [];
var planeNames= [];
var screenElt = document.getElementById('mainScreen');
var DialogElt = document.getElementById('dialogBox');


var planeOrderForm = document.forms.heading;
var ctrlChangeField = planeOrderForm.firstElementChild;
var ctrlPlaneInput = document.getElementById('ctrlplane');
var ctrlNamesList = document.getElementById('ctrlnames');
var newHeadInput = document.getElementById('newhead');

var newDirectInput = document.getElementById('newdirect');

var nextAnim = [];
planeOrderForm.reset();

//create a Plane and put on screen the corresponding Element
//from the launch form values
var launchElt = document.forms.launch;
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

    var infoBox = document.createElement('div');
    infoBox.classList.add("infoBox", plane.route.defaultDisplay);
    infoBox.appendChild(flightDetailsList(plane));

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
                    plane.warning = !plane.warning;
                    if (plane.warning) {
                        iconElt.style.backgroundImage = "url('../img/warningIcon.png')";
                    } else { iconElt.style.backgroundImage = "url('../img/planeIcon.png')"};
                    break;
                case 2:
                    plane.particular = !plane.particular;
                    if (plane.particular) {
                        iconElt.style.backgroundImage = "url('../img/particularIcon.png')";
                        infoBox.firstChild.children[1].style.backgroundColor= "#E53";
                    } else {
                        iconElt.style.backgroundImage = "url('../img/planeIcon.png')";
                        infoBox.firstChild.children[1].style.backgroundColor= "transparent";
                    }
                    break;
            }

        }
    );

    planeElt.appendChild(iconElt);
    planeElt.appendChild(infoBox);
    plane.elt = planeElt;
    plane.icon = iconElt;
}



//animed or killed
function animPlane(plane){
    plane.updatePosition();
    var anim = plane.route.anims[plane.step]
    plane.setHeading(anim.heading);
    var animTime = msFlightTime(plane.pxSpeed, anim.dist);
    animText = anim.name + " " + animTime + "ms linear forwards";
    plane.elt.style.animation = animText;
    plane.icon.style.transform = "rotate("+ anim.heading +"deg)";
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

planeOrderForm.headingConfirm.addEventListener(
    'click',
    function(event){
        event.preventDefault();
        var plane = getPlane(ctrlPlaneInput.value);
        plane.freeze();
        plane.headingAsked = newHeadInput.valueAsNumber;
        var headingDiff = (plane.headingAsked - plane.heading);
        var turnTime = 0;
        var animTurnText="";
        var endTurnPoint = plane.pos;
        if (headingDiff != 0){
            var turnAngle = Math.abs(headingDiff);
            if (turnAngle > 180){
                headingDiff = Math.sign(headingDiff) * (turnAngle - 360);
                turnAngle = Math.abs(headingDiff);
            }
            var turnTime = Math.round(1000 * turnAngle / 3);
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
        plane.animId +=1;
        plane.anim = setTimeout(
            function(){
                plane.icon.style.transform = "rotate("+ plane.heading % 90 +"deg)";
            }, turnTime
        );
        dial(plane.name + " heading to " + plane.headingAsked + "°", "darkgreen", 3000);
        planeOrderForm.reset();
    }
);


var styleEl = document.createElement('style'),
  styleSheet;
// Append style element to head
document.head.appendChild(styleEl);
// Grab style sheet
styleSheet = styleEl.sheet;

addKeyFrames = function(animName, point){
    var keyFramesText = "@keyframes "+animName +
                "{100%{left:"+point.x+"px; top:"+point.y+"px;}}";
    styleSheet.insertRule(keyFramesText, styleSheet.cssRules.length);
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

var newFlForm = document.forms.fl;
var flChangeField = newFlForm.firstElementChild;
var newFLInput = newFlForm.fl;
var flPlaneInput = newFlForm.planeName;
var fieldElts = [flChangeField, ctrlChangeField];
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
                if (plane.climb < 0 && plane.actualFL < 285){
                    plane.elt.style.display = "none";
                } else {
                    flDiff = plane.aimedFL - plane.actualFL;
                    if (flDiff == 0){
                        clearInterval(plane.climbId);
                        plane.climb = 0;
                        flElt.lastElementChild.src = getFlIcon(0);
                    }
                    flElt.firstChild.textContent = plane.actualFL;
                }
            }, 15000);
    newFlForm.reset();
});

var flNamesList = flChangeField.children['flnames'];
flPlaneInput.addEventListener(
    'click',
    function(event){
        event.stopPropagation();
        flNamesList.style.display = "block";
});

flPlaneInput.addEventListener(
    'keyup',
    function(event){
        event.stopPropagation();
    }
)

ctrlPlaneInput.addEventListener(
    'click',
    function(event){
        event.stopPropagation();
        ctrlNamesList.style.display = "block";
    }
)

document.addEventListener(
    'mousedown',
    function(event){
        if (event.button==1){
            event.preventDefault();
        }
});
screenElt.addEventListener('contextmenu', event => event.preventDefault());

document.addEventListener(
    'click',
    function(event){
        ctrlNamesList.style.display = "none";
        flNamesList.style.display = "none";
    }
)

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
            function(event){
                flPlaneInput.value = plane.name;
                newFLInput.value = plane.actualFL;
        });
        var newEntryCtrl = document.createElement('li');
        newEntryCtrl.textContent = plane.name;
        newEntryCtrl.addEventListener(
            'click',
            function(event){
                ctrlPlaneInput.value = plane.name;
                newHeadInput.value = plane.heading;
                newDirectInput.value = plane.route.pointsList[plane.step+1].name
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
