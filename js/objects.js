//Points definition expressed in px coordinates
var gai = {"x":165, "y":2088};
var etori = {"x":755, "y":1893};
var men = {"x":774, "y":1646};
var cfa = {"x":751, "y":866};
var vulca = {"x":707, "y":616};
var spidy = {"x":996, "y":1814};
var lanza = {"x":973, "y":1457};
var mindi = {"x":1163, "y":1277};
var major = {"x":1554 , "y":2093};//distance controled
var mtl = {"x":1524, "y":1639};
var ltp = {"x":1779, "y":1014};
var lse = {"x":1615, "y":848};
var burgo = {"x":1340, "y":383};
var atn = {"x":1237, "y":207};
var liman = {"x":1842, "y":661};
var melka = {"x":2269, "y":309};
var fri = {"x":2514, "y":106};
var rapid = {"x":2723, "y":250};
var sevet = {"x":2401, "y":512};
var mozao = {"x":2086, "y":765};
var grena = {"x":2056, "y":1463};
var bosua = {"x":2486, "y":1321};
var juven = {"x":2841, "y":1203};
var santo = {"x":2265, "y":1803};
var jambi = {"x":2500, "y":2186};
var sicil = {"x":3030, "y":2482};



//conversion factor
var NmToPx = 10.84;
function pxDist(point1, point2){
    return Math.sqrt((point1.x - point2.x)**2 + (point1.y - point2.y)**2);
}

function Route(start, passPoints){
    this.startPoint = start;
    this.passPoints = passPoints;
}

var UM3 = new Route(sicil, [jambi, mtl, mindi, cfa, vulca]);
var UM4 = new Route(atn, [burgo, lse, ltp, grena, santo, jambi]);
var UN1 = new Route(major, [mtl, ltp, mozao, sevet, rapid]);
var UN2 = new Route(fri, [melka, liman, lse, mindi, lanza, men, gai]);
//may need start/end point further than juven
var UN64EO = new Route(juven,[bosua, grena, mtl, spidy, etori, gai]);
var UN64OE = new Route(gai, [etori, spidy, mtl, grena, bosua, juven]);

var routes = [UM3, UM4, UN1, UN2, UN64OE, UN64EO]


function Plane(name, route,fl,speed, nextPoint, startPoint){
    this.name = name;
    this.route = route;
    this.fl = fl;
    this.speed = speed;
    this.nextPoint = nextPoint;
    this.startPoint = startPoint;
}

/*
//distance tests
//Scaling Points, distance 240Nm
var ouestPoint= {"x":295, "y":2045};
var eastPoint= {"x":2764 , "y":1231};
console.log(pxDist(ouestPoint, eastPoint)/240);
//based on etori-bosua, distance 164Nm
console.log(pxDist(etori, grena)/126, pxDist(mtl, grena)/52,
            pxDist(mtl, ltp)/62, pxDist(lse, mindi)/57,
            pxDist(ltp, grena)/49, pxDist(mtl, cfa)/100,
);


//mtl-major px distance
console.log(42*NmToPx);
console.log(pxDist(major,mtl));
*/
