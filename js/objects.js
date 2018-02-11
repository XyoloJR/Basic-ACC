//Points definition expressed in px coordinates
var ATN = {name: "ATN", x:1237, y:207};
var BIELA = {name: "BIELA", x:3322, y:1045, dir: "toBiela"};
var BOSUA = {name: "BOSUA", x:2486, y:1321, dir: "toBosua"};
var BURGO = {name: "BURGO", "x":1340, "y":383};
var CFA = {name: "CFA", "x":751, "y":866, dir: "toCfa"};
var ETORI = {name: "ETORI", "x":755, "y":1893, dir: "toEtori"};
var FRI = {name: "FRI", "x":2514, "y":106};
var GAI = {name: "GAI", "x":165, "y":2088, dir: "toGai"};
var GRENA = {name: "GRENA", "x":2056, "y":1463, dir: "toGrena"};
var JAMBI = {name: "JAMBI", "x":2500, "y":2186, dir: "toJambi"};
var JUVEN = {name: "JUVEN", "x":2841, "y":1203};
var LANZA = {name: "LANZA", "x":973, "y":1457, dir: "toLanza"};
var LIMAN = {name: "LIMAN", "x":1842, "y":661};
var LSE = {name: "LSE", "x":1615, "y":848, dir: "toLse"};
var LTP = {name: "LTP", "x":1779, "y":1014, dir: "toLtp"};
var MAJOR = {name: "MAJOR", "x":1554 , "y":2093, dir: "toMajor"};//distance controled
var MELKA = {name: "MELKA", "x":2269, "y":309};
var MEN = {name: "MEN", "x":774, "y":1646, dir: "toMen"};
var MINDI = {name: "MINDI", "x":1163, "y":1277, dir: "toMindi"};
var MOZAO = {name: "MOZAO", "x":2086, "y":765, dir: "toMozao"};
var MTL = {name: "MTL", "x":1524, "y":1639, dir: "toMtl"};
var RAPID = {name: "RAPID", "x":2723, "y":250, dir: "toRapid"};
var SANTO = {name: "SANTO", "x":2265, "y":1803, dir: "toSanto"};
var SEVET = {name: "SEVET", "x":2401, "y":512};
var SICIL = {name: "SICIL", "x":3030, "y":2482};
var SPIDY = {name: "SPIDY", "x":996, "y":1814, dir: "toSpidy"};
var VULCA = {name: "VULCA", "x":707, "y":616, dir: "toVulca"};
//pseudo points for alternativ entry for UN1 and UN64
var MINOR = {name: "", x:1569, y:2322};
var UM3MID = {name: "", x: 1469, y: 1584};
var UM4MID = {name: "", x:1910, y: 1179};
var UN1MID = {name: "", x:1721, y:1249};
var UN2MID = {name: "", x:1400, y:1052};
var UN64MID = {name: "", x:1741, y:1567};
var UN13MID = {name: "", x:1334, y:1449};

var POINTS = [ATN, BIELA, BOSUA, BURGO, CFA, ETORI, FRI, GAI, GRENA, JAMBI, JUVEN,
                    LANZA, LIMAN, LSE, LTP, MAJOR, MELKA, MEN, MINDI, MOZAO, MTL,
                    RAPID, SANTO, SEVET, SICIL, SPIDY, VULCA];


function pxDist(point1, point2){
    return Math.sqrt((point1.x - point2.x)**2 + (point1.y - point2.y)**2);
}

function Route(name, display, anims, exitInfos, halfWay, passPoints){
    this.anims = anims;
    this.defaultDisplay = display;
    this.exit = exitInfos;
    this.halfWay = halfWay;
    this.name = name;
    this.pointsList = passPoints;
    this.steps = anims.length - 1;
}

var UM3 = new Route(
    "UM3",
    "top",
    [{name: "toMtl", dist: pxDist(SICIL, MTL), heading : 299, angle: "-16deg"},
    {name: "toMindi", dist: pxDist(MTL, MINDI), heading : 315, angle: "0deg"},
    {name: "toCfa", dist: pxDist(MINDI, CFA), heading : 315, angle: "0deg"},
    {name: "toVulca", dist: pxDist(CFA, VULCA), heading : 350, angle:"35deg"}],
    {point:"CFA",sector:"N3"},
    pxDist(SICIL, MTL) + pxDist(MTL, UM3MID),

    [SICIL, MTL, MINDI, CFA, VULCA]
);
var UM4 = new Route(
    "UM4",
    "left",
    [{name: "toLse", dist: pxDist(ATN, LSE), heading: 149, angle: "14deg"},
    {name: "toLtp", dist: pxDist(LSE, LTP), heading: 133, angle: "-2deg"},
    {name: "toGrena", dist: pxDist(LTP, GRENA), heading: 148, angle: "13deg"},
    {name: "toSanto", dist: pxDist(GRENA, SANTO), heading: 148, angle: "13deg"},
    {name: "toJambi", dist: pxDist(SANTO, JAMBI), heading: 148, angle: "13deg"}],
    {point:"SANTO", sector:"I"},
    pxDist(JAMBI, UM4MID),
    [ATN, LSE, LTP, GRENA, SANTO, JAMBI]
);
var UN1 = new Route(
    "UN1",
    "bottom",
    [{name: "toMtl", dist :pxDist(MINOR, MTL), heading: 357, angle: "-42deg"},
    {name: "toLtp", dist :pxDist(MTL, LTP), heading: 23, angle: "-22deg"},
    {name: "toMozao", dist :pxDist(LTP, MOZAO), heading: 51, angle: "6deg"},
    {name: "toRapid", dist :pxDist(MOZAO, RAPID), heading: 51, angle: "6deg"}],
    {point:"SEVET", sector:"G2"},
    pxDist(MINOR, MTL) + pxDist(MTL, UN1MID),
    [MINOR, MTL, LTP, MOZAO, RAPID]
);
var UN2 = new Route(
    "UN2",
    "bottom",
    [{name: "toLse", dist :pxDist(FRI, LSE), heading: 231, angle: "6deg"},
    {name: "toMindi", dist :pxDist(LSE, MINDI), heading: 226, angle: "1deg"},
    {name: "toLanza", dist :pxDist(MINDI, LANZA), heading: 226, angle: "1deg"},
    {name: "toMen", dist :pxDist(LANZA, MEN), heading: 226, angle: "1deg"},
    {name: "toGai", dist :pxDist(MEN, GAI), heading: 234, angle: "9deg"}],
    {point:"MEN", sector:"OS"},
    pxDist(FRI, LSE) + pxDist(LSE, UN2MID),
    [FRI, LSE, MINDI, LANZA, MEN, GAI],
);
var UN64EO = new Route(
    "UN64EO",
    "bottom",
    [{name: "toGrena", dist :pxDist(BIELA, GRENA), heading: 252, angle: "27deg"},
    {name: "toMtl", dist :pxDist(GRENA, MTL), heading: 252, angle: "27deg"},
    {name: "toSpidy", dist :pxDist(MTL, SPIDY), heading: 252, angle: "27deg"},
    {name: "toGai", dist :pxDist(SPIDY, GAI), heading: 252, angle: "27deg"}],
    {point:"ETORI", sector:"OS"},
    pxDist(BIELA, UN64MID),
    [BIELA, GRENA, MTL, SPIDY, GAI]
);
var UN64OE = new Route(
    "UN64OE",
    "bottom",
    [{name: "toMtl", dist :pxDist(GAI, MTL), heading: 72, angle: "27deg"},
    {name:"toGrena", dist :pxDist(MTL, GRENA), heading: 72, angle: "27deg"},
    {name:"toBosua", dist :pxDist(GRENA, BOSUA), heading: 72, angle: "27deg"},
    {name:"toBiela", dist :pxDist(BOSUA, BIELA), heading: 72, angle: "27deg"}],
    {point:"JUVEN", sector:"M2"},
    pxDist(GAI, UN64MID),
    [GAI, MTL, GRENA, BOSUA, BIELA]
);
var UN13 = new Route(
    "UN13",
    "left",
    [{name: "toMtl", dist :pxDist(MINOR, MTL), heading: 357, angle: "-42deg"},
    {name: "toMindi", dist: pxDist(MTL, MINDI), heading : 315, angle: "0deg"},
    {name: "toCfa", dist: pxDist(MINDI, CFA), heading : 315, angle: "0deg"},
    {name: "toVulca", dist: pxDist(CFA, VULCA), heading : 350, angle:"35deg"}],
    {point:"CFA",sector:"N3"},
    pxDist(MINOR, MTL) + pxDist(MTL, UN13MID),
    [MINOR, MTL, MINDI, CFA, VULCA]
)

var ROUTES = [UM3, UM4, UN1, UN2, UN64EO, UN64OE, UN13]




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
