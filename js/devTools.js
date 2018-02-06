//test fonctions

function testRoutes(velocity){
    ROUTES.forEach(function(route){
        var plane = new Plane(route.exit.point,route,200,velocity*1000, false);
        screenElt.appendChild(createPlaneElt(plane, route.startPoint));
    });
}

var boutonTest = document.getElementById('test');
boutonTest.addEventListener('click', function(){
    testRoutes(document.getElementById('routetest').value);
});
