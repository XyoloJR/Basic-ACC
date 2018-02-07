var PLANE_SIZE = 15;//half icon size
var timeFactor = 1;//possibility to speed up or down
console.log("timeFactor : x" + timeFactor);

//Plane Object constructor
function Plane(name, route, actualFL, aimedFL, speed, isState){
    this.name = name.toUpperCase();
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
        dialogReset(2000);
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
        DialogElt.textContent = plane.name + " on air";
        DialogElt.style.color = "darkgreen";
        dialogReset(3000);
    }
}

//return a new animated planeElt
function createPlaneElt(plane, position){
    var planeId = -1;
    updateNamesLists(plane, planeId);
    planesList.push(plane);
    planeNames.push(plane.name);
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
    var lifeTime = animatePlane(plane, planeElt, iconElt);
    planeCrash(plane, lifeTime);
    return planeElt;
}

function planeCrash(plane, lifeTime){
    setTimeout(function(){
                    var planeId = planeNames.indexOf(plane.name);
                    updateNamesLists(plane, planeId);
                    planeNames.splice(planeId, 1);
                    planesList.splice(planeId, 1);
                    screenElt.removeChild(document.getElementById(plane.name));
                }, lifeTime
    );
}

function updateNamesLists(plane, planeId){
    var namesList = document.getElementById('flnames');
    if (planeId<0){
        planeSearchInput.removeAttribute("disabled");
        var newEntry = document.createElement('li');
        newEntry.textContent = plane.name;
        newEntry.addEventListener('click',
                                    function(){
                                        planeSearchInput.value = plane.name;
                                        newFLInput.value = plane.actualFL;
                                    });
        namesList.appendChild(newEntry);
    } else {
        if (planeId == 0){
            planeSearchInput.setAttribute("disabled", "disabled");
            planeSearchInput.value = "";
        }
        namesList.removeChild(namesList.children[planeId]);
    }
}

//return displayed infos of a plane as ListeElement
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
//return keyframes animation sequence
//kill out plane after life
//rotate plane icon
function animatePlane(plane, planeElt, iconElt){
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
    planeElt.style.animation = animPosition
    return delay;
}

function flightTime(kts, distPx){
    VPxPerS = kts * NmToPx *timeFactor/ 3600;
    var timeMs = Math.round(1000 * distPx / VPxPerS);
    return timeMs;
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

function dialogReset(msTime){
    setTimeout(function(){
                    DialogElt.textContent = "Status ok";
                    DialogElt.style.color = "black";
                }, msTime
    );
}

var namesList = document.getElementById('flnames');
var planeSearchInput = document.getElementById('getplanes');
var newFLInput = document.getElementById('newfl')

planeSearchInput.addEventListener('click',
                                function(event){
                                    event.stopPropagation();
                                    namesList.style.display = "block";
});
planeSearchInput.addEventListener('focus',
                                function(event){
                                    namesList.style.display = "block";
});
document.addEventListener('click', function(){namesList.style.display = "none";});
