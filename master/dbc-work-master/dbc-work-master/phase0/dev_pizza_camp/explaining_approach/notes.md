[Dev Pizza Camp](http://www.carolineartz.me/dbc-portfolio/html-css-projects/dev-pizza-camp/menu.html)<br />

###My rationale

Trying to float the item name and price elements left me with empty space and I couldn't figure out how to fill it with an inline dotted line without any box. Aside from image-related approaches, the only way I could think to make a dotted line meant a border. But then the problems I encountered while trying to figure out a way to acheive the lines that crop to the content (+responsive) still involve empty content and making a border around it, which is a bit of a challenge.

After some thought, I decided to try a 3-column table layout for each individual item (via CSS display property--not using html table elements) and style an empty middle cell with a dotted border. However, this requires further workarounds due to the way cell widths default based on the size of the content, or lack thereof. Plus, the `border` extends to the edge of the content (+any padding), displaying below the baseline of the text inside the table cell displayed elements..like:

![needs a shift](http://goo.gl/mQ3CL3)

###notes on my implementation

#####table cell widths
to deal with the width of the table cell situation, i had to to set the element with the name of the food idem to `white-space:nowrap` so the width, which defaults to smallest fit doesn't push a multi-word item onto separate lines. 

after that, i could set the empty middle cell to 100% width and style a dashed border. now the widths of the outer css table cells will size to whatever is the width of their content, and the middle cell with my dashed line will size to whatever is left over. 

#####baseline of dashed border
to make the words/price and connecting dashes look in line, i set the words and price to relative position and used the top property to adjust them a bit lower (i went with .5 em after some trial and error).
