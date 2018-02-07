//test fonctions

function testRoutes(velocity){
    var flChange = -100;
    ROUTES.forEach(function(route){
        var plane = new Plane(route.exit.point,route,200,200+flChange,velocity*1000, false);
        screenElt.appendChild(createPlaneElt(plane, route.startPoint));
        flChange +=50;
    });
}

var boutonTest = document.getElementById('test');
boutonTest.addEventListener('click', function(){
    testRoutes(document.getElementById('routetest').value);
});
