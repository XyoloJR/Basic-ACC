PLANE_SIZE = 15;

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
    var plane = new Plane(launchElt["name"].value,
                            UN1,
                            launchElt["fl"].valueAsNumber,
                            launchElt["speed"].valueAsNumber,
                            etori,
                            gai);
    planeList.push(plane);
    var planeElt = document.createElement('div');
    planeElt.id = plane.name;
    planeElt.style.backgroundImage ="url('../img/planeIcon.png')";
    planeElt.style.position = "absolute";
    planeElt.style.width = "31px";
    planeElt.style.height = "31px";
    putPlane(planeElt, plane.startPoint);
    screenElt.appendChild(planeElt);
}
