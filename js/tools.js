var PANELWIDTH = 80;
var panelElt = document.body.firstElementChild;
var vector3Button = panelElt.firstElementChild;
var vector6Button = panelElt.children[1];
var vector9Button = panelElt.children[2];
var mesureButton = panelElt.children[3];

var vectorsDisplayed = false;
vector3Button.addEventListener("click", function(){
    if (vectorsDisplayed){
        removeVectors();
    } else {
        displayV(0);
    }
    vectorsDisplayed = !vectorsDisplayed;
});
vector6Button.addEventListener("click", function(){
    if (vectorsDisplayed){
        removeVectors();
    } else {
        displayV(1);
    }
    vectorsDisplayed = !vectorsDisplayed;
});
vector9Button.addEventListener("click", function(){
    if (vectorsDisplayed){
        removeVectors();

    } else {
        displayV(2);
    }
    vectorsDisplayed = !vectorsDisplayed;
});

removeVectors = function(){
    planesList.forEach(function(plane){
        plane.vectorDisp = false
        if (plane.warning){
            plane.displayVector(3);
        } else{
            plane.removeVector();
        }
    });
    for(i=0; i<3; i++){
        panelElt.children[i].style.backgroundColor = "#DDDDDD";
        panelElt.children[i].style.color = "#000000";
    }
}
displayV = function(buttonId){
    var minutes = 3 *(buttonId + 1);
    planesList.forEach(function(plane){
        plane.vectorDisp = true;
        plane.displayVector(minutes);
    });
    panelElt.children[buttonId].style.backgroundColor = "#777777";
    panelElt.children[buttonId].style.color = "#FFFFFF";
}
var mesuring = false;
mesureButton.addEventListener('click', function(event){
    mesuring = !mesuring;
    var color = ""
    var radarScreen = document.body.children[1];
    if (mesuring){
        mesureButton.style.backgroundColor = "#777777";
        mesureButton.style.color = "#FFFFFF";
        color = 'White';
        radarScreen.addEventListener('click', mesure);
    } else {
        mesureButton.style.backgroundColor = "#DDDDDD";
        mesureButton.style.color = "#000000";
        removeMesures();
    }
    mesureButton.firstElementChild.src = "../img/compass"+color+".png";
});
var mesuresTable = [];
var mesurePoint1 = {x:0,y:0};
var mesurePoint2 = {x:0,y:0};
mesure = function(event){
    if (mesurePoint1.x == 0){
        mesurePoint1.x = event.pageX - 80;
        mesurePoint1.y = event.pageY;
    } else {
        mesurePoint2.x = event.pageX - 80;
        mesurePoint2.y = event.pageY;
        var segment = createVector(mesurePoint1, mesurePoint2, "white", 2);
        console.log(segment.width, segment.height);
        var dist = Math.round(pxDist(mesurePoint1, mesurePoint2)/NmToPx);
        var heading = getHeadingTo(mesurePoint1, mesurePoint2);
        var label = document.createElement('div');
        label.className = "mesureLabel";
        distElt = document.createElement('p');
        distElt.textContent = dist + ' Nm';
        headingElt = document.createElement('p');
        headingElt.textContent = heading + '°';
        label.appendChild(distElt);
        label.appendChild(headingElt);
        label.style.top = Math.max(mesurePoint1.y, mesurePoint2.y) + 5 + "px";
        label.style.left = (mesurePoint1.x + mesurePoint2.x - 80)/2 + "px";
        console.log(label);
        mesuresTable.push(segment,label);
        var radarScreen = document.body.children[1];
        radarScreen.appendChild(segment);
        radarScreen.appendChild(label)
        console.log(mesurePoint1, mesurePoint2, heading);
        mesurePoint1 = {x:0,y:0};
        mesurePoint2 = {x:0,y:0};

    }
}

removeMesures = function(){
    mesuresTable.forEach(elt => document.body.children[1].removeChild(elt));
    mesuresTable = [];
    document.body.children[1].removeEventListener('click', mesure);
}
