/* Inspiration: https://dribbble.com/shots/747922-Polygon-Wolf 
 * Polygon Wolf
 * A pen by Alberto Jerez
 * www.ajerez.es
 */

// ONLY WORKS IN WEBKIT!

var isWebkit = 'WebkitAppearance' in document.documentElement.style

if (!isWebkit) {  	
    document.getElementById("nowebkit").style.display = 'block';
    document.getElementById("wolf").style.display = 'none';
}