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

function msFlightTime(pxPerSec, distPx){
    return Math.round(1000 * distPx / (pxPerSec * timeFactor));
}

//return a new animated planeElt
function createPlaneElt(plane){
    var planeElt = document.createElement('div');
    planeElt.id = plane.name;
    planeElt.setAttribute("class", "plane");

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
                    iconName = plane.warning ? "plane" : "warning";
                    plane.warning = !plane.warning;
                    iconElt.style.backgroundImage = "url('../img/"+ iconName+"Icon.png')";
                    break;
            }
        }
    );
    var infoBox = document.createElement('div');
    infoBox.classList.add("infoBox", plane.route.defaultDisplay);
    infoBox.appendChild(flightDetailsList(plane));

    planeElt.appendChild(iconElt);
    planeElt.appendChild(infoBox);
    plane.elt = planeElt;
    plane.icon = iconElt;
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
    nameElt.addEventListener(
        'mousedown',
        function(event){
            event.preventDefault();
            if (event.button == 1){
                iconStyle = plane.elt.firstChild.style;
                callsignStyle = plane.elt.lastChild.firstChild.children[1].style;
                plane.particular = !plane.particular;
                if (plane.particular) {
                    iconStyle.backgroundImage = "url('../img/particularIcon.png')";
                    callsignStyle.backgroundColor= "#E53";
                } else {
                    iconStyle.backgroundImage = "url('../img/planeIcon.png')";
                    callsignStyle.backgroundColor= "transparent";
                }
            }
    });
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

//animate or kill
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

function getFlIcon(climb){
    if (climb == 0){
        return "../img/stableIcon.png"
    } else if (climb > 0) {
        return "../img/upIcon.png"
    } else {
        return "../img/downIcon.png";
    }
}

climbTo = function(plane, newFl){
    clearInterval(plane.climbId);
    plane.aimedFL = newFl;
    var flElt = document.getElementById(plane.name + "fl");
    var flDiff = plane.aimedFL - plane.actualFL;
    plane.climb = flDiff == 0 ? 0 : flDiff/Math.abs(flDiff);
    flElt.lastElementChild.src = getFlIcon(plane.climb);
    plane.climbId = setInterval(
        function(){
            plane.actualFL += (plane.climb * 5);
            console.log(plane);
            flDiff = plane.aimedFL - plane.actualFL;
            console.log(flDiff);
            if (flDiff == 0){
                clearInterval(plane.climbId);
                flElt.lastElementChild.src = getFlIcon(0);
            }
            flElt.firstChild.textContent = plane.actualFL;
            if (plane.climb < 0 && plane.actualFL < 285){
                plane.elt.style.display = "none";
            } else if (plane.actualFL == 285){
                plane.elt.style.display = "block";
            }


        }, 15000);
    if (plane.climb !=0) {
        var upOrDown = plane.climb > 0 ? " climb" : " descend";
        return plane.name + upOrDown + "ing to FL"+ plane.aimedFL;
    } else {
        return "no change";
    }
}
