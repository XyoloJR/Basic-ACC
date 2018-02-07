var PLANE_SIZE = 15;//half icon size
var timeFactor = 1;//possibility to speed up or down
console.log("timeFactor : x" + timeFactor);

//Plane Object constructor
function Plane(name, route, actualFL, aimedFL, speed, isState){
    this.name = name;
    this.isState = isState
    this.route = route;
    this.actualFL = actualFL;
    this.aimedFL = aimedFL;
    var flDiff = aimedFL - actualFL;
    if (flDiff == 0){
        this.climb = 0
    } else {
        this.climb = aimedFL - actualFL > 0 ? 1 : -1;
    }
    this.speed = speed;
    this.nextPoint = route.passPoints[0];
    this.startPoint = route.startPoint;
    this.exitPoint = route.exit.point
    if (route == UM4){
        this.exitSector = "I" + (actualFL > 365 ? 3 : 2);
    } else {
        this.exitSector = route.exit.sector
    }
}

var planesList= [];
var planeNames=[];
var screenElt = document.getElementById('mainScreen');
var DialogElt = document.getElementById('dialogBox');
var launchElt = document.getElementById('launch');
launchElt.addEventListener('submit',goOnAir);
//create a Plane and put on screen the corresponding Element
//from the launch form values
function goOnAir(event){
    event.preventDefault();
    nameGiven = launchElt["name"].value
    if (!(planeNames.indexOf(nameGiven)<0)){
        DialogElt.textContent = "!!!---AVION DEJA EN VOL---!!!";
        DialogElt.style.color = "darkred";
        setTimeout(function(){
                        DialogElt.textContent = "Status ok";
                        DialogElt.style.color = "black";
                    }, 5000
        );
    } else {
        var plane = new Plane(
            nameGiven,
            ROUTES[launchElt["route"].selectedIndex],
            launchElt["fl"].valueAsNumber,
            launchElt["fl"].valueAsNumber,
            launchElt["speed"].valueAsNumber,
            launchElt["state"].checked
        );
        var planeElt = createPlaneElt(plane, plane.startPoint);
        screenElt.appendChild(planeElt);
    }
}

function createPlaneElt(plane, position){
    planesList.push(plane);
    plane.id = planeNames.push(plane.name) - 1;
    console.log(planeNames);
    var planeElt = document.createElement('div');
    planeElt.id = plane.name;
    planeElt.setAttribute("class", "plane");
    planeElt.style.left = position.x + "px";
    planeElt.style.top = position.y + "px";

    var iconElt = document.createElement('div');
    iconElt.setAttribute("class", "planeIcon");

    var infoBox = document.createElement('div');
    infoBox.setAttribute("class", "infoBox");
    infoBox.appendChild(flightDetailsList(plane));

    planeElt.appendChild(iconElt);
    planeElt.appendChild(infoBox);
    planeElt.style.animation = animatePlane(plane, iconElt);
    return planeElt;
}
//create the displayed infos of a plane as ListeElement
function flightDetailsList(plane){
    var infosElt = document.createElement('ul');

    var speedElt = document.createElement('li');
    speedElt.appendChild(document.createTextNode(plane.speed/10));
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
                }, flightTime(plane.speed, plane.route.halfWay));
    exitElt.appendChild(sector);
    infosElt.appendChild(exitElt);
    return infosElt;
}

function getFlIcon(climbValue){
    switch (climbValue){
        case 0:
            return "../img/stableIcon.png"
        case 1:
            return "../img/upIcon.png"
        case -1:
            return "../img/downIcon.png";
        default :
            console.error("wrong climb value");
    }
}

//return keyframes animation sequence
//kill out plane after life
//rotate plane icon
function animatePlane(plane, iconElt){
    var route = plane.route;
    var animPosition = [];
    var delay = 0;
    route.anims.forEach(function(anim){
        if (delay != 0) {
            animPosition += ", ";
        }
        var animTime = flightTime(plane.speed, anim.dist);
        animPosition += anim.name + " " + animTime + "ms linear " + delay + "ms forwards";
        setTimeout(function(){
                        iconElt.style.transform = "rotate("+anim.angle+")";
                    }, delay
        );
        delay += animTime;
    })
    setTimeout(function(){
                    var planeId = planeNames.indexOf(plane.name);
                    planeNames.splice(planeId, 1);
                    planesList.splice(planeId, 1);
                    console.log(planesList);
                    screenElt.removeChild(document.getElementById(plane.name));
                }, delay
    );
    return animPosition;
}


function flightTime(kts, distPx){
    VPxPerS = kts * NmToPx *timeFactor/ 3600;
    var timeMs = Math.round(1000 * distPx / VPxPerS);
    return timeMs;
}
