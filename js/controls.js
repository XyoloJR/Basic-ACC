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
                launchForm["kts"].valueAsNumber,
            );
            updateList(plane);
            addFlowTable(plane);
            createPlaneElt(plane);
            animPlane(plane);
            screenElt.appendChild(plane.elt);
            dial(plane.name + " on air", "darkgreen", 10000)
            launchForm.reset();
        }
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
        //var submitOrder = event.explicitOriginalTarget.name //firefox only
        switch (submitOrder){
            case "F":
                var message = climbTo(plane, newFLInput.valueAsNumber);
                dial(message, "darkgreen", 10000);
                break;
            case "H" :
                if (plane.heading != newHeadInput.valueAsNumber){
                    plane.freeze();
                    message = turnTo(plane, newHeadInput.valueAsNumber);
                    dial(message, "darkgreen", 10000);
                }
                break;
            case "R" :
                if (!plane.autopilot){
                    plane.step += nextDirect.indexOf(newDirectInput.value);
                    plane.freeze();
                    animPlane(plane);
                    dial(plane.name + " resume its route to "+ newDirectInput.value, "darkgreen", 10000);
                } else {
                    dial(plane.name + " already on route to " + plane.route.pointsList[plane.step + 1].name, "darkred", 5000);
                }
                break;
        }
        resetOrderForm();
});

/*
orderForm.headingConfirm.addEventListener(
    'click',
    function(event){
        event.preventDefault();


            resetOrderForm();
        }
    }
);

orderForm.directConfirm.addEventListener(
    'click',
    function(event){
        event.preventDefault();
        var plane = getPlane(planeInput.value);

        resetOrderForm();
    }
);*/
resetOrderForm = function(){
    orderForm.reset();
    nextPointsList.innerHTML = "";
    for(i=4; i<7; i++){
        ordersField.children[i].setAttribute("disabled", "disabled");
    }
}


newDirectInput.addEventListener(
    'click',
    function(event){
        event.stopPropagation();
        nextPointsList.style.display = "block";
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
        nextPointsList.style.display = "none"
        orderNamesList.style.display = "none";
    }
);

function planeCrash(plane){
    var planeId = planeNames.indexOf(plane.name);
    screenElt.removeChild(document.getElementById(plane.name));
    planeNames.splice(planeId, 1);
    planesList.splice(planeId, 1);
    orderNamesList.removeChild(orderNamesList.children[planeId]);
    if (orderNamesList.childElementCount == 0){
        ordersField.setAttribute("disabled","disabled");
    }
}

function updateList(plane){
    ordersField.removeAttribute("disabled");
    var orderNamesList = document.getElementById('orderNames')
    var nextPointsList = document.getElementById('directpoints');
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
    nextDirect = [];
    nextPointsList.innerHTML = "";
    var nextPoints = plane.route.pointsList
    for (i=plane.step + 1; i < nextPoints.length; i++){
        var newPoint = document.createElement('li');
        newPoint.textContent = nextPoints[i].name;
        nextDirect.push(nextPoints[i].name);
        newPoint.addEventListener(
            'click',
            function(event){
                newDirectInput.value = event.target.textContent;
            }
        );
        nextPointsList.appendChild(newPoint);
    }
    return nextPoints[plane.step+1].name
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
function getPlane(planeName){
    return planesList[planeNames.indexOf(planeName)]
}

//middle click default
document.addEventListener('mousedown', function(event){
    if (event.button==1){event.preventDefault();}
});
//right click default
document.body.addEventListener('contextmenu', event => event.preventDefault());
