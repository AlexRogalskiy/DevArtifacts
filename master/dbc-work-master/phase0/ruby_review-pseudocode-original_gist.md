*General challenge note: It was really tough reviewing other boots' solutions to this challenge that had long intentioned markdown codeblocks rendered in huge heading font size due to the `#` in ruby comments translating to markdown `h1`. It could be helpful to include a heads up about this in the challenge and objective to make sure to figure out some way to avoid this...?*

##Regular Expressions

###Pseudocode here:

	INPUT: String of text that may or may not contain a SSN 
	OUPUT: for has_ssn? -- Returning either true or false as to whether an SSN is present
	for grab_ssn -- returning just the SSN from the string(or nil if there is no SSN)
	for grab_all_ssns -- returning all SSNs from string
	for hide_all_ssns -- The SSNs with the first 5 digits replaced with an 'X'
	for format_ssns -- Returns SSNs in proper 123-45-6789 formatting
	What are the steps to solve the problem?  Write them out in plain english as best you can.
	for has_ssn -- use regex to match a pattern in the string that fits SSN formatting.  If yes, return true
	for grab_ssn -- find if string contains SSN, and return just the SSN if it does
	for grab_all -- find all matching SSN patterns in string (.scan?).  Assign to array, loop through and return values
	for hide_all -- Use gsub to sub out for 5 digits with X
	for format -- substitute out any sets of 9 numbers with '-' inserted
 
###Evaluate the code on the following characteristics:

#### English-like statements
Yes he/she uses english-like statements, though maybe just a tad overly wordy   

#### Contains clearly defined inputs and outputs
Yes. I appreciate the explicit separation of outputs for each method, vs globbing them together into a single sentence/paragraph.

#### Code-specific syntax is avoided
Mostly...personally, I think it's fine and probably helpful for this individual to note potential strategies/methods while outlining the general plan. He/she mostly sticks to the identified common programming shorthands (return true, loop, if yes...). 

#### Formatting 
Not really...beyond lack of formatting in terms of logical sections of their approach, of it was kinda tough to read without any whitespace/blank lines between the input/output section and the steps sections.

#### Appropriate granularity 

This is kinda hard to judge since solving these for each method is relativlely straighforward; I don't think much more granularity is necessary.

#### Intention is emphasized over implementation
Mostly. Some regex specific stuff that might violate the hallmarks...but we obviously had to use regex, so it doesn't apply.

Somewhat of a side note since this is very common across most of the solutions-- I find it less than helpful to keep every bit the original DBC instructions throughout our gist templates. They distract from the work of the individual-- cluttering up the page, decreasing readability. I prefer when it's replaced with a logical section titles, for example:<br />
*Steps:* <br/>
**and not**<br/>
*What are the steps to solve the problem?  Write them out in plain english as best you can.*

***
##Fibonacci Number

###Pseudocode here:

	INPUT:  i
	OUPUT:  true if i is part of fibonacci sequence, false if i is not part of fibonacci sequence.
	What are the steps to solve the problem?  Write them out in plain english as best you can.
	check if i is positive.  if i is positive...
	declare a variable sum that takes an array starting with the first 2 numbers of fibonacci sequence and adds them.  reassign the sum to the variable sum and add it to the end of the array.
	while i is greater than last element of the array contiue adding the sum of the last 2 elements of the array.
	if i is equal to last elememt in the array then i is part of the fibonacci sequence else return false.
	deal with negative later...
 
###Evaluate the code on the following characteristics:

#### English-like statements
See below; other than the input variable as `i`, this is pretty good. 

#### Contains clearly defined inputs and outputs
I chose this code because of other features. The INPUT part and subsequent reference to the input integer as `i` could be better if was more descriptive, e.g., a (positive)integer. The OUTPUT is done well. 

#### Code-specific syntax is avoided
Makes good use of the acceptable common progragramming shorthands--I think this is just fine.

#### Formatting 
This wasn't formatted in line with our psedocode guidelines--including the vast majority of mine, not many have this component.
#### Appropriate granularity 
I like the level of granularity here quite a bit. It's a good level for a solid outline but doesn't severely limit the programmer in terms of figuring out exactly how to execute things as he/she goes. 

#### Intention is emphasized over implementation
Like above, I think this is done pretty well--there are some instances e.g., reference to using an array, where this might be in "voilation" of our pseudocode guidelines...but I feel in this situation, where it is arguably a clear approach, maybe this is OK. Further, I think somewhere we may have been told to use an array--so why not include it?


###Reflections on your own pseudocode here:

My pseudocode, particularly for the Regex exercise, is *pretty* good...certainly could be better. 


	 
	INPUT: a positive integer
	OUPUT: boolean true/false if it is a fibonacci number
	generate fib numbers less than or equal to input
	test whether input one of the generated fib numbers
	return boolean true if is fib number
	return boolean false if not a fib number

My Fibonacci pseudcode does *kinda* fit in lines with some of the guidelines, but reflecting on it, I don't really feel it's all that helpful in planning an approach. It's more or less a slightly more detailed objective--which is pretty obvious. 

	INPUT: a string
	OUPUT & PSEUDOCODE
	Contains SSN =    OUTPUT: Return boolean true/false
	                    Test string for chars in SSN format
	Return SSN =      OUTPUT: Return SSN extracted from input, as string
	                    Call Contains SSN method-test if a SSN in string
	                    If contains SSN, extract and return.
	                    Otherwise, return nil
	Return all SSNs = OUTPUT: Return string array of all SSNs in input string, else empty
	                    Create an array to hold any SSNs in string
	                    Check for SSNs in string
	                    Push any formatted SSNs to array and return
	Obfuscate SSNs =  OUTPUT: Return input string with any SSNs obfuscated to XXX-XX-1234
	                    Check string for any SSNs
	                    Replace first 5 number characters with X and return string
	Format SSNs =     OUTPUT: Return input string; if any SSNs, formated as 123-45-6789
	                    Search string for any format SSN
	                    Extract each SSN's number char groups
	                    join them with appropriate -
	                    push formatted SSNs to array, join to string and return


I like my Regex pseudocode--concise but thorough and formatted better than some of the ones I come up with. I will start working on indenting or sectioning off parts with brackets when it makes sense. I think I have a lot to learn when it comes to producing "good" pseudocode...then again, and maybe I'm alone in this, but I feel like this challenge possibily made me more confused about the definition of "good" pseudocode...

I am (or was?) of the impression that pseudocode should fall somewhere within a spectrum based on the provided guidelines, but that the exact situation may result in how closely it adheres. To *some extent* I just think that the pseudocode should be whatever the programmer or pair/team of programmers find most useful for the given problem...if writing it out in a way that looks a bit more like code is particularly helpful, then do that. If it's more conceptual and an approach isn't so obvious, step back and take a stab at it from a higher level. I tend to set out aiming for a real and productive planning/pseudocode phase that produces a result meeting standards/hallmarks for clear and readable code...definitely not saying the hallmarks are unfounded, just that everybody or every pair processes information differently...


