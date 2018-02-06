var PLANE_SIZE = 15;
var timeFactor = 1;
console.log("timeFactor : x"+timeFactor)

function Plane(name, route, fl, speed, isState){
    this.name = name;
    this.isState = isState
    this.route = route;
    this.fl = fl;
    this.climb = " -"
    this.speed = speed;
    this.nextPoint = route.passPoints[0];
    this.startPoint = route.startPoint;
    this.exitPoint = route.exit.point
    if (route == UM4){
        this.exitSector = "I" + (fl > 365 ? 3 : 2);
    } else {
        this.exitSector = route.exit.sector
    }
}

var planeList= [];
var screenElt = document.getElementById('mainScreen');
var launchElt = document.getElementById('launch');
launchElt.addEventListener('submit',goOnAir);

function goOnAir(event){
    event.preventDefault();
    var plane = new Plane(
        launchElt["name"].value,
        ROUTES[launchElt["route"].selectedIndex],
        launchElt["fl"].valueAsNumber,
        launchElt["speed"].valueAsNumber,
        launchElt["state"].checked
    );
    console.log(plane);
    planeList.push(plane);
    var planeElt = createPlaneElt(plane, plane.startPoint)
    screenElt.appendChild(planeElt);
}

function createPlaneElt(plane, position){
    var planeElt = document.createElement('div');
    planeElt.id = plane.name;
    planeElt.setAttribute("class", "plane");
    planeElt.style.left = position.x + "px";
    planeElt.style.top = position.y + "px";

    var iconElt = document.createElement('div');
    iconElt.setAttribute("class", "planeIcon");

    var infoBox = document.createElement('div');
    infoBox.setAttribute("class", "infoBox");
    infoBox.appendChild(flightDetails(plane));

    planeElt.appendChild(iconElt);
    planeElt.appendChild(infoBox);
    planeElt.style.animation = animatePlane(plane, iconElt);
    return planeElt;
}

function flightDetails(plane){
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
    flElt.appendChild(document.createTextNode(plane.fl + plane.climb));
    infosElt.appendChild(flElt);

    var exitElt = document.createElement('li');
    exitElt.appendChild(document.createTextNode(plane.exitPoint +" "));
    var sector = document.createElement('span');
    sector.setAttribute("class", "exitSectorOff");
    sector.textContent = plane.exitSector;
    exitElt.appendChild(sector);
    infosElt.appendChild(exitElt);

    return infosElt;
}

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
        setTimeout(function(){iconElt.style.transform = "rotate("+anim.angle+")";}, delay);
        delay += animTime;
    })
    setTimeout(function(){
            screenElt.removeChild(document.getElementById(plane.name));
    },delay);
    return animPosition;
}


function flightTime(kts, distPx){
    VPxPerS = kts * NmToPx *timeFactor/ 3600;
    return Math.round(1000 * distPx / VPxPerS);
}
