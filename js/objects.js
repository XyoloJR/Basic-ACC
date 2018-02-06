//Points definition expressed in px coordinates
var ATN = {x:1237, y:207};
var BIELA = {x:3322, y:1045, dir: "toBiela"};
var BOSUA = {x:2486, y:1321, dir: "toBosua"};
var BURGO = {"x":1340, "y":383};
var CFA = {"x":751, "y":866, dir: "toCfa"};
var ETORI = {"x":755, "y":1893, dir: "toEtori"};
var FRI = {"x":2514, "y":106};
var GAI = {"x":165, "y":2088, dir: "toGai"};
var GRENA = {"x":2056, "y":1463, dir: "toGrena"};
var JAMBI = {"x":2500, "y":2186, dir: "toJambi"};
var JUVEN = {"x":2841, "y":1203};
var LANZA = {"x":973, "y":1457, dir: "toLanza"};
var LIMAN = {"x":1842, "y":661};
var LSE = {"x":1615, "y":848, dir: "toLse"};
var LTP = {"x":1779, "y":1014, dir: "toLtp"};
var MAJOR = {"x":1554 , "y":2093};//distance controled
var MELKA = {"x":2269, "y":309};
var MEN = {"x":774, "y":1646, dir: "toMen"};
var MINDI = {"x":1163, "y":1277, dir: "toMindi"};
var MOZAO = {"x":2086, "y":765, dir: "toMozao"};
var MTL = {"x":1524, "y":1639, dir: "toMtl"};
var RAPID = {"x":2723, "y":250, dir: "toRapid"};
var SANTO = {"x":2265, "y":1803, dir: "toSanto"};
var SEVET = {"x":2401, "y":512};
var SICIL = {"x":3030, "y":2482};
var SPIDY = {"x":996, "y":1814, dir: "toSpidy"};
var VULCA = {"x":707, "y":616, dir: "toVulca"};
//pseudo points for alternativ entry for UN1 and UN64
var MINOR = {x:1569, y:2322};
var UM3MID = {x: 1469, y: 1584};
var UM4MID = {x:1910, y: 1179};
var UN1MID = {x:1721, y:1249};
var UN2MID = {x:1400, y:1052};
var UN64MID = {x:1741, y:1567};

var POINTS = [ATN, BIELA, BOSUA, BURGO, CFA, ETORI, FRI, GAI, GRENA, JAMBI, JUVEN,
                    LANZA, LIMAN, LSE, LTP, MAJOR, MELKA, MEN, MINDI, MOZAO, MTL,
                    RAPID, SANTO, SEVET, SICIL, SPIDY, VULCA];

//conversion factor
var NmToPx = 10.84;
function pxDist(point1, point2){
    return Math.sqrt((point1.x - point2.x)**2 + (point1.y - point2.y)**2);
}

function Route(start, exitInfos, halfWay, passPoints, anims){
    this.startPoint = start;
    this.exit = exitInfos
    this.passPoints = passPoints;
    this.anims = anims;
    this.halfWay = halfWay
}

var UM3 = new Route(
    SICIL,
    {point:"CFA",sector:"N3"},
    pxDist(SICIL, MTL) + pxDist(MTL, UM3MID),
    [MTL, MINDI, CFA, VULCA],
    [{name: "toMtl", dist: pxDist(SICIL, MTL), angle: "-16deg"},
    {name: "toCfa", dist: pxDist(MTL, CFA), angle: "0deg"},
    {name: "toVulca", dist: pxDist(CFA, VULCA), angle:"35deg"}]
);
var UM4 = new Route(
    ATN,
    {point:"SANTO", sector:"I"},
    pxDist(ATN, LSE) + pxDist(LSE, UM4MID),
    [LSE, LTP, GRENA, SANTO, JAMBI],
    [{name: "toLse", dist: pxDist(ATN, LSE), angle: "14deg"},
    {name: "toLtp", dist: pxDist(LSE, LTP), angle: "-2deg"},
    {name: "toJambi", dist: pxDist(LTP, JAMBI), angle: "13deg"}]
);
var UN1 = new Route(
    MAJOR,
    {point:"SEVET", sector:"G2"},
    pxDist(MAJOR, MTL) + pxDist(MTL, UN1MID),
    [MTL, LTP, MOZAO, RAPID],
    [{name: "toMtl", dist :pxDist(MAJOR, MTL), angle: "-42deg"},
    {name: "toLtp", dist :pxDist(MTL, LTP), angle: "-22deg"},
    {name: "toRapid", dist :pxDist(LTP, RAPID), angle: "6deg"}]
);
var UN2 = new Route(
    FRI,
    {point:"MEN", sector:"OS"},
    pxDist(FRI, LSE) + pxDist(LSE, UN2MID),
    [LSE, MINDI, LANZA, MEN, GAI],
    [{name: "toLse", dist :pxDist(FRI, LSE), angle: "6deg"},
    {name: "toMen", dist :pxDist(LSE, MEN), angle: "1deg"},
    {name: "toGai", dist :pxDist(MEN, GAI), anlge: "9deg"}]
);
var UN64EO = new Route(
    BIELA,
    {point:"ETORI", sector:"OS"},
    pxDist(BIELA, UN64MID),
    [GRENA, MTL, SPIDY, GAI],
    [{name: "toMtl", dist :pxDist(BIELA, MTL), angle: "27deg"},
    {name: "toGai", dist :pxDist(MTL, GAI), angle: "27deg"}]
);
var UN64OE = new Route(
    GAI,
    {point:"JUVEN", sector:"M2"},
    pxDist(GAI, UN64MID),
    [MTL, GRENA, BOSUA, BIELA],
    [{name: "toMtl", dist :pxDist(GAI, MTL), angle: "27deg"},
    {name:"toBiela", dist :pxDist(MTL, BIELA), angle: "27deg"}]
);

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
