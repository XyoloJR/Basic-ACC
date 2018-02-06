var PLANE_SIZE = 15;
var timeFactor = 4;
console.log("timeFactor : x"+timeFactor)

function Plane(name, route, fl, speed){
    this.name = name;
    this.route = route;
    this.fl = fl;
    this.speed = speed;
    this.nextPoint = route.passPoints[0];
    this.startPoint = route.startPoint;
}

/*//
function putPlane(planeElt, point){
    planeElt.style.left = String(point.x - PLANE_SIZE) + "px";
    planeElt.style.top = String(point.y - PLANE_SIZE) + "px";
}*/


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
    //animPlane = animPlane(planeElt, plane);
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
    planeElt.style.animation = animPosition(plane);
    return planeElt;
}

function animPosition(plane){
    var route = plane.route;
    var animPosition = [];
    var delay = 0;
    route.anims.forEach(function(anim){
        if (animPosition.length != 0) {
            animPosition += ", ";
        }
        var animTime = time(plane.speed, anim.dist);
        console.log("anim duration " + animTime);
        animPosition += anim.name + " " + animTime + "s linear " + delay + "s forwards";
        delay += animTime;
    })
    console.log(animPosition)
    return animPosition;
};

function time(kts, distPx){
    VPxPerS = kts * NmToPx *timeFactor/ 3600;
    return Math.round(distPx / VPxPerS);
}
