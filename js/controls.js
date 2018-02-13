
var planesList= [];
var planeNames= [];
var screenElt = document.getElementById('mainScreen');
var panelElt = document.body.firstElementChild;
var vector3Button = panelElt.firstElementChild;
var vector6Button = panelElt.children[1];
var vector9Button = panelElt.children[2];

var DialogElt = document.getElementById('dialogBox');

var newFlForm = document.forms.fl;
var flChangeField = newFlForm.firstElementChild;
var newFLInput = newFlForm.newfl;
var flPlaneInput = newFlForm.planeName;

var planeOrderForm = document.forms.heading;
var ctrlChangeField = planeOrderForm.firstElementChild;
var ctrlPlaneInput = document.getElementById('ctrlplane');
var newHeadInput = document.getElementById('newhead');
var newDirectInput = document.getElementById('newdirect');

var headindField = ctrlChangeField.children[1];
var directField = ctrlChangeField.lastElementChild

var fieldElts = [flChangeField, ctrlChangeField];

var launchForm = document.forms.launch;

var ctrlNamesList = document.getElementById('ctrlnames');
var flNamesList = flChangeField.children['flnames'];
var nextPointsList = document.getElementById('directpoints');

planeOrderForm.reset();
newFlForm.reset();
launchForm.reset();

//create a Plane and put on screen the corresponding Element
//from the launch form values
launchForm.addEventListener(
    'submit',
    function (event){
        event.preventDefault();
        nameGiven = launchForm["name"].value.toUpperCase();
        if (!(planeNames.indexOf(nameGiven)<0)){
            dial("!!!---AVION DEJA EN VOL---!!!", "darkred",2000)
        } else {
            var plane = new Plane(
                launchForm.fl.valueAsNumber,
                launchForm.fl.valueAsNumber,
                ROUTES[launchForm["route"].selectedIndex],
                launchForm["state"].checked,
                nameGiven,
                launchForm["kts"].valueAsNumber,
            );
            updateLists(plane, -1);//-1 means new plane see updateLists
            createPlaneElt(plane);
            animPlane(plane);
            screenElt.appendChild(plane.elt);
            dial(plane.name + " on air", "darkgreen", 3000)
        }
});
var vectorsDisplayed = false;
vector3Button.addEventListener("click", function(){
    if (vectorsDisplayed) {
        removeVectors()
    } else {
        displayV(0);
    }
    vectorsDisplayed = !vectorsDisplayed;
});
vector6Button.addEventListener("click", function(){
    if (vectorsDisplayed) {
        removeVectors();
    } else {
        displayV(1);
    }
    vectorsDisplayed = !vectorsDisplayed;
});
vector9Button.addEventListener("click", function(){
    if (vectorsDisplayed) {
        removeVectors();
    } else {
        displayV(2);
    }
    vectorsDisplayed = !vectorsDisplayed;
});
removeVectors = function(){
    planesList.forEach(function(plane){
        var vectElt = document.getElementById(plane.name + "vect");
        plane.elt.removeChild(vectElt);
    });
    for(i=0; i<3; i++){
        panelElt.children[i].style.backgroundColor = "#DDDDDD";
        panelElt.children[i].style.color = "#000000";
    }
}
displayV = function(buttonId){
    var minutes = 3 *(buttonId + 1);
    planesList.forEach(plane => plane.displayVector(minutes));
    panelElt.children[buttonId].style.backgroundColor = "#777777";
    panelElt.children[buttonId].style.color = "#FFFFFF";
}

planeOrderForm.headingConfirm.addEventListener(
    'click',
    function(event){
        event.preventDefault();
        var plane = getPlane(ctrlPlaneInput.value);
        if (plane.heading != newHeadInput.valueAsNumber){
            plane.freeze();
            message = turnTo(plane, newHeadInput.valueAsNumber);
            dial(message, "darkgreen", 3000);
            nextPointsList.innerHTML = "";
            planeOrderForm.reset();
            headingField = event.target.parentElement;
            headingField.setAttribute("disabled", "disabled");
            headingField.nextElementSibling.setAttribute("disabled", "disabled");
        }
    }
);

planeOrderForm.directConfirm.addEventListener(
    'click',
    function(event){
        event.preventDefault();
        var plane = getPlane(ctrlPlaneInput.value);
        if (!plane.autopilot){
            plane.step += nextDirect.indexOf(newDirectInput.value);
            plane.freeze();
            animPlane(plane);
            dial(plane.name + " resume its route to "+ newDirectInput.value, "darkgreen", 3000);
        } else {
            dial(plane.name + " already on route to " + plane.route.pointsList[plane.step + 1].name, "darkred", 2000);
        }
        nextPointsList.innerHTML = "";
        planeOrderForm.reset();
        directField = event.target.parentElement;
        directField.setAttribute("disabled", "disabled");
        directField.previousElementSibling.setAttribute("disabled", "disabled");
    }
);

function dial(message, color, msTime){
    DialogElt.textContent = message;
    DialogElt.style.color = color;
    setTimeout(function(){
                    DialogElt.textContent = "Status ok";
                    DialogElt.style.color = "black";
                }, msTime
    );
}



newFlForm.addEventListener(
    'submit',
    function(event){
        event.preventDefault();
        var message = climbTo(getPlane(flPlaneInput.value), newFLInput.valueAsNumber);
        dial(message, "darkgreen", 4000);
        newFlForm.reset();
});

newDirectInput.addEventListener(
    'click',
    function(event){
        event.stopPropagation();
        nextPointsList.style.display = "block";
        ctrlNamesList.style.display = "none";
    }
)
flPlaneInput.addEventListener(
    'click',
    function(event){
        event.stopPropagation();
        flNamesList.style.display = "block";
});

flPlaneInput.addEventListener(
    'keyup',
    function(event){
        event.stopPropagation();
    }
)

ctrlPlaneInput.addEventListener(
    'click',
    function(event){
        event.stopPropagation();
        ctrlNamesList.style.display = "block";
        nextPointsList.style.display = "none";
    }
);
//middle click default
document.addEventListener('mousedown', function(event){
    if (event.button==1){event.preventDefault();}
});
//right click default
screenElt.addEventListener('contextmenu', event => event.preventDefault());

document.addEventListener(
    'click',
    function(event){
        nextPointsList.style.display = "none"
        ctrlNamesList.style.display = "none";
        flNamesList.style.display = "none";
    }
);

function planeCrash(plane){
    var planeId = planeNames.indexOf(plane.name);
    updateLists(plane, planeId);
    screenElt.removeChild(document.getElementById(plane.name));
}

function updateLists(plane, planeId){
    var flNamesList = document.getElementById('flnames');
    var ctrlNamesList = document.getElementById('ctrlnames');
    var nextPointsList = document.getElementById('directpoints');
    if (planeId<0){
        if (planesList.length == 0){
            disenableElts(fieldElts);
        }
        planesList.push(plane);
        planeNames.push(plane.name);
        var newEntryFL = document.createElement('li');
        newEntryFL.textContent = plane.name;
        newEntryFL.addEventListener(
            'click',
            function(event){
                flPlaneInput.value = plane.name;
                newFLInput.value = plane.actualFL;
        });
        var newEntryCtrl = document.createElement('li');
        newEntryCtrl.textContent = plane.name;
        newEntryCtrl.addEventListener(
            'click',
            function(event){
                ctrlPlaneInput.value = plane.name;
                newHeadInput.value = plane.heading;
                createPointList(plane);
                changeHeadingField = newHeadInput.parentElement;
                changeHeadingField.removeAttribute("disabled");
                directField = changeHeadingField.nextElementSibling
                if (plane.autopilot){
                    directField.setAttribute("disabled", "disabled");
                } else {
                    directField.removeAttribute("disabled");
                }
            }
        )
        flNamesList.appendChild(newEntryFL);
        ctrlNamesList.appendChild(newEntryCtrl);
    } else {
        planeNames.splice(planeId, 1);
        planesList.splice(planeId, 1);
        flNamesList.removeChild(flNamesList.children[planeId]);
        ctrlNamesList.removeChild(ctrlNamesList.children[planeId]);
        if (flNamesList.childElementCount == 0){
            disenableElts(fieldElts);
        }
    }
}
var nextDirect = [];
createPointList = function(plane){
    nextDirect = [];
    nextPointsList.innerHTML = "";
    var nextPoints = plane.route.pointsList
    newDirectInput.value = nextPoints[plane.step+1].name
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
}

function disenableElts(Elts){
    if (Elts[0].hasAttribute("disabled")){
        Elts.forEach(function(Elt){Elt.removeAttribute("disabled");});
    } else {
        Elts.forEach(function(Elt){Elt.setAttribute("disabled", "disabled");});
    }
}

function getPlane(planeName){
    return planesList[planeNames.indexOf(planeName)]
}
