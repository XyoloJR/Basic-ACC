var PLANE_SIZE = 15;
var timeFactor = 1;
console.log("timeFactor : x"+timeFactor)

function Plane(name, route, fl, speed){
    this.name = name;
    this.route = route;
    this.fl = fl;
    this.speed = speed;
    this.nextPoint = route.passPoints[0];
    this.startPoint = route.startPoint;
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
    );
    console.log(plane);
    planeList.push(plane);
    var planeElt = createPlaneElt(plane, plane.startPoint)
    screenElt.appendChild(planeElt);
}

function createPlaneElt(plane, position){
    var iconElt = document.createElement('div');
    iconElt.setAttribute("class", "planeIcon");
    var infosElt = document.createElement('ul');
    var planeElt = document.createElement('div');
    planeElt.id = plane.name;
    planeElt.setAttribute("class", "plane");
    planeElt.style.left = position.x + "px";
    planeElt.style.top = position.y + "px";
    planeElt.appendChild(iconElt);
    planeElt.style.animation = animatePlane(plane, iconElt);
    return planeElt;
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
        animPosition += anim.name + " " + animTime + "s linear " + delay + "s forwards";
        setTimeout(function(){iconElt.style.transform = "rotate("+anim.angle+")";}, delay*1000);
        delay += animTime;
    })
    console.log(animPosition)
    return animPosition;
}

function flightTime(kts, distPx){
    VPxPerS = kts * NmToPx *timeFactor/ 3600;
    return Math.round(distPx / VPxPerS);
}
