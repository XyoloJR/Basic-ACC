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

removeMesures = function(){

}
