<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>iWantHue - Theory</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width">

<?php include('includes/codetop.php') ?>

        <style>
            body {
                padding-top: 60px;
                padding-bottom: 40px;
            }
            /* Specific styles */
            .example div{
                margin-bottom: 1px;
                padding-left: 2px;
            }
        </style>
        
    </head>
    <body>
        <!--[if lt IE 7]>
            <p class="chromeframe">You are using an outdated browser. <a href="http://browsehappy.com/">Upgrade your browser today</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to better experience this site.</p>
        <![endif]-->

<?php include('includes/header.php') ?>

        <div class="container">

            <!-- Main hero unit for a primary marketing message or call to action -->
            <div class="splash-unit row">
                <div class="span7">
                    <div class="image">
                        <a href="index.php"><img src="res/header.png"/></a>
                    </div>
                    <div class="title">
                        i want hue
                    </div>
                </div>
                <div class="span5">
                    <div class="abstract">
                        <p><strong>Colors for data scientists.</strong> Generate and refine palettes of optimally distinct colors.</p>
                    </div>
                </div>
            </div>
        </div>

        
        <div class="container">
            <div class="hero-unit">
                <div class="row">
                    <div class="span2"><h1>Idea:</h1></div>
                    <div class="span8" style="padding-top: 14px;">
                        <p>
                            Distributing colors <strong>evenly</strong>, in a <strong>perceptively coherent</strong> space,
                            <br/>constrained by <strong>user-friendly</strong> settings, to generate <strong>high quality custom palettes</strong>.
                        </p>
                    </div>
                </div>
            </div>

            <div class="row textblock">
                <div class="span12">
                    <p class="lead">
                            Which is the best way to generate random colors? This was my starting point.
                    </p>
                </div>
            </div>
            <div class="row textblock">
                <div class="span6">
                    <p>
                        There are few common ways to write colors:
                        <ul>
                            <li>The <strong>hex</strong> writing (#FF0000) widely used for CSS. It is the hexadecimal writing of the RGB format.</li>
                            <li>
                                The <strong>RGB</strong> format stands for 'Red, Green, Blue'.
                                It is a "color space", since it is a certain way to classify colors.
                                The three channels correspond to how screens emit colored light.
                                Each channel ranges from 0 to 255. The RBG array [0,&nbsp;0,&nbsp;0] is black while [255,&nbsp;255,&nbsp;255] is white. 
                            </li>
                            <li>
                                The <strong>HSV</strong> format is another color space. It stands for "Hue, Saturation, Value".
                                With its variant the <b>HSL</b> space, they are a more user-friendly way to "think" the colors.
                                What we call "colors" (blue, red, yellow...) is essentially the Hue, and it is useful to have this parameter by itself, contrary to the RGB format.
                            </li>
                        </ul>
                    </p>
                    <p>
                        <strong>Many libraries allow the conversion of any color in these four writings</strong> (<em>d3.js</em> for instance).
                        So a random colors generator may use the RGB space as well as the HSV space.
                        HSV or HSL seem to make more sense, since they fit to how we think colors. I also read this opinion on the web. But I had to test it.
                        So I developed <strong>a tool for monitoring</strong> what happens when you generate random colors. Here are some observations I made.
                    </p>
                </div>
                <div class="span6">
                    <div style="text-align: center">
                        <br/>
                        <br/>
                        <img src="res/rgb.png"/>
                    </div>
                </div>
            </div>

            <div class="row textblock">
                <div class="span12">
                    <h1>HSL random colors</h1>
                </div>
            </div>
            <div class="row textblock">
                <div class="span6">
                    <p>
                        Here is a palette of 12 HSL random colors. <i class="icon-hand-right"></i>
                    </p>
                    <p>
                        Some colors look very similar, for instance the dark colors. Despite generating only 12 colors, several colors might be mistaken and it is a problem.
                        We want to use the generator for data visualization, so our primary goal is to get very distinct colors.
                    </p>
                </div>
                <div class="span6">
                    <ul class="inlinePalette">
                        <li style="background-color: #451228"><p>#451228</p></li>
                        <li style="background-color: #13D907"><p>#13D907</p></li>
                        <li style="background-color: #F9F4FC"><p>#F9F4FC</p></li>
                        <li style="background-color: #41039B"><p>#41039B</p></li>
                        <li style="background-color: #47544E"><p>#47544E</p></li>
                        <li style="background-color: #122B53"><p>#122B53</p></li>
                        <li style="background-color: #59DA63"><p>#59DA63</p></li>
                        <li style="background-color: #7B1386"><p>#7B1386</p></li>
                        <li style="background-color: #4B381C"><p>#4B381C</p></li>
                        <li style="background-color: #CDBCD0"><p>#CDBCD0</p></li>
                        <li style="background-color: #EAEAEA"><p>#EAEAEA</p></li>
                        <li style="background-color: #B1CDE4"><p>#B1CDE4</p></li>
                    </ul>
                </div>
            </div>

            <div class="row textblock">
                <div class="span6">
                    <br/>
                    <p>
                        This is how these 12 colors are distributed in the HSL space. <i class="icon-hand-right"></i>
                    </p>
                    <p>
                        The distribution is right, and the similarity of some colors is not an effect of randomness. It is just that the HSL color space has bad properties.
                        Look at the <em>Hue x Lightness</em> projection. The upper-left corner and the the upper-right corner have the same color (black).
                        Despite being distant, they look the same. The random colors <em>are</em> distant in the space but not for our perception.
                        Colors with a low lightness will all look the same, whatever their hue. The same with high lightness colors, and low saturation colors.
                    </p>
                </div>
                <div class="span6">
                    <img src="res/hslgen12.png"/>
                </div>
            </div>

            <div class="row textblock">
                <div class="span12">
                    <h1>RGB random colors</h1>
                </div>
            </div>
            <div class="row textblock">
                <div class="span6">
                    <p>
                        Here is now a palette of 12 RGB random colors. <i class="icon-hand-right"></i>
                    </p>
                    <p>
                        This palette is visibly better. We have less similar colors. The RGB space has better properties.
                    </p>
                </div>
                <div class="span6">
                    <ul class="inlinePalette">
                        <li style="background-color: #DBA714"><p>#DBA714</p></li>
                        <li style="background-color: #391FEA"><p>#391FEA</p></li>
                        <li style="background-color: #46385C"><p>#46385C</p></li>
                        <li style="background-color: #E5154B"><p>#E5154B</p></li>
                        <li style="background-color: #3E9A71"><p>#3E9A71</p></li>
                        <li style="background-color: #3495F5"><p>#3495F5</p></li>
                        <li style="background-color: #57510C"><p>#57510C</p></li>
                        <li style="background-color: #D9B182"><p>#D9B182</p></li>
                        <li style="background-color: #8625B8"><p>#8625B8</p></li>
                        <li style="background-color: #83CA5D"><p>#83CA5D</p></li>
                        <li style="background-color: #6252A1"><p>#6252A1</p></li>
                        <li style="background-color: #DB5E3A"><p>#DB5E3A</p></li>
                    </ul>
                </div>
            </div>

            <div class="row textblock">
                <div class="span6">
                    <br/>
                    <p>
                        Here is the projection of this palette in the HSL space. <i class="icon-hand-right"></i>
                    </p>
                    <p>
                        The colors are not located in the dark area, in the light area, or the grey area.
                        They tend to occupy the areas where we <em>see</em> more varied colors.
                        Intuitively, this is what we expect in order to get perceptively varied colors.
                    </p>
                    <p>
                        <strong>The randomness is not the same depending on the color space used.</strong>
                    </p>
                </div>
                <div class="span6">
                    <img src="res/rgbgen12.png"/>
                </div>
            </div>

            <div class="row textblock">
                <div class="span12">
                    <p class="lead">
                        Then, which is the best color space for generating random colors?
                    </p>
                </div>
            </div>

            <div class="row textblock">
                <div class="span12">
                    <h1>The L*a*b* color space</h1>
                </div>
            </div>
            <div class="row textblock">
                <div class="span6">
                    <p>
                        The <a href="http://en.wikipedia.org/wiki/Lab_color_space">CIE L*a*b*</a> color space includes all perceivable colors and is intended to be perceptually uniform.
                        That is, we can interpret the distance in this space as a perceptive distance. If two colors are close, then they will look similar.
                        On the contrary, distant colors will be perceived as distinct. <strong>This is the property we need</strong>.
                    </p>
                    <p>
                        But there is something special with this color space: it has holes. Only certain coordinates correspond to actual colors.
                        This makes things a little bit more complicated, but we can get over it.
                    </p>
                    <p>
                        You can see here what it looks like. <i class="icon-hand-right"></i>
                    </p>
                    <p>
                        What does this color space change? It takes in account that the yellow is perceived very light, and that the purple looks dark on the contrary.
                        That is why the L*a*b* version of the lightness has a star: <i>lightness*</i>. In a data visualization perspective, it stands for the <i>unbiased</i> lightness.
                        This color space also gives more room to saturated colors compared to dark, clear or grey colors. All the colors look the same when they are very dark.
                        That is why the dark colors occupy a lesser area than the fully saturated colors.
                    </p>
                </div>
                <div class="span6">
                    <img style="margin-right:50px;" src="res/axb.png"/>
                    <img src="res/Lxa.png"/>
                </div>
            </div>

            <div class="row textblock">
                <div class="span6">
                    <br/>
                    <p>
                        <strong>We will use the CIE L*a*b* color space as the reference for the evaluation of colors distribution.</strong>
                    </p>
                    <p>
                        If we generate 10000 random colors in this color space, we obtain this distribution.&nbsp;<i class="icon-hand-right"></i>
                    </p>
                    <p>
                        We can now compare the random distributions of other generators.
                    </p>
                </div>
                <div class="span6">
                    <img src="res/ab_Lab_proba.png"/>
                </div>
            </div>

            <div class="row textblock">
                <div class="span6">
                    <br/>
                    <p>
                        <strong>HSL random colors represented in CIE L*a*b*</strong>&nbsp;<i class="icon-hand-right"></i>
                    </p>
                    <p>
                        We clearly see how the random HSL colors concentrate in the central area.
                        This area corresponds to the dark, grey and light colors (desaturated colors).
                        It visualizes the many similar desaturated colors found in our first random example.
                    </p>
                </div>
                <div class="span6">
                    <img src="res/ab_HSL_proba.png"/>
                </div>
            </div>

            <div class="row textblock">
                <div class="span6">
                    <br/>
                    <p>
                        <strong>RGB random colors represented in CIE L*a*b*</strong>&nbsp;<i class="icon-hand-right"></i>
                    </p>
                    <p>
                        The distribution is very close to the reference.
                        We can see here that RGB random colors are very satisfying, even if CIE L*a*b* random colors are even better.
                    </p>
                    <p>
                        <strong>If you have to use simple generator, use RGB random colors, they are not much different from the best you can expect!</strong>
                    </p>
                </div>
                <div class="span6">
                    <img src="res/ab_RGB_proba.png"/>
                </div>
            </div>

            <div class="row textblock">
                <div class="span12">
                    <h1>Distributing the colors evenly</h1>
                    <p class="lead">
                        The next idea is to prevent similar colors. We place each color depending on the others.
                        We can achieve this goal with two different algorithms: <strong>k-Means</strong> and <strong>Force Vector</strong>.
                    </p>
                </div>
            </div>

            <div class="row textblock">
                <div class="span5">
                    <h3>Force vector: repulsion</h3>
                    <p>
                        Force Vector is the simplest. It makes all the colors repulse, so that they tend to separate at the maximum in the color space.
                        If we generate 8 colors and make them repulse in the RGB color space, which is basically a cube, they tend to go in the corners.
                    </p>
                    <p>
                        <em>8 colors RGB Force Vector palette</em>&nbsp;<i class="icon-hand-right"></i>
                    </p>
                    <p>
                        So we obtain black, white, the 3 primary colors, and the 3 secondary colors!
                    </p>
                </div>
                <div class="span3">
                    <img src="res/rgb-8fv.png"/>
                </div>
                <div class="span4">
                    <br/>
                    <ul class="inlinePalette">
                        <li style="background-color: #00FF00"><p>#00FF00</p></li>
                        <li style="background-color: #0000FF"><p>#0000FF</p></li>
                        <li style="background-color: #FF0000"><p>#FF0000</p></li>
                        <li style="background-color: #FFFFFF"><p>#FFFFFF</p></li>
                        <li style="background-color: #000000"><p>#000000</p></li>
                        <li style="background-color: #FFFF00"><p>#FFFF00</p></li>
                        <li style="background-color: #FF00FF"><p>#FF00FF</p></li>
                        <li style="background-color: #00FFFF"><p>#00FFFF</p></li>
                    </ul>
                </div>
            </div>

            <div class="row textblock">
                <div class="span5">
                    <br/>
                    <p>
                        The same algorithm in the CIE L*a*b* space gives different results, since the space itself has a twisted shape.
                        The colors are nevertheless very distinct as well.
                    </p>
                    <p>
                        <em>8 colors L*a*b* Force Vector palette</em>&nbsp;<i class="icon-hand-right"></i>
                    </p>
                </div>
                <div class="span3">
                    <img src="res/lab-8fv.png"/>
                </div>
                <div class="span4">
                    <br/>
                    <ul class="inlinePalette">
                        <li style="background-color: #A09C04"><p>#A09C04</p></li>
                        <li style="background-color: #F161FE"><p>#F161FE</p></li>
                        <li style="background-color: #27B0CC"><p>#27B0CC</p></li>
                        <li style="background-color: #FA231D"><p>#FA231D</p></li>
                        <li style="background-color: #04103B"><p>#04103B</p></li>
                        <li style="background-color: #FA918F"><p>#FA918F</p></li>
                        <li style="background-color: #1A5A18"><p>#1A5A18</p></li>
                        <li style="background-color: #963700"><p>#963700</p></li>
                    </ul>
                </div>
            </div>

            <div class="row textblock">
                <div class="span5">
                    <h3>k-Means clustering</h3>
                    <p>
                        Another way to generate evenly distributed colors is to clusterize the color space.
                        We use the <a href="http://en.wikipedia.org/wiki/Kmeans">k-Means</a> algorithm to do so.
                        It aims at finding <em>k</em> distinct areas in the color space, and the palette is made of all the centers of these areas.
                    </p>
                    <p>
                        <em>8 colors RGB k-Means palette</em>&nbsp;<i class="icon-hand-right"></i>
                    </p>
                    <p>
                        Clustering the RGB cube in 8 will also give 8 colors, but they will not be on the edge of the cube.
                        This is the biggest difference between k-Means and Force Vector: <strong>k-Means produces less distant colors</strong>.
                    </p>
                </div>
                <div class="span3">
                    <img src="res/rgb-8km.png"/>
                </div>
                <div class="span4">
                    <br/>
                    <ul class="inlinePalette">
                        <li style="background-color: #BE3CBE"><p>#BE3CBE</p></li>
                        <li style="background-color: #3CBE3C"><p>#3CBE3C</p></li>
                        <li style="background-color: #3C3C3C"><p>#3C3C3C</p></li>
                        <li style="background-color: #BE3C3C"><p>#BE3C3C</p></li>
                        <li style="background-color: #3CBEBE"><p>#3CBEBE</p></li>
                        <li style="background-color: #BEBE3C"><p>#BEBE3C</p></li>
                        <li style="background-color: #3C3CBE"><p>#3C3CBE</p></li>
                        <li style="background-color: #BEBEBE"><p>#BEBEBE</p></li>
                    </ul>
                </div>
            </div>

            <div class="row textblock">
                <div class="span5">
                    <br/>
                    <p>
                        Like before, the CIE L*a*b* space gives different results since it has a different shape.
                    </p>
                    <p>
                        <em>8 colors L*a*b* k-Means palette</em>&nbsp;<i class="icon-hand-right"></i>
                    </p>
                </div>
                <div class="span3">
                    <img src="res/lab-8km.png"/>
                </div>
                <div class="span4">
                    <br/>
                    <ul class="inlinePalette">
                        <li style="background-color: #C7743B"><p>#C7743B</p></li>
                        <li style="background-color: #9B4DCA"><p>#9B4DCA</p></li>
                        <li style="background-color: #93C4A2"><p>#93C4A2</p></li>
                        <li style="background-color: #513363"><p>#513363</p></li>
                        <li style="background-color: #94C64D"><p>#94C64D</p></li>
                        <li style="background-color: #514C34"><p>#514C34</p></li>
                        <li style="background-color: #C45271"><p>#C45271</p></li>
                        <li style="background-color: #969CC6"><p>#969CC6</p></li>
                    </ul>
                </div>
            </div>

            <div class="row textblock">
                <div class="span12">
                    <h1>Mastering the palettes</h1>
                    <p class="lead">
                        Next step: we want to apply constraints to the color generation.
                        The goal is to get control over the type of colors obtained.
                        For instance, we want to limit the saturation in order to avoid a distracting effect.
                    </p>
                </div>
            </div>

            <div class="row textblock">
                <div class="span6">
                    <h3>The HCL color space</h3>
                    <p>
                        If RGB fits to how screens <em>produce</em> colors, if CIE L*a*b* fits to how we <em>perceive</em> colors, HCL fits to how we <em>think</em> colors.
                        It is like HSL, but perceptively unbiased. The idea behind this color space is to use the CIE L*a*b* but with a separate Hue dimension.
                        So HCL has the regular <u>H</u>ue, an unbiased saturation called <u>C</u>hroma, and the (unbiased) <u>L</u>ightness* from L*a*b*.
                    </p>
                </div>
                <div class="span6">
                    <div class="alert alert-info">
                        <p>
                            This clever process has been (re-)discovered by Gregor Aisch. <a href="http://vis4.net/blog/posts/avoid-equidistant-hsv-colors/">This post explains the whole process</a>.
                            Seriously, take a look at this work. Also, Gregor Aisch coded the <a href="https://github.com/gka/chroma.js">Chroma.js library</a> that I used so much to build this tool.
                        </p>
                        <p>
                            <strong>Important note about the <em>HCL</em> terminology</strong>: the HCL color space was initially called CSL for "chroma / saturation / lightness".
                            The post above is about "CSL": this is actually what we call <strong>HCL</strong> (like the present Chroma.js lib).
                        </p>
                    </div>
                </div>
            </div>

            <div class="row textblock">
                <div class="span6">
                    <br/>
                    <p>
                        The HCL color space is more twisted than CIE L*a*b* and still distorted (the desaturated colors are not in a single area), but it is the best way to set the conditions limiting the color space.
                    </p>
                    <p>
                        We see very well the effect of the unbiased lightness: yellow is not too light and indigo not too dark. The whole looks so smooth!
                    </p>
                    <p>
                        Just by setting a range for Hue, a range for Chroma and a range for Lightness*, we can <strong>restrain</strong> the L*a*b* color space.
                        We just test if a given L*a*b* color, once converted in HCL, is in the specified ranges.
                        The force vector will just prevent a color from being pushed out of these boundaries.
                        The k-Means will restrain its sampling of colors to be clusterized (so it is even quicker).
                    </p>
                    <p>
                        So, just to be clear:
                        <br/><strong>L*a*b* is used for computations, while HCL is used by the user to filter colors</strong>.
                    </p>
                </div>
                <div class="span6">
                    <img src="res/hxL.png"/>
                </div>
            </div>

            <div class="row textblock">
                <div class="span6">
                    <h3>Setting a range of Hue, Chroma or Lightness</h3>
                    <p>
                        Here are some examples of color subspaces that you can use to build palettes.
                        You will see that because the color space is twisted, the Chroma affects the Hue and the Lightness*, and vice-versa.
                    </p>
                </div>
            </div>

            <div class="row textblock">
                <div class="span5">
                    <p>
                        <strong>Hue from 200° to 250°</strong>&nbsp;<i class="icon-hand-right"></i>
                    </p>
                    <p>
                        170 blue colors. Since there is no constraint on chroma or lighness, we have some black, grey and white.
                    </p>
                    <p>
                        Selecting a range of hues cuts the L*a*b* space like a slice of pie.
                    </p>
                    <img src="res/hue-200-250.png"/>
                </div>
                <div class="span7">
                    <img src="res/hue-200-250 screenshot.png"/>
                </div>
            </div>

            <div class="row textblock">
                <div class="span5">
                    <p>
                        <strong>Hue from 100° to 250°</strong>&nbsp;<i class="icon-hand-right"></i>
                    </p>
                    <p>
                        577 blue-green colors. Of course, a wider range has more color samples.
                    </p>
                    <p>
                        It is like a big slice of color space.
                        The bottom of the space is dark while the top is light, and the center is grey while the border is colorful.
                    </p>
                    <p>
                        We sample the full CIE L*a*b* color space in 1782 colors.
                    </p>
                    <img src="res/hue-100-250.png"/>
                </div>
                <div class="span7">
                    <img src="res/hue-100-250 screenshot.png"/>
                </div>
            </div>

            <div class="row textblock">
                <div class="span5">
                    <p>
                        <strong>Chroma from 0 to 0.3</strong>&nbsp;<i class="icon-hand-right"></i>
                    </p>
                    <p>
                        66 desaturated colors. These colors may be slightly green or orange. This is due do the fact that these hues are perceived less saturated.
                    </p>
                    <p>
                        Selecting a low chromas keeps only the very center of the color space.
                    </p>
                    <img src="res/chroma-0-0.3.png"/>
                </div>
                <div class="span7">
                    <img src="res/chroma-0-0.3 screenshot.png"/>
                </div>
            </div>

            <div class="row textblock">
                <div class="span5">
                    <p>
                        <strong>Chroma from 1 to 1.2</strong>&nbsp;<i class="icon-hand-right"></i>
                    </p>
                    <p>
                        215 well saturated colors.
                    </p>
                    <p>
                        Selecting a close range of chromas makes the shape of a bowl. The bowl is small if the chromas are low, the bowl is large if the chromas are high.
                    </p>
                    <img src="res/chroma-1-1.2.png"/>
                </div>
                <div class="span7">
                    <img src="res/chroma-1-1.2 screenshot.png"/>
                </div>
            </div>

            <div class="row textblock">
                <div class="span5">
                    <p>
                        <strong>Chroma above 2</strong>&nbsp;<i class="icon-hand-right"></i>
                    </p>
                    <p>
                        363 over-saturated colors.
                        These colors are blue to purple, with a touch of green. Only these colors are perceived with such a high saturation.
                    </p>
                    <p>
                        Selecting high chromas digs a big hole in the color space. But because its shape is not even, only certain hues remain.
                    </p>
                    <img src="res/chroma-2-10.png"/>
                </div>
                <div class="span7">
                    <img src="res/chroma-2-10 screenshot.png"/>
                </div>
            </div>

            <div class="row textblock">
                <div class="span5">
                    <p>
                        <strong>Lightness* above 1.2</strong>&nbsp;<i class="icon-hand-right"></i>
                    </p>
                    <p>
                        196 very light colors.
                        These colors include a lot of yellow, since this color is perceived lighter.
                    </p>
                    <p>
                        Selecting a certain lightness selects a horizontal plan of the space.
                    </p>
                    <img src="res/lightness-1.2-10.png"/>
                </div>
                <div class="span7">
                    <img src="res/lightness-1.2-10 screenshot.png"/>
                </div>
            </div>

            <div class="row textblock">
                <div class="span12">
                    <h1>Taking benefits from custom color spaces</h1>
                    <p>
                        As a data scientist I want:
                        <ul>
                            <li>To <strong>avoid distracting colors</strong></li>
                            <li>To keep <strong>homogeneity</strong></li>
                            <li>To control attention (ability to <strong>mute</strong> certain elements, or to <strong>put focus</strong> somewhere)</li>
                        </ul>
                        ...and of course to have <strong>distinct colors</strong>.
                    </p>
                    <br/>
                    <p>
                        Mastering palettes allows some solutions:
                        <ul>
                            <li>In order to avoid distracting colors, one may just put a <b>maximum Chroma</b>.</li>
                            <li>Keeping homogeneity is primarily achieved by a <b>limited range of Lightness*</b>.</li>
                            <li><b>Limiting the hue</b> is also efficient, but it depends on how much colors you want.</li>
                            <li>Muting will be achieved by choosing a low Chroma and a <b>Lightness* close to the background.</b></li>
                        </ul>
                    </p>
                </div>
            </div>
                
            <div class="row textblock">
                <div class="span5">
                    <p>
                        Here is an example of satisfying settings for a small amount of colors.&nbsp;<i class="icon-hand-right"></i>
                    </p>
                    <p>
                        <strong>Chroma &lt; 0.3</strong> and <strong>Lightness* &gt; 1.2</strong>: 19 very soft colors.
                        <br/>
                        <img src="res/custom19.png"/>
                    </p>
                </div>
                <div class="span7">
                    <div id="ex1" class="example">
                        <div style="width:80%;">A.1.</div>
                        <div style="width:74%;">A.2.</div>
                        <div style="width:66%;">B.1.</div>
                        <div style="width:42%;">B.2.</div>
                        <div style="width:37%;">B.3.</div>
                        <div style="width:41%;">C.1.</div>
                        <div style="width:32%;">C.2.</div>
                        <div style="width:25%;">C.3.</div>
                    </div>
                    <br/>
                    <p>
                        <button class="btn" onclick="example1()">Reroll colors</button>
                    </p>
                    <p class="text-info">
                        You will never have 2 similar colors at the same time.
                    </p>
                </div>
            </div>
                
            <div class="row textblock">
                <div class="span5">
                    <p>
                        Here is another example, where you want to put an element in exergue.&nbsp;<i class="icon-hand-right"></i>
                    </p>
                    <p>
                        The same color space is used for all items but one, that is found in the following:
                    </p>
                    <p>
                        <strong>0.4 &lt; Chroma &lt; 0.6</strong> and <strong>0.8 &lt; Lightness* &lt; 1</strong>: 32 colors.
                        <br/>
                        <img src="res/custom32.png"/>
                    </p>
                </div>
                <div class="span7">
                    <div id="ex2" class="example">
                        <div style="width:80%;">A.</div>
                        <div style="width:74%;">B.</div>
                        <div class="exergue" style="width:66%; color:#FFF;">Top Moumoute</div>
                        <div style="width:42%;">C.</div>
                        <div style="width:41%;">D.</div>
                        <div style="width:37%;">E.</div>
                    </div>
                    <br/>
                    <p>
                        <button class="btn" onclick="example2()">Reroll colors</button>
                    </p>
                </div>
            </div>

            <div class="row textblock">
                <div class="span5">
                    <p>
                        If we had a dark background, we would have to find other color spaces, respectively:
                    </p>
                    <p>
                        <strong>Chroma &lt; 0.4</strong> and <strong>0.6 &lt; Lightness* &lt; 0.8</strong>: 14 colors.
                        <br/>
                        <img src="res/custom14.png"/>
                    </p>
                    <p>
                        <strong>0.4 &lt; Chroma &lt; 0.8</strong> and <strong>1 &lt; Lightness* &lt; 1.2</strong>: 76 colors.
                        <br/>
                        <img src="res/custom76.png"/>
                    </p>
                </div>
                <div class="span7">
                    <div id="ex3" class="example" style="background-color: #666; padding: 20px; color:#FFF;">
                        <div style="width:80%;">A.</div>
                        <div style="width:74%;">B.</div>
                        <div class="exergue" style="width:66%; color:#000;">Top Moumoute</div>
                        <div style="width:42%;">C.</div>
                        <div style="width:41%;">D.</div>
                        <div style="width:37%;">E.</div>
                    </div>
                    <br/>
                    <p>
                        <button class="btn" onclick="example3()">Reroll colors</button>
                    </p>
                </div>
            </div>
<?php include('includes/footer.php') ?>
        </div>
<?php include('includes/codebottom.php'); ?>

        <script src="js/libs/chroma.js"></script>
        <script src="js/libs/chroma.palette-gen.js"></script>

        <script src="js/background.js"></script>
        <script src="js/colorspace.js"></script>
        <script src="js/presets.js"></script>
        <script src="js/selectors.js"></script>
        <script src="js/fitting.js"></script>
        <script src="js/palettegeneration.js"></script>
        <script src="js/colorpicker.js"></script>

        <script src="js/sandbox.js"></script>

<script>
// Examples

// 1
function example1(){
    var ex1_colors = paletteGenerator.generate(3, function(color){
        var hcl = color.hcl();
        return hcl[1]<=0.3 && hcl[2]>=1.2;
    },false,10);
    ex1_colors = paletteGenerator.diffSort(ex1_colors);

    $('#ex1 div').each(function(i,element){
        $(element).css('background-color', ex1_colors[Math.round(i/3)%3].hex());
    });
}
example1();

// 2
function example2(){
    var ex2_colors = paletteGenerator.generate(6, function(color){
        var hcl = color.hcl();
        return hcl[1]<=0.3 && hcl[2]>=1.2;
    },false,10);
    ex2_colors = paletteGenerator.diffSort(ex2_colors);
    
    var exergue = paletteGenerator.generate(3, function(color){
        var hcl = color.hcl();
        return hcl[0]>=0 && hcl[0]<=360 && hcl[1]>=0.4 && hcl[1]<=0.6 && hcl[2]>=0.8 && hcl[2]<=1;
    },false,10)[0];
    
    $('#ex2 div').each(function(i,element){
        if($(element).hasClass('exergue')){
            $(element).css('background-color', exergue.hex());
        } else {
            $(element).css('background-color', ex2_colors[i].hex());
        }
    });
}
example2();

// 3
function example3(){
    var ex3_colors = paletteGenerator.generate(6, function(color){
        var hcl = color.hcl();
        return hcl[0]>=0 && hcl[0]<=360 && hcl[1]>=0 && hcl[1]<=0.4 && hcl[2]>=0.6 && hcl[2]<=0.8;
    },false,10);
    ex3_colors = paletteGenerator.diffSort(ex3_colors);
    
    var exergue = paletteGenerator.generate(3, function(color){
        var hcl = color.hcl();
        return hcl[0]>=0 && hcl[0]<=360 && hcl[1]>=0.4 && hcl[1]<=0.8 && hcl[2]>=1 && hcl[2]<=1.2;
    },false,10)[0];
    
    $('#ex3 div').each(function(i,element){
        if($(element).hasClass('exergue')){
            $(element).css('background-color', exergue.hex());
        } else {
            $(element).css('background-color', ex3_colors[i].hex());
        }
    });
}
example3();
</script>


<script>
// Generate colors (as Chroma.js objects)
var colors = paletteGenerator.generate(4, function(color){
    var hcl = color.hcl();
    return hcl[0]>=0 && hcl[0]<=360 && hcl[1]>=0 && hcl[1]<=0.25 && hcl[2]>=1.2 && hcl[2]<=10;
},false,20);

$('.sectionblock').each(function(i,block){
    $(block).css('background-color', colors[i]);
});

var conceptcolor = paletteGenerator.generate(1, function(color){
    var hcl = color.hcl();
    return hcl[0]>=0 && hcl[0]<=360 && hcl[1]>=0.6 && hcl[1]<=10 && hcl[2]>=0.2 && hcl[2]<=0.8;
},false,0)[0];

$('#concept').css('color', conceptcolor);

</script>
    </body>
</html>
