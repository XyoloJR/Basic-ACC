# Basic-ACC
## Aera Control Center Simulator
Light javascript copy,  
witch inclines to look like the real-one,  
to give extra practices possibility.

## How To Use
1 Download and unzip folder  
2 Catch the index.html file to launch the simulation, indexfr.html pour la version française

## Implemented commands
- Right panel :
  * Launch a plane on predefined route :
    - after callsign, speed and fl been selected
    - possibility to launch from a further point
  * Pick a plane and then : 
    - Change its fl level : climbs or descends to this fl at 2000ft/min 
    - Change its heading : turns to the desired heading at 3°/s
    - Give a direct route to the chosen point : turns to the right heading and resumes its route
- Left side buttons :
  * display/hide graduated speed vectors for 3, 6, or 9 minutes
  * enable mesuring distance and heading between two points of the radar screen
- Mouse click on plane icon : 
  - left : change flight details position  
      flight infos label turn clockwise in predefined position  
  - middle : put electronical warning  
      display or reset orange icon, diamond marker, and 3' speed vector
- right click on a callsign in exit flow window to particularize
  middle click on callsing in radar screen to un particularize
  
## Commandes disponibles
- Panneau de droite :
  * Lancer un avion sur une des routes prédéfinies : 
    - après avoir choisi son indicatif, sa vitesse(en noeuds), et son niveau de vol
    - possibilité de lancement d'un point plus rapproché de la zone
  * Choisir un avion et :
    - Changer son niveau de vol : la montée ou la descente s'effectue à 2000pieds/minute
    - Changer son cap : le virage s'effectue à raison de 3° par seconde
    - Donner une route directe vers le point choisi : prend le cap et continue sa route.
- Boutons de gauche :
  * affiche ou masque les vectors vitesses gradués pour 3, 6, ou 9 minutes
  * permet une prise de mesure entre deux points de l'écran radar
- Avec la souris sur l'icone de l'avion : 
  - clique gauche : change la disposition de l'étiquette des détails du vol  
    tourne dans le sens des aiguilles d'un montre
  - clique milieu : met ou enlève les warnings electroniques  
    l'icone passe en orange, l'étiquette reçoit un losange orange et le vecteur vitesse 3 minutes est affiché
 
 - Clique droit sur l'indicatif dans la fennêtre de flux pour particulariser un avion  
   clique milieu sur l'indicatif de l'avion sur l'écran radar pour de-particulariser


## Known issues  
  Developed and tested on firefox 58.x

## Upcoming features :
- decrease speed on climb
- possibility to remove a plane
- minimize info quiting sector
- display time
- mesuring segment sticked on two planes
- add flight details, plane type, destination, pfl on creation
