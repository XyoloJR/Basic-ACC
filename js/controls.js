

var d = new Date();
clockElt.textContent = "" + d.getHours()+":"+ d.getMinutes();
setInterval(
  function(){
    d.setMinutes(d.getMinutes() + 1) ;
    clockElt.textContent = "" + d.getHours()+":"+ d.getMinutes()
  }, 60000
);


//create a Plane and put on screen the corresponding Element
//from the launch form values
launchForm.addEventListener(
    'submit',
    function (event){
        event.preventDefault();
        nameGiven = launchForm["name"].value.toUpperCase();
        if (!(planeNames.indexOf(nameGiven)<0)){
            dial("!!!---AVION DEJA EN VOL---!!!", "darkred",5000)
        } else {
            var plane = new Plane(
                launchForm.fl.valueAsNumber,
                launchForm.fl.valueAsNumber,
                ROUTES[launchForm["route"].selectedIndex],
                launchForm["state"].checked,
                nameGiven,
                launchForm["kts"].valueAsNumber
            );
            if (alterStartInput.checked){
                plane.position = plane.route.extraStart;
            }
            updateList(plane);
            addFlowTable(plane);
            createPlaneElt(plane);
            directTo(plane);
            screenElt.appendChild(plane.elt);
            dial(plane.name + " on air", "darkgreen", 10000);
            launchForm.reset();
            alterStartLine.lastChild.textContent = "JAMBI";
        }
});

launchForm.fl.addEventListener('input', event => event.target.focus());
launchForm.kts.addEventListener('input', event => event.target.focus());

routeSelector.addEventListener('input',function(event){
    var point = ROUTES[launchForm["route"].selectedIndex].extraStart;
    alterStartLine.lastChild.textContent = point.name;
});
flButton.addEventListener('click', event => submitOrder = "F");
headButton.addEventListener('click', event => submitOrder = "H");
directButton.addEventListener('click', event => submitOrder = "R");

//FL change
orderForm.addEventListener(
    'submit',
    function(event){
        event.preventDefault();
        var plane = getPlane(planeInput.value);
        var message = "";
        var color = "darkgreen"
        //var submitOrder = event.explicitOriginalTarget.name //firefox only
        switch (submitOrder){
            case "F":
                climbTo(plane, newFLInput.valueAsNumber);
                if (plane.climb !=0) {
                    var upOrDown = plane.climb > 0 ? " climb" : " descend";
                    message =  plane.name + upOrDown + "ing to FL"+ plane.aimedFL;
                } else {
                    message = "no change";
                    color = "darkred";
                }
                break;
            case "H" :
                var newHeading = newHeadInput.valueAsNumber
                if (plane.heading != newHeading){
                    plane.autopilot = false;
                    plane.freeze();
                    var waitTime = turnTo(plane, newHeading);
                    plane.anim = setTimeout(
                        function(){
                            plane.freeze();
                            headingTo(plane,newHeading);
                        }, waitTime
                    );
                    message = plane.name + " heading to " + newHeading +"°";
                }
                break;
            case "R" :
                if (!plane.autopilot){
                    var pointName = newDirectInput.value
                    while (pointName != plane.nextPoint.name){
                        plane.nextPoint = plane.passPoints.pop();
                    }
                    plane.freeze();
                    plane.autopilot = true;
                    var newHeading = getHeading(plane.position, plane.nextPoint);
                    var turnTime = turnTo(plane, newHeading);
                    plane.anim = setTimeout(
                        function(){
                            plane.freeze();
                            directTo(plane);
                        }, turnTime
                    );
                    message = plane.name + " resume its route to "+ newDirectInput.value;
                } else {
                    message = plane.name + " already on route to " + newDirectInput.value;
                    color = "darkred";
                }
                break;
        }
        dial(message, color, 10*1000);
        resetOrderForm();
});

resetOrderForm = function(){
    orderForm.reset();
    directPointsElt.innerHTML = "";
    fieldList.forEach(field => field.setAttribute("disabled", "disabled"))
}
newHeadInput.addEventListener(
    'input',
    function(event){
        if (newHeadInput.value == 361)
            newHeadInput.value = 1;
        if (newHeadInput.value == 0)
            newHeadInput.value = 360;
    }
)

newDirectInput.addEventListener(
    'click',
    function(event){
        event.stopPropagation();
        directPointsElt.style.display = "block";
        orderNamesList.style.display = "none";
    }
)

planeInput.addEventListener(
    'click',
    function(event){
        event.stopPropagation();
        orderNamesList.style.display = "block";
});

planeInput.addEventListener(
    'keyup',
    function(event){
        event.stopPropagation();
    }
)


document.addEventListener(
    'click',
    function(event){
        directPointsElt.style.display = "none"
        orderNamesList.style.display = "none";
    }
);


addFlowTable = function(plane){
    if (plane.exitPoint == "ETORI"){
        var newEntry = document.createElement('tr');
        var Entries = [plane.name, "TYPE", "DEST", "ETORI", "TIME", plane.pfl, plane.exitSector];
        var cells = [];
        for (i = 0; i < 7 ; i++){
            cells[i] = document.createElement('td');
            cells[i].textContent = Entries[i];
            newEntry.appendChild(cells[i]);
        }
        cells[0].addEventListener(
            'mousedown',
            function(event){
                event.preventDefault();
                if (event.button == 1){
                    plane.setParticular();
                }
        });
        plane.flow = newEntry
        flowBoard.appendChild(newEntry);
    }
}

updateList = function(plane){
    ordersField.removeAttribute("disabled");
    var orderNamesList = document.getElementById('orderNames')
    planesList.push(plane);
    planeNames.push(plane.name);
    var newEntry = document.createElement('li');
    newEntry.textContent = plane.name;
    newEntry.addEventListener(
        'click',
        function(event){
            planeInput.value = plane.name;
            newFLInput.value = plane.actualFL;
            newHeadInput.value = plane.heading;
            newDirectInput.value = getPointList(plane);
            newFLInput.parentElement.removeAttribute("disabled")
            newHeadInput.parentElement.removeAttribute("disabled");
            if (plane.autopilot){
                newDirectInput.parentElement.setAttribute("disabled", "disabled");
            } else {
                newDirectInput.parentElement.removeAttribute("disabled");
            }
        }
    )
    orderNamesList.appendChild(newEntry);
}

getPointList = function(plane){
    var pointName;
    directPointsElt.innerHTML = "";
    plane.passPoints.forEach(
        function(point){
            pointName = point.name;
            var newPoint = document.createElement('li');
            newPoint.textContent = pointName;
            newPoint.addEventListener(
                'click',
                function(event){
                    newDirectInput.value = event.target.textContent;
                }
            );
            directPointsElt.appendChild(newPoint);
        }
    );
    return pointName;
}
dial = function(message, color, msTime){
    if (dialogElt.childElementCount == 0){
        dialogElt.textContent ="";
    }
    var textElt = document.createElement('p');
    textElt.textContent = message;
    textElt.style.color = color;
    dialogElt.insertBefore(textElt,dialogElt.firstChild);
    setTimeout(function(){
        dialogElt.removeChild(textElt);
        if (dialogElt.childElementCount == 0){
            dialogElt.textContent = "status : ok"
        }
    }, msTime);
}
function getPoint(pointName){
    return directPoints[directNames.indexOf(pointName)]
}
function getPlane(planeName){
    return planesList[planeNames.indexOf(planeName)]
}

//middle click default
document.addEventListener('mousedown', function(event){
    if (event.button==1){event.preventDefault();}
});
//right click default
document.body.addEventListener('contextmenu', event => event.preventDefault());
