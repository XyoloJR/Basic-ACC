//Points definition
var sicil = {"x":1270, "y":1039};
var jambi = {"x":1047, "y":914};
var mtl = {"x":636, "y":684};
var mindi = {"x":483, "y":531};
var cfa = {"x":309, "y":357};
var vulca = {"x":291, "y":253};
var atn = {"x":514, "y":80};
var burgo = {"x":458, "y":155};
var lse = {"x":674, "y":350};
var ltp = {"x":743, "y":421};
var grena = {"x":860, "y":610};
var santo = {"x":949, "y":753};
var fri = {"x":1053, "y":39};
var melka = {"x":949, "y":123};
var liman = {"x":769, "y":271};
var lanza = {"x":404, "y":612};
var men = {"x":319, "y":687};
var gai = {"x":62, "y":873};
//to calculate
var major ;
var mozao = {"x":873, "y":315};
var sevet = {"x":1005, "y":209};
var rapid = {"x":1141, "y":98};
var juven = {"x":1191, "y":500};
var bosua = {"x":1041, "y":549};
var spidy = {"x":413, "y":757};
var etori = {"x":311,"y":791};

function Route(start, passPoints){
    this.startPoint = start;
    this.passPoints = passPoints;
}

var UM3 = new Route(sicil, [jambi, mtl, mindi, cfa, vulca]);
var UM4 = new Route(atn, [burgo, lse, ltp, grena, santo, jambi]);
var UN1 = new Route(major, [mtl, ltp, mozao, sevet, rapid]);
var UN2 = new Route(fri, [melka, liman, lse, mindi, lanza, men, gai]);
//need start/end point further than juven
var UN64EO = new Route(juven,[bosua, grena, mtl, spidy, etori, gai]);
var UN64OE = new Route(gai, [etori, spidy, mtl, grena, bosua, juven]);

var routes = [UM3, UM4, UN1, UN2, UN64OE, UN64EO]

function Point (x, y){
        this.x = x;
        this.y = y;
}

function putPlane(plane, point){
    plane.style.left = point.x + "px";
    plane.style.top = point.y + "px";
}

var planeElt = document.getElementById('planeName');
putPlane(planeElt,ltp);
//planeElt.style.left = sicil.x + "px";
//planeElt.style.top = sicil.y + "px";*/

/*
Avion = {
    name
    route
    fl
    speed
    nextPoint
    Position
}*/
