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
