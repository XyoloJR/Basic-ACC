//Points definition expressed in px coordinates
var GAI = {"x":165, "y":2088};
var ETORI = {"x":755, "y":1893};
var MEN = {"x":774, "y":1646};
var CFA = {"x":751, "y":866};
var VULCA = {"x":707, "y":616};
var SPIDY = {"x":996, "y":1814};
var LANZA = {"x":973, "y":1457};
var MINDI = {"x":1163, "y":1277};
var MAJOR = {"x":1554 , "y":2093};//distance controled
var MTL = {"x":1524, "y":1639};
var LTP = {"x":1779, "y":1014};
var LSE = {"x":1615, "y":848};
var BURGO = {"x":1340, "y":383};
var ATN = {"x":1237, "y":207};
var LIMAN = {"x":1842, "y":661};
var MELKA = {"x":2269, "y":309};
var FRI = {"x":2514, "y":106};
var RAPID = {"x":2723, "y":250};
var SEVET = {"x":2401, "y":512};
var MOZAO = {"x":2086, "y":765};
var GRENA = {"x":2056, "y":1463};
var BOSUA = {"x":2486, "y":1321};
var JUVEN = {"x":2841, "y":1203};
var SANTO = {"x":2265, "y":1803};
var JAMBI = {"x":2500, "y":2186};
var SICIL = {"x":3030, "y":2482};
//pseudo points for alternativ entry for UN1 and UN64
var BIELA = {"x":3322, "y":1045};
var MINOR = {"x":1569, "y":2322};

var POINTS = [ATN, BIELA, BOSUA, BURGO, CFA, ETORI, FRI, GAI, GRENA, JAMBI, JUVEN,
                    LANZA, LIMAN, LSE, LTP, MAJOR, MELKA, MEN, MINDI, MOZAO, MTL,
                    RAPID, SANTO, SEVET, SICIL, SPIDY, VULCA];

//conversion factor
var NmToPx = 10.84;
function pxDist(point1, point2){
    return Math.sqrt((point1.x - point2.x)**2 + (point1.y - point2.y)**2);
}

function Route(start, passPoints){
    this.startPoint = start;
    this.passPoints = passPoints;
}

var UM3 = new Route(SICIL, [JAMBI, MTL, MINDI, CFA, VULCA]);
var UM4 = new Route(ATN, [BURGO, LSE, LTP, GRENA, SANTO, JAMBI]);
var UN1 = new Route(MAJOR, [MTL, LTP, MOZAO, SEVET, RAPID]);
var UN2 = new Route(FRI, [MELKA, LIMAN, LSE, MINDI, LANZA, MEN, GAI]);
var UN64EO = new Route(JUVEN, [BOSUA, GRENA, MTL, SPIDY, ETORI, GAI]);
var UN64OE = new Route(GAI, [ETORI, SPIDY, MTL, GRENA, BOSUA, JUVEN]);

var ROUTES = [UM3, UM4, UN1, UN2, UN64EO, UN64OE]




/*
//distance tests
//Scaling Points, distance 240Nm
var ouestPoint= {"x":295, "y":2045};
var eastPoint= {"x":2764 , "y":1231};
console.log(pxDist(ouestPoint, eastPoint)/240);
//based on etori-BOSUA, distance 164Nm
console.log(pxDist(ETORI, GRENA)/126, pxDist(MTL, GRENA)/52,
            pxDist(MTL, LTP)/62, pxDist(LSE, MINDI)/57,
            pxDist(LTP, GRENA)/49, pxDist(MTL, CFA)/100,
);


//MTL-MAJOR px distance
console.log(42*NmToPx);
console.log(pxDist(MAJOR,MTL));
*/
