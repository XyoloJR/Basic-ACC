//test fonctions

function testRoutes(velocity){
    var flChange = -100;
    var flDiff = -20
    ROUTES.forEach(function(route){
        var plane = new Plane(300+flDiff, 300+flChange, route, false, route.name, velocity*1000);
        updateList(plane);
        addFlowTable(plane);
        createPlaneElt(plane);
        animPlane(plane);
        screenElt.appendChild(plane.elt);
        flChange +=50;
        flDiff += 10;
    });
}

var boutonTest = document.getElementById('test');
boutonTest.addEventListener('click', function(){
    testRoutes(document.getElementById('routetest').value);
});

/*if (plane.climb != 0){
    usedForm = document.forms.fl
    usedForm.newfl.valueas = plane.aimedFL;
    usedForm.planeName.value = plane.name;
    usedForm.submit();
    usedForm.reset();
}*/
