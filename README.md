# Basic-ACC
## Aera Control Center Simulator
Light javascript copy,  
witch inclines to look like the real-one,  
to give extra practices possibility.

## How To Use
1 Download and unzip folder  
2 Catch the index.html file to launch the simulation  

## Implemented commands
- Right panel :
  * Launch a plane on predefined route :
    - after callsign, speed and fl been selected
    - possibility to launch from a further point
  * Pick a plane and then : 
    - Change its fl level : climbs or descend to this fl at 2000ft/min 
    - Change a plane heading : turns to the desired heading at 3°/s
    - Give a direct route to the chosen point : turns to the right heading and resumes its route
- Left side buttons :
  * display/hide graduated speed vectors for 3, 6, or 9 minutes
  * enable mesuring distance and heading between two points of the radar screen
- Mouse click on plane icon : 
  - left : change flight details position  
      flight infos label turn clockwise in predefined position  
  - middle : put electronical warning  
      display orange icon, diamond marker, and 3' speed vector
      
- right click on a callsign in exit flow window to particularize
  middle click on callsing in radar screen to un particularize

## Known issues  
  Developed and tested on firefox 58.x

## Upcoming features :
- possibility to remove a plane
- minimize info quiting sector
- display time
- mesuring segment sticked on two planes
- add flight details, plane type, destination, pfl on creation
