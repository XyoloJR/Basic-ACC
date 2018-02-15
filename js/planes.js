//Plane Object constructor
function Plane(actualFL, aimedFL, route, isState, name, kts){
    this.actualFL = actualFL;
    this.aimedFL = aimedFL;
    this.animId = 0;
    this.autopilot = true;
    var flDiff = aimedFL - actualFL;
    this.climb = flDiff == 0 ? 0 : (flDiff)/Math.abs(flDiff);
    this.elt;
    this.exitPoint = route.exit.point;
    if (route == UM4){
        this.exitSector = "I" + (actualFL > 365 ? 3 : 2);
    } else {
        this.exitSector = route.exit.sector;
    }
    this.isState = isState;
    this.kts = kts;
    this.name = name.toUpperCase();
    this.particular = false;
    this.passPoints = route.pointsList
    this.nextPoint = this.passPoints.shift()
    this.position = route.startPoint;
    this.pFL = "PFL"
    this.route = route;
    this.pxSpeed = kts * NmToPx / 3600;
    this.type = "TYPE"
    this.vector;
    this.vectorSize = 0;
    this.vectorDisp = false;
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
    this.displayVector = function(minutes){
        this.removeVector();
        this.vectorSize = minutes;
        var color = "rgb(255, 255, 255)";
        if (this.warning){
            var color = "darkorange";
        }
        var endLine = getNextPoint({x:0,y:0}, this.pxSpeed * 60 * minutes, this.headingRad);
        var vector = createVector({x:0,y:0}, endLine, color, SPEEDVECTORWIDTH);
        vector.id = this.name + 'vect';
        this.vector = vector;
        this.elt.appendChild(this.vector);
    }
    this.removeVector = function(){
        if (this.vector){
            this.elt.removeChild(this.vector);
            this.vector = 0;
            this.vectorSize = 0;
        }
    }
    this.freeze = function(){//returns current coordinates
        var currentStyle=window.getComputedStyle(this.elt);
        var left = currentStyle.getPropertyValue('left');
        var top = currentStyle.getPropertyValue('top');
        clearTimeout(this.anim);
        this.elt.style.animation = "";
        this.elt.style.left = left;
        this.elt.style.top = top;
        this.position = {x: parseFloat(left), y: parseFloat(top)};
    }
    this.setHeading = function(heading){
        this.heading = heading;
        this.headingRad = Math.PI * (90 - heading)/ 180;
        this.icon.style.transform = "rotate("+ this.heading % 90 +"deg)";
    }
    this.setParticular = function(){
            iconStyle = this.icon.style;
            callsignStyle = document.getElementById(this.name+"name").style;
            this.particular = !this.particular;
            if (this.particular) {
                this.elt.style.display = "block";
                iconStyle.backgroundImage = "url('../img/particularIcon.png')";
                callsignStyle.backgroundColor= "#E53";
            } else {
                iconStyle.backgroundImage = "url('../img/planeIcon.png')";//no more particular if possible
                callsignStyle.backgroundColor= "transparent";
            }
    }
    this.setWarning = function(){
        this.warning = !this.warning;
        if (this.warning){
            var diamond = document.createElement('img');
            diamond.src = "../img/warningLabel.png";
            diamond.style.marginLeft = "4px";
            this.label.appendChild(diamond);
            this.displayVector(Math.max(3,this.vectorSize));
            this.icon.style.backgroundImage = "url('../img/warningIcon.png')";
        } else{
            this.label.removeChild(this.label.lastChild);
            if (this.vectorDisp){
                this.displayVector(this.vectorSize);
            } else {
                this.removeVector();
            }
            var iconName = this.particular ? "particular" : "plane";
            this.icon.style.backgroundImage = "url('../img/"+iconName+"Icon.png')";
        }
    }
}
function createPlaneElt(plane){
    var planeElt = document.createElement('div');
    planeElt.id = plane.name;
    planeElt.className = "plane";
    planeElt.style.left = plane.position.x + "px";
    planeElt.style.top = plane.position.y + "px";
    if (plane.actualFL < 290){
        planeElt.style.display= "none";
    }

    var iconElt = document.createElement('div');
    iconElt.classList.add("planeIcon");
    iconElt.addEventListener(
        'mousedown',
        function(event){
            event.preventDefault();
            switch (event.button){
                case 0 :
                    if(!mesuring){
                        plane.changeDisplay();
                    }
                    break;
                case 1 :
                    plane.setWarning();
                    break;
            }
        }
    );
    var infoBox = document.createElement('div');
    infoBox.classList.add("infoBox", plane.route.defaultDisplay);
    infoBox.appendChild(flightDetailsList(plane));
    planeElt.appendChild(iconElt);
    planeElt.appendChild(infoBox);
    plane.icon = iconElt;
    plane.elt = planeElt;
}
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
    var callsign = document.createElement('span');
    callsign.id = plane.name+"name";
    callsign.textContent = plane.name;
    nameElt.appendChild(callsign);
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
    plane.label = nameElt;
    return infosElt;
}
createVector = function(startPoint, endPoint, color, weight){
    var diffX = endPoint.x - startPoint.x;
    var diffY = endPoint.y - startPoint.y;
    var width = Math.abs(diffX);
    var height = Math.abs(diffY);
    var vector = document.createElement("canvas");
    vector.className= 'vector';
    vector.setAttribute("width", Math.max(width, weight) + "px");
    vector.setAttribute("height", Math.max(height, weight) + "px");
    var context = vector.getContext("2d");
    context.strokeStyle = color;
    context.lineWidth = weight;
    vector.style.left = startPoint.x + "px";
    vector.style.top = startPoint.y + "px";
    if (diffX < 0) {
        vector.style.left = endPoint.x + "px";
    }
    if (diffY < 0){
        vector.style.top = endPoint.y + "px";
    }
    if (diffY * diffX > 0){
        context.moveTo(0,0);
        context.lineTo(width, height);
    } else {
        context.moveTo(width,0);
        context.lineTo(0, height);
    }
    context.stroke();
    return vector;
}
