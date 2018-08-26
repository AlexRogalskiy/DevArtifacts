$(document).ready(function(){
	/* define the messages here for the story.
	 * the epic story. yes. x) */
	var line = [
		"You're not alone.|<HINT> Click the heart to progress.",
		"\"Hey, designer!\"|\"Hey, coder!\"|\"Why is this not working properly?\"",
		"\"Why is this bug still not fixed?\"|\"It's.. super easy to fix, right?\"",
		"\"I reported it like... 5 minutes ago!\"",
		"\"You're just a machine.\"|\"Get to work!\"",
		"\"Oh, and yes.\"|\"Don't do less than perfect work, alright?\"",
		"...",
		"I'm tired.|So... so tired.",
		"...",
		"I can't handle the pressure.|I'm too weak.",
		"I'm not good enough.|I'm a failure.",
		"Is there anything beautiful in a life like this?",
		"I'm scared.",
		"I'm... alone.",
		"...",
		"So very alone...|With no one by my side...",
		"...",
		"Why are you still reading th-|WAIT. Someone's here?",
		"... you're here?|... with me?",
		"You're going to help me?|Inspire me?|Guide me?",
		"Thanks, Codepen'ers.|"+
		"For being the <b>unch of creat<i>ve in<div>iduals that you are.|"+
		"Always fil<li>ng my <head> with co<u>ntless ide<a>s.|...|That is... beautif<ul>."
	]
	/* is the typing thing active???!?! */
	var isTyping = true;
	/* store array length, to avoid IndexOutOfRangeException.
	 * ... wrong language? */
	var lineLength = line.length;
	/* the message that appears on the page - we add to this,
	 * from the current line, character by character */
	var typeMessage = "";
	/* the "nth" character of the current line*/
	var i = 0;
	/* the current "line" */
	var x = 0;
	/* split the current "line" variable into an array of characters
	 * that previously made up the entire thing */
	line[x] = line[x].split("");
	/* store the length info, so that we do not go
	 * out of bounds when adding the characters, cause who'd like that... xI */
	var length = line[x].length;
	/* the function that does all the *writing*...
	 * ... kind of writing. looks like it. more or less. i guess. */
	function typewriter(){
		/* get the current, correct length */
		length = line[x].length;
		if (x < lineLength){
			if (i < length){
				/* replace the less than symbol with the encoded counterpart - to avoid it
				 * actually making html tags */
				if (line[x][i] == "<"){
					line[x][i] = "&lt;";
				}
				/* if the current line has the character "|" in it, treat it as a line break,
				 * so essentially.. just replace it with a bit of code */
				if (line[x][i] == "|"){
					line[x][i] = "<br /><div class=\"break\"></div>";
				}
				/* add a character to the line that appears on the page */
				typeMessage += line[x][i];
				/* deliver that variable to the html itself */
				$(".text").html(typeMessage);
				/* some random "writing effect" made up in a few
				 * minutes... atleast it works! huzzah! :D 
				 * also hooray for the :after pseudo element & the power of CSS */
				var character = randomChar();
				$(".text").attr("data-content", character);
				/* increase i by 1, essentially bringing us to the next character
				 * .. if such a thing exists x) */
				i++;
			} else {
				/* if we reached the end of our array, clear the interval
				 * of the typewriter function... in other words, don't call
				 * it anymore x) */
				clearInterval(writeIt);
				/* also prepare for the next line by resetting stuff. and thangs. */
				x++;
				i = 0;
				typeMessage = "";
				$(".text").attr("data-content", "");
				isTyping = false;
				/* if it is Truly The Actual End Of All Things In This Existence...
				 * or something as dramatic as that, do this! */
				if (x == lineLength){
					$(".go").addClass("toBeautifulThings");
				}
			}
		}
	}
	/* the typing effect, which is just a random character
	 * between \, / and _ at the end of the html. notice how
	 * i dealt with the issue of "wanting the underscore to have
	 * twice as high chance of appearing compared to the slashes" :D */
	function randomChar(){
		var rand = Math.floor((Math.random() * 4) + 1);
		switch(rand){
			case 1:
				return "\\";
				break;
			case 2:
				return "/";
				break;
			case 3:
				return "_";
				break;
			case 4:
				return "_";
				break;
			default:
				return "Oh no, this shouldn't be happening! What will I ever do?!";
				break;
		}
	}
	/* just write it! */
	var writeIt;
	/* if the heart is clicked, show the next line.. */
	$(".go").click(function(){
		/* ... ONLY if it is not currently typing anything */
		if (!isTyping){
			isTyping = true;
			line[x] = line[x].split("");
			writeIt = setInterval(function(){
				typewriter();
			}, 50);
		}
	});
	/* start showing the first line as soon as the page loads */
    writeIt = setInterval(function(){
		typewriter();
	}, 50);
});


/* All work and no play makes Me a dull boy.
 * All work and no play makes Me a dull boy.
 * All work and no play makes Me a dull boy.
 * All work and no play makes Me a dull boy. */
 
 
 
/* BADEND */