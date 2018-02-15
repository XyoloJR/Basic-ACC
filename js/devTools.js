//test fonctions

function testRoutes(velocity){
    var flChange = -100;
    var flDiff = -20
    ROUTES.forEach(function(route){
        var plane = new Plane(300+flDiff, 300+flChange, route, false, route.name, velocity*1000);
        updateList(plane);
        addFlowTable(plane);
        createPlaneElt(plane);
        directTo(plane, route.pointsList[1]);
        screenElt.appendChild(plane.elt);
        flChange +=50;
        flDiff += 10;
    });
}

var boutonTest = document.getElementById('test');
boutonTest.addEventListener('click', function(){
    testRoutes(document.getElementById('routetest').value);
});
/*old Plane.methods
this.getPosition = function(){
    var currentStyle=window.getComputedStyle(this.elt);
    var left = currentStyle.getPropertyValue('left');
    var top = currentStyle.getPropertyValue('top');
    return {x: parseFloat(left), y: parseFloat(top)};


this.updateClimb = function(){
    var flDiff = this.aimedFL - this.actualFL;
    this.climb = flDiff == 0 ? 0 : (flDiff)/Math.abs(flDiff);
}
this.updatePosition = function(){
    this.position = {x:this.route.pointsList[this.step].x,
                     y:this.route.pointsList[this.step].y};
    this.elt.style.left = this.position.x + "px";
    this.elt.style.top = this.position.y + "px";
}
this.setScreenPos = function(xPx,yPx){
    this.elt.style.left = xPx;
    this.elt.style.top = yPx;
    this.position = {x: parseFloat(xPx), y: parseFloat(yPx)};
}

    this.updateTurn = function(){
        this.turn = this.headingAsked - this.heading;
    }
    this.addHeading = function(angle){
        var newHeading = (this.heading + angle - 1)% 360 + 1
        this.heading = newHeading > 0 ? newHeading : 360 + newHeading;
        this.headingRad -= Math.PI * angle / 180;
        this.icon.style.transform = "rotate("+ this.heading % 90 +"deg)";
    }

}*/
