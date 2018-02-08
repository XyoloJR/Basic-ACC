var PLANE_SIZE = 15;//half icon size
var timeFactor = 1;//possibility to speed up or down
console.log("timeFactor : x" + timeFactor);



//Plane Object constructor
function Plane(actualFL, aimedFL, route, isState, name, speed){
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
    this.speed = speed;
    this.step = 0;
    this.updateClimb = function(){
        var flDiff = this.aimedFL - this.actualFL;
        this.climb = flDiff == 0 ? 0 : (flDiff)/Math.abs(flDiff);
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
var getPlaneInput = document.getElementById('getplane');
var namesList = document.getElementById('flnames');

launchElt.addEventListener('submit',goOnAir);
//create a Plane and put on screen the corresponding Element
//from the launch form values
function goOnAir(event){
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
            launchElt["speed"].valueAsNumber,
        );
        var planeElt = createPlaneElt(plane, plane.startPoint);
        screenElt.appendChild(planeElt);
        dial(plane.name + " on air", "darkgreen", 3000)
    }
}

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
    animatePlane(plane, planeElt, iconElt);
    return planeElt;
}

function animatePlane(plane, planeElt, iconElt){
    var position = plane.route.pointsList[plane.step];
    planeElt.style.left = position.x + "px";
    planeElt.style.top = position.y + "px";

    var anim = plane.route.anims[plane.step]
    var animTime = flightTime(plane.speed, anim.dist);
    animText = anim.name + " " + animTime + "ms linear forwards";
    planeElt.style.animation = animText;
    iconElt.style.transform = "rotate("+ anim.angle +")";
    var stepIncrement = setTimeout(
        function(){
            plane.step ++;
            if (plane.step == plane.route.anims.length){
                planeCrash(plane);
            } else {
                animatePlane(plane, planeElt, iconElt);
            }
        }, animTime
    );
}

function updateLists(plane, planeId){
    var namesList = document.getElementById('flnames');
    if (planeId<0){
        planesList.push(plane);
        planeNames.push(plane.name);
        flChangeField.removeAttribute("disabled");
        var newEntry = document.createElement('li');
        newEntry.textContent = plane.name;
        newEntry.addEventListener(
            'click',
            function(){
                getPlaneInput.value = plane.name;
                if (newFLInput.value == 0){
                newFLInput.value = plane.actualFL;
            }
        });
        namesList.appendChild(newEntry);
    } else {
        planeNames.splice(planeId, 1);
        planesList.splice(planeId, 1);
        namesList.removeChild(namesList.children[planeId]);
        if (namesList.childElementCount == 0){
            flChangeField.setAttribute("disabled", "disabled");
            getPlaneInput.value = "";
        }
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
                }, flightTime(plane.speed, plane.route.halfWay));
    exitElt.appendChild(sector);
    infosElt.appendChild(exitElt);
    return infosElt;
}
//return keyframes animation sequence
//kill out plane after life
//rotate plane icon


function planeCrash(plane){
    var planeId = planeNames.indexOf(plane.name);
    updateLists(plane, planeId);
    screenElt.removeChild(document.getElementById(plane.name));
}

function flightTime(kts, distPx){
    VPxPerS = kts * NmToPx *timeFactor/ 3600;
    var timeMs = Math.round(1000 * distPx / VPxPerS);
    return timeMs;
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
        var plane = getPlane(getPlaneInput.value);
        var flElt = document.getElementById(plane.name +"fl");
        plane.aimedFL = newFLInput.valueAsNumber;
        plane.updateClimb();
        if (plane.climb !=0) {
            var upOrDown = plane.climb > 0 ? " climb" : " descend";
            dial(plane.name + upOrDown + "ing to FL"+ plane.aimedFL, "darkgreen", 4000);
        }
        flElt.lastElementChild.src = getFlIcon(plane.climb);
        climbId = setInterval(
            function(){
                plane.actualFL += 5 * plane.climb;
                flDiff = plane.aimedFL - plane.actualFL;
                if (flDiff == 0){
                    clearInterval(climbId);
                    plane.climb = 0;
                    flElt.lastElementChild.src = getFlIcon(0);
                }
                flElt.firstChild.textContent = plane.actualFL;
            }, 15000);
    });

getPlaneInput.addEventListener(
    'click',
    function(event){
        event.preventDefault();
        event.stopPropagation();
        namesList.style.display = "block";
});

getPlaneInput.addEventListener(
    'keyup',
    function(event){
        event.preventDefault();
        event.stopPropagation();
        console.log(event.key);
    }
)

getPlaneInput.addEventListener(
    'focus',
    function(event){
        event.preventDefault();
        namesList.style.display = "block";
});
document.addEventListener(
    'click',
    function(){
        namesList.style.display = "none";
});
