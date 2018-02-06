//test fonctions

function testRoutes(velocity){
    ROUTES.forEach(function(route){
        screenElt.appendChild(createPlaneElt(new Plane(route.exit.point,route,200,velocity*1000), route.startPoint, false));
    });
}

testRoutes(20);
