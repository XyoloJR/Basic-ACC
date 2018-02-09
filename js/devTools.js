//test fonctions

function testRoutes(velocity){
    var flChange = -100;
    ROUTES.forEach(function(route){
        var plane = new Plane(300, 300+flChange, route, false, route.exit.point, velocity*1000);
        createPlaneElt(plane);
        animPlane(plane);
        screenElt.appendChild(plane.elt);
        flChange +=50;
    });
}

var boutonTest = document.getElementById('test');
boutonTest.addEventListener('click', function(){
    testRoutes(document.getElementById('routetest').value);
});
