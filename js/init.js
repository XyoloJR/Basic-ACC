//CONSTANTS
var PLANE_SIZE = 7;//half icon size for less css migration
var timeFactor = 1;//possibility to speed up or down
var AUTONOMY = 508;//px distance for a given heading
var VECT_WIDTH = 3;//speed vector
var SEGMENT_WIDTH = 2;//mesuring segment
var LABELWIDTH = 80;
var NmToPx = 5.08;//conversion factor

console.log("timeFactor : x" + timeFactor);

//HTML Elements
var panelElt = document.body.firstElementChild;
var vector3Button = panelElt.firstElementChild;
var vector6Button = panelElt.children[1];
var vector9Button = panelElt.children[2];
var mesureButton = panelElt.children[3];

var screenElt = document.body.children[1];
var clockElt = screenElt.firstElementChild;

var orderForm = document.forms.order;
var ordersField = orderForm.firstElementChild;
    var planeInput = orderForm.planeName;

    var newFLInput = orderForm.newfl;
    var flButton = orderForm.flSubmit;
    var flField = newFLInput.parentElement;

    var newHeadInput = orderForm.heading;
    var headButton = orderForm.headSubmit;
    var headingField = newHeadInput.parentElement;

    var newDirectInput = orderForm.direct;
    var directButton = orderForm.directSubmit;
    var directField = newDirectInput.parentElement;

    var fieldList = [flField, headingField, directField];
var orderNamesList = document.getElementById('orderNames');
var directPointsElt = document.getElementById('directpoints');
var dialogElt = document.getElementById('dialogBox');
var launchForm = document.forms.launch;
var routeSelector = launchForm.route;
var alterStartInput = launchForm.alterStart;
var alterStartLine = alterStartInput.parentElement;
var flowBoard = document.getElementById('flow').firstElementChild;

orderForm.reset();
launchForm.reset();

//global variables
var vectorsDisplayed = false;
var mesuring = false;
var mesuresList = [];
var mesurePoint1 = {x:0,y:0};
var mesurePoint2 = {x:0,y:0};
var leftPanelWidth = panelElt.offsetWidth;

var planesList = [];
var planeNames = [];

var directPoints = [];
var directNames = [];
var submitOrder = "";
var zMin = -1;

//Points definition expressed in px coordinates
var ATN = {name: "ATN", x:509.13, y:96.96};
var BIELA = {name: "BIELA", x:1485.71, y:489.46, dir: "toBiela"};//differs from doc: lacking infos
var BOJOL = {name: "BOJOL", x:624, y:293}
var BOSUA = {name: "BOSUA", x:1094.15, y:618.74, dir: "toBosua"};
var BURGO = {name: "BURGO", "x":557.38, "y":179.39};
var CFA = {name: "CFA", "x":281.5, "y":405.62, dir: "toCfa"};
var ETORI = {name: "ETORI", "x":283.37, "y":886.65, dir: "toEtori"};
var FRI = {name: "FRI", "x":1107.26, "y":49.65};
var GAI = {name: "GAI", "x":6, "y":978, dir: "toGai"};
var GRENA = {name: "GRENA", "x":892.74, "y":685.25, dir: "toGrena"};
var JAMBI = {name: "JAMBI", "x":1100.7, "y":1023.89, dir: "toJambi"};
var JUVEN = {name: "JUVEN", "x":1260.42, "y":563.47};
var LANZA = {name: "LANZA", "x":385.48, "y":682.44, dir: "toLanza"};
var LIMAN = {name: "LIMAN", "x":792.51, "y":309.6};
var LSE = {name: "LSE", "x":686.18, "y":397.19, dir: "toLse"};
var LTP = {name: "LTP", "x":763, "y":474.94, dir: "toLtp"};
var MAJOR = {name: "MAJOR", "x":657.61 , "y":980.33, dir: "toMajor"};//distance controled
var MELKA = {name: "MELKA", "x":992.51, "y":144.73};
var MEN = {name: "MEN", "x":292.27, "y":770.96, dir: "toMen"};
var MINDI = {name: "MINDI", "x":474.47, "y":598.13, dir: "toMindi"};
var MOZAO = {name: "MOZAO", "x":906.79, "y":358.31, dir: "toMozao"};
var MTL = {name: "MTL", "x":643.56, "y":767.68, dir: "toMtl"};
var RAPID = {name: "RAPID", "x":1205.15, "y":117.1, dir: "toRapid"};
var SANTO = {name: "SANTO", "x":990.63, "y":844.5, dir: "toSanto"};
var SEVET = {name: "SEVET", "x":1054.33, "y":239.81};
var SICIL = {name: "SICIL", "x":1348.95, "y":1162.53};
var SPIDY = {name: "SPIDY", "x":396.25, "y":849.65, dir: "toSpidy"};
var VULCA = {name: "VULCA", "x":260.89, "y":288.52, dir: "toVulca"};
//pseudo points for alternative entry for UN1 and UN64
var MINOR = {name: "MINOR", x:664.64, y:1087.59};
var UM3MID = {name: "UM3MID", x: 617.8, y: 741.92};
var UM4MID = {name: "UM4MID", x:824.36, y: 552.22};
var UN1MID = {name: "UN1MID", x:735.83, y:585.01};
var UN2MID = {name: "UN2MID", x:585.48, y:492.74};
var UN64MID = {name: "UN64MID", x:745.2, y:733.96};
var UN13MID = {name: "UN13MID", x:554.57, y:678.69};

var POINTS = [ATN, BIELA, BOSUA, BURGO, CFA, ETORI, FRI, GAI, GRENA, JAMBI,
              JUVEN,LANZA, LIMAN, LSE, LTP, MAJOR, MELKA, MEN, MINDI, MOZAO,
              MTL, RAPID,SANTO, SEVET, SICIL, SPIDY, VULCA, MINOR, UM3MID,
              UM4MID, UN1MID,UN2MID, UN64MID, UN13MID];

function pxDist(point1, point2){
    return Math.sqrt((point1.x - point2.x)**2 + (point1.y - point2.y)**2);
}

function Route(name, display, anim, exitInfos, wayToHalf, passPoints, extraStart){
    this.defaultDisplay = display;
    this.exit = exitInfos;
    this.nextToHalf = wayToHalf;
    this.name = name;
    this.pointsList = passPoints;
    this.extraStart = extraStart
}

var UM3 = new Route(
    "UM3",
    "top",
    [{name: "toMtl", dist: pxDist(SICIL, MTL), heading : 299},
    {name: "toMindi", dist: pxDist(MTL, MINDI), heading : 315},
    {name: "toCfa", dist: pxDist(MINDI, CFA), heading : 315},
    {name: "toVulca", dist: pxDist(CFA, VULCA), heading : 350}],
    {point:"CFA",sector:"N3"},
    pxDist(MTL, UM3MID),
    [VULCA, CFA, MINDI, MTL, SICIL],
    JAMBI
);
var UM4 = new Route(
    "UM4",
    "left",
    [{name: "toLse", dist: pxDist(ATN, LSE), heading: 149},
    {name: "toLtp", dist: pxDist(LSE, LTP), heading: 133},
    {name: "toGrena", dist: pxDist(LTP, GRENA), heading: 148},
    {name: "toSanto", dist: pxDist(GRENA, SANTO), heading: 148},
    {name: "toJambi", dist: pxDist(SANTO, JAMBI), heading: 148}],
    {point:"SANTO", sector:"I"},
    pxDist(LSE, LTP) + pxDist(LTP, UM4MID),
    [JAMBI, SANTO, GRENA, LTP, LSE, ATN],
    BOJOL
);
var UN1 = new Route(
    "UN1",
    "bottom",
    [{name: "toMtl", dist :pxDist(MINOR, MTL), heading: 357},
    {name: "toLtp", dist :pxDist(MTL, LTP), heading: 23},
    {name: "toMozao", dist :pxDist(LTP, MOZAO), heading: 51},
    {name: "toRapid", dist :pxDist(MOZAO, RAPID), heading: 51}],
    {point:"SEVET", sector:"G2"},
    pxDist(MTL, UN1MID),
    [RAPID, MOZAO, LTP, MTL, MINOR],
    MAJOR
);
var UN2 = new Route(
    "UN2",
    "bottom",
    [{name: "toLse", dist :pxDist(FRI, LSE), heading: 231},
    {name: "toMindi", dist :pxDist(LSE, MINDI), heading: 226},
    {name: "toLanza", dist :pxDist(MINDI, LANZA), heading: 226},
    {name: "toMen", dist :pxDist(LANZA, MEN), heading: 226},
    {name: "toGai", dist :pxDist(MEN, GAI), heading: 234}],
    {point:"MEN", sector:"OS"},
    pxDist(LSE, UN2MID),
    [GAI, MEN, LANZA, MINDI, LSE, FRI],
    LIMAN
);
var UN64EO = new Route(
    "UN64EO",
    "top",
    [{name: "toGrena", dist :pxDist(BIELA, GRENA), heading: 252},
    {name: "toMtl", dist :pxDist(GRENA, MTL), heading: 252},
    {name: "toSpidy", dist :pxDist(MTL, SPIDY), heading: 252},
    {name: "toGai", dist :pxDist(SPIDY, GAI), heading: 252}],
    {point:"ETORI", sector:"OS"},
    pxDist(MTL, UN64MID),
    [GAI, SPIDY, MTL, GRENA, BIELA],
    BOSUA
);
var UN64OE = new Route(
    "UN64OE",
    "bottom",
    [{name: "toMtl", dist :pxDist(GAI, MTL), heading: 72},
    {name:"toGrena", dist :pxDist(MTL, GRENA), heading: 72},
    {name:"toBosua", dist :pxDist(GRENA, BOSUA), heading: 72},
    {name:"toBiela", dist :pxDist(BOSUA, BIELA), heading: 72}],
    {point:"JUVEN", sector:"M2"},
    pxDist(MTL, UN64MID),
    [BIELA, BOSUA, GRENA, MTL, GAI],
    MTL
);
var UN13 = new Route(
    "UN13",
    "left",
    [{name: "toMtl", dist :pxDist(MINOR, MTL), heading: 357},
    {name: "toMindi", dist: pxDist(MTL, MINDI), heading : 315},
    {name: "toCfa", dist: pxDist(MINDI, CFA), heading : 315},
    {name: "toVulca", dist: pxDist(CFA, VULCA), heading : 350}],
    {point:"CFA",sector:"N3"},
    pxDist(MTL, UN13MID),
    [VULCA, CFA, MINDI, MTL, MINOR],
    MAJOR
)

var ROUTES = [UM3, UM4, UN1, UN2, UN64EO, UN64OE, UN13]
