var PLANE_SIZE = 15;
var timeFactor = 1;

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
    var planeElt = document.createElement('div');
    planeElt.id = plane.name;
    planeElt.style.backgroundImage ="url('../img/planeIcon.png')";
    planeElt.style.position = "absolute";
    planeElt.style.width = "31px";
    planeElt.style.height = "31px";
    putPlane(planeElt, plane.startPoint);
    var animPlane = "un1_0 linear 10s forwards," +
                    " un1_1 12s linear 10s forwards,"+
                    " un1_2 30s linear 22s forwards";
    planeElt.style.animation = animPlane;
    //animPlane = animPlane(planeElt, plane);
    screenElt.appendChild(planeElt);
}

function animPlane(){};
