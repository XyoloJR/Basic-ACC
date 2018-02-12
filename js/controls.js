
var planesList= [];
var planeNames= [];
var screenElt = document.getElementById('mainScreen');
var DialogElt = document.getElementById('dialogBox');

var newFlForm = document.forms.fl;
var flChangeField = newFlForm.firstElementChild;
var newFLInput = newFlForm.newfl;
var flPlaneInput = newFlForm.planeName;

var planeOrderForm = document.forms.heading;
var ctrlChangeField = planeOrderForm.firstElementChild;
var ctrlPlaneInput = document.getElementById('ctrlplane');
var ctrlNamesList = document.getElementById('ctrlnames');
var newHeadInput = document.getElementById('newhead');
var newDirectInput = document.getElementById('newdirect');
var fieldElts = [flChangeField, ctrlChangeField];

var launchForm = document.forms.launch;

planeOrderForm.reset();
newFlForm.reset();
launchForm.reset();

//create a Plane and put on screen the corresponding Element
//from the launch form values
launchForm.addEventListener(
    'submit',
    function (event){
        event.preventDefault();
        nameGiven = launchElt["name"].value.toUpperCase();
        if (!(planeNames.indexOf(nameGiven)<0)){
            dial("!!!---AVION DEJA EN VOL---!!!", "darkred",2000)
        } else {
            var plane = new Plane(
                launchElt.fl.valueAsNumber,
                launchElt.fl.valueAsNumber,
                ROUTES[launchElt["route"].selectedIndex],
                launchElt["state"].checked,
                nameGiven,
                launchElt["kts"].valueAsNumber,
            );
            updateLists(plane, -1);//-1 means new plane see updateLists
            createPlaneElt(plane);
            animPlane(plane);
            screenElt.appendChild(plane.elt);
            dial(plane.name + " on air", "darkgreen", 3000)
        }
});


planeOrderForm.headingConfirm.addEventListener(
    'click',
    function(event){
        event.preventDefault();
        var plane = getPlane(ctrlPlaneInput.value);
        plane.freeze();
        turnTo(plane, newHeadInput.valueAsNumber);
        dial(plane.name + " heading to " + newHeadInput.valueAsNumber + "°", "darkgreen", 3000);
        planeOrderForm.reset();
        planeOrderForm.headingConfirm.setAttribute("disabled", "disabled");
        planeOrderForm.directConfirm.setAttribute("disabled", "disabled");
    }
);

planeOrderForm.directConfirm.addEventListener(
    'click',
    function(event){
        event.preventDefault();
        var plane = getPlane(ctrlPlaneInput.value);
        if (!plane.autopilot){
            plane.freeze();
            animPlane(plane);
        }
        dial(plane.name + " resume its route to "+ ctrlPlaneInput.value, "darkgreen", 3000);
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

function getPlane(planeName){
    return planesList[planeNames.indexOf(planeName)]
}



newFlForm.addEventListener(
    'submit',
    function(event){
        event.preventDefault();
        var message = climbTo(getPlane(flPlaneInput.value), newFLInput.valueAsNumber);
        dial(message, "darkgreen", 4000);
        newFlForm.reset();
});


var flNamesList = flChangeField.children['flnames'];
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
    }
)
//middle click default
document.addEventListener('mousedown', function(event){
    if (event.button==1){event.preventDefault();}
});
//right click default
screenElt.addEventListener('contextmenu', event => event.preventDefault());

document.addEventListener(
    'click',
    function(event){
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
                newDirectInput.value = plane.route.pointsList[plane.step+1].name
                planeOrderForm.headingConfirm.removeAttribute("disabled");
                planeOrderForm.directConfirm.removeAttribute("disabled");
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

function disenableElts(Elts){
    if (Elts[0].hasAttribute("disabled")){
        Elts.forEach(function(Elt){Elt.removeAttribute("disabled");});
    } else {
        Elts.forEach(function(Elt){Elt.setAttribute("disabled", "disabled");});
    }
}
