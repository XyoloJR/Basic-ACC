//test fonctions

function testRoutes(velocity){
    var flChange = -100;
    var flDiff = -20
    ROUTES.forEach(function(route){
        var plane = new Plane(300+flDiff, 300+flChange, route, false, route.name, velocity*1000);
        updateList(plane);
        addFlowTable(plane);
        createPlaneElt(plane);
        directTo(plane);
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
//old toute.anims
    [{name: "toMtl", dist: pxDist(SICIL, MTL), heading : 299},
    {name: "toMindi", dist: pxDist(MTL, MINDI), heading : 315},
    {name: "toCfa", dist: pxDist(MINDI, CFA), heading : 315},
    {name: "toVulca", dist: pxDist(CFA, VULCA), heading : 350}],
*/
/*conversion original to 1200px width
POINTS.forEach(function(point){
    var newX = point.x*1200/2562;
    var newY = point.y*1200/2562;
    console.log(point.name, newX, newY, );
})*/
/*
//distance tests
//Scaling Points, distance 240Nm
var ouestPoint= {"x":295, "y":2045};
var eastPoint= {"x":2764 , "y":1231};
console.log(pxDist(ouestPoint, eastPoint)/240);
//based on etori-BOSUA, distance 164Nm
console.log(pxDist(ETORI, GRENA)/126, pxDist(MTL, GRENA)/52,
            pxDist(MTL, LTP)/62, pxDist(LSE, MINDI)/57,
            pxDist(LTP, GRENA)/49, pxDist(MTL, CFA)/100,
);

//MTL-MAJOR px distance
console.log(42*NmToPx);
console.log(pxDist(MAJOR,MTL));
*/
