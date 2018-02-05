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

function putPlane(planeElt, point){
    planeElt.style.left = String(point.x - PLANE_SIZE) + "px";
    planeElt.style.top = String(point.y - PLANE_SIZE) + "px";
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
    var planeElt = createPlaneElt(plane.name, plane.startPoint)

    planeElt.style.animation = animText(plane);
    //animPlane = animPlane(planeElt, plane);
    screenElt.appendChild(planeElt);
}

function createPlaneElt(planeName, position){
    var planeElt = document.createElement('div');
    planeElt.id = planeName;
    planeElt.style.backgroundImage ="url('../img/planeIcon.png')";
    planeElt.style.position = "absolute";
    planeElt.style.width = "31px";
    planeElt.style.height = "31px";
    planeElt.style.left = String(position.x - PLANE_SIZE) + "px";
    planeElt.style.top = String(position.y - PLANE_SIZE) + "px";
    return planeElt;
}

function animText(plane){
    var route = plane.route;
    var animText = [];
    var delay = 0;
    route.anims.forEach(function(anim){
        if (animText.length != 0) {
            animText += ", ";
        }
        var animTime = time(plane.speed, anim.dist);
        console.log("anim duration " + animTime);
        animText += anim.name + " " + animTime + "s linear " + delay + "s forwards";
        delay += animTime;
    })
    console.log(animText)
    return animText;
};

function time(kts, distPx){
    VPxPerS = kts * NmToPx *timeFactor/ 3600;
    return Math.round(distPx / VPxPerS);
}
