var styleEl = document.createElement('style'),
    styleSheet;
document.head.appendChild(styleEl);// Append style element to head
styleSheet = styleEl.sheet;// Grab style sheet
addKeyFrames = function(animName, point){
    var keyFramesText = "@keyframes "+animName +
                "{100%{left:"+point.x+"px; top:"+point.y+"px;}}";
    styleSheet.insertRule(keyFramesText, styleSheet.cssRules.length);
}
autoPlay = function(plane){
    plane.autopilot = true;
    var delay = 0;
    var animTime = plane.timeTo(plane.nextPoint);
}
climbTo = function(plane, newFl){
    clearInterval(plane.climbId);
    plane.aimedFL = newFl;
    var flElt = document.getElementById(plane.name + "fl");
    var flDiff = plane.aimedFL - plane.actualFL;
    plane.climb = flDiff == 0 ? 0 : flDiff/Math.abs(flDiff);//0 or +-1
    flElt.lastElementChild.src = getFlIcon(plane.climb);
    plane.climbId = setInterval(
        function(){
            plane.actualFL += plane.climb;
            flDiff = plane.aimedFL - plane.actualFL;
            if (flDiff == 0){
                clearInterval(plane.climbId);
                flElt.lastElementChild.src = getFlIcon(0);
            }
            flElt.firstChild.textContent = plane.actualFL;
            if (plane.climb < 0 && plane.actualFL < 285 ){
                if (!plane.particular){plane.elt.style.display = "none";}
            } else if (plane.actualFL == 285){
                plane.elt.style.display = "block";
            }
        }, 3000
    );
}
crashing = function(plane){
    var planeId = planeNames.indexOf(plane.name);
    screenElt.removeChild(document.getElementById(plane.name));
    planeNames.splice(planeId, 1);
    planesList.splice(planeId, 1);
    orderNamesList.removeChild(orderNamesList.children[planeId]);
    if (plane.flow) {
        flowBoard.removeChild(plane.flow);
    }
    if (orderNamesList.childElementCount == 0){
        ordersField.setAttribute("disabled","disabled");
    }
}
directTo = function(plane){
    var animTime = plane.timeTo(plane.nextPoint);
    var animText = plane.nextPoint.dir + " " + animTime + "ms linear forwards";
    plane.elt.style.animation = animText;
    plane.setHeading(getHeading(plane.position, plane.nextPoint));
    plane.autopilot = true;
    plane.anim = setTimeout(
        function(){
            if (plane.passPoints.length == 0){
                crashing(plane);
            } else {
                plane.freeze();
                plane.nextPoint = plane.passPoints.pop();
                directTo(plane);
            }
        }, animTime
    );
}
headingTo = function(plane, heading){
    plane.setHeading(heading);
    var finalPoint = getNextPoint(plane.position, AUTONOMY, plane.headingRad);
    var animName = "head" + plane.animId + plane.name + " ";
    var animTime = plane.timeTo(finalPoint);
    addKeyFrames(animName, finalPoint);
    var animText = animName + animTime + "ms linear forwards";
    plane.elt.style.animation = animText;
    plane.animId ++;
}
turnTo = function(plane, newHeading) {
    var headingDiff = (newHeading - plane.heading);
    var turnTime = 0;
    if (headingDiff != 0){
        var turnAngle = Math.abs(headingDiff);
        if (turnAngle > 180){
            headingDiff = Math.sign(headingDiff) * (turnAngle - 360);
        }
        var turnTime = Math.round(1000 * Math.abs(headingDiff) / 3);
        var halfRadDiff = headingDiff * Math.PI/360;
        var chord = 2 * (plane.pxSpeed * 60 / Math.PI) * Math.abs(Math.sin(halfRadDiff));
        var newHeading = (plane.heading + headingDiff/2 - 1)% 360 + 1;
        plane.setHeading(newHeading > 0 ? newHeading : 360 + newHeading);
        endTurnPoint = getNextPoint(plane.position, chord, plane.headingRad);
        var animTurnName = "turn" + plane.animId + plane.name + " ";
        addKeyFrames(animTurnName, endTurnPoint);
        animTurnText = animTurnName + turnTime + "ms linear forwards";
        plane.elt.style.animation = animTurnText;
        plane.animId ++
    }
    return turnTime;
}
getHeading = function(currentPoint, aimedPoint){
    var rad = Math.atan2(currentPoint.y - aimedPoint.y,
                         aimedPoint.x- currentPoint.x);
    var deg = Math.round(90 - rad * 180 / Math.PI);
    return deg > 0 ? deg : 360 + deg;
}
getNextPoint = function(position, distance, headingRad){
    var nextX = Math.round(position.x + distance * Math.cos(headingRad));
    var nextY = Math.round(position.y - distance * Math.sin(headingRad));
    return {x: nextX, y: nextY};
}
getFlIcon = function(climb){
    if (climb == 0){
        return "../img/stableIcon.png"
    } else if (climb > 0) {
        return "../img/upIcon.png"
    } else {
        return "../img/downIcon.png";
    }
}
msFlightTime = function(pxPerSec, distPx){
    return Math.round(1000 * distPx / (pxPerSec * timeFactor));
}
