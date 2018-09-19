import javax.media.opengl.GL;
import static javax.media.opengl.GL2.*;
import robotrace.Base;
import robotrace.Vector;

/**
 * The RobotRace assignment.
 * 
 * Implemented:
 *  1.1 (Axis frame)
 *  1.2 (Viewing)
 *  1.3 (Robot)
 *  1.4 (Shading)
 *  2.1 (Race track)
 *  2.2 (Moving camera)
 *  2.3 (Walking robots)
 *  2.4 (Spline tracks)
 *  2.5 (Textured tracks)
 *  2.6 (Textured robots)
 *  2.7 (Terrain)
 *  2.8 (Extra features)
 *      - Add trees to the scene, making sure they are not on the tracks. Trees must consist
 *        of at least three primitives and must have variation in size and shape 
 *      - Define a custom height field, mimicking a more realistic mountain landscape
 *      - Define the track such that it is always 1 m above the terrain, while the bricks
 *        defined in the texture are still horizontal. (With 1.5 m instead of 1 m.)
 *
 * @author  Kevin Jacobs
 * @author  Max Hageluken
 */

/**
 * Handles all of the RobotRace graphics functionality,
 * which should be extended per the assignment.
 * 
 * OpenGL functionality:
 * - Basic commands are called via the gl object;
 * - Utility commands are called via the glu and
 *   glut objects;
 * 
 * GlobalState:
 * The gs object contains the GlobalState as described
 * in the assignment:
 * - The camera viewpoint angles, phi and theta, are
 *   changed interactively by holding the left mouse
 *   button and dragging;
 * - The camera view width, vWidth, is changed
 *   interactively by holding the right mouse button
 *   and dragging upwards or downwards;
 * - The center point can be moved up and down by
 *   pressing the 'q' and 'z' keys, forwards and
 *   backwards with the 'w' and 's' keys, and
 *   left and right with the 'a' and 'd' keys;
 * - Other settings are changed via the menus
 *   at the top of the screen.
 * 
 * Textures:
 * Place your "track.jpg", "brick.jpg", "head.jpg",
 * and "torso.jpg" files in the same folder as this
 * file. These will then be loaded as the texture
 * objects track, bricks, head, and torso respectively.
 * Be aware, these objects are already defined and
 * cannot be used for other purposes. The texture
 * objects can be used as follows:
 * 
 * gl.glColor3f(1f, 1f, 1f);
 * track.bind(gl);
 * gl.glBegin(GL_QUADS);
 * gl.glTexCoord2d(0, 0);
 * gl.glVertex3d(0, 0, 0);
 * gl.glTexCoord2d(1, 0);
 * gl.glVertex3d(1, 0, 0);
 * gl.glTexCoord2d(1, 1);
 * gl.glVertex3d(1, 1, 0);
 * gl.glTexCoord2d(0, 1);
 * gl.glVertex3d(0, 1, 0);
 * gl.glEnd(); 
 * 
 * Note that it is hard or impossible to texture
 * objects drawn with GLUT. Either define the
 * primitives of the object yourself (as seen
 * above) or add additional textured primitives
 * to the GLUT object.
 */
public class RobotRace extends Base {
    
    /** Array of the four robots. */
    private final Robot[] robots;

    /** Array of all trees. */
    private final Tree[] trees;
    
    /** Instance of the camera. */
    private final Camera camera;
    
    /** Instance of the race track. */
    private final RaceTrack raceTrack;
    
    /** Instance of the terrain. */
    private final Terrain terrain;

    /** Instance of the (more realistic) landscape. */
    private final Landscape landscape;

    /** Time difference for every robot. */
    private final double[] robotDeltaTime;

    /** Time for the track. */
    private double trackTime;
		
	/*========================================================================*/
	// GLOBAL METHODS
	/*========================================================================*/
	
    /**
     * Inner product of two 3D (or 2D) vectors {@code U} and {@code V}.
     */
    public double innerProduct(Vector U, Vector V) {
        // U.V = u_x v_x + u_y v_y + u_z v_z
        return U.x() * V.x() + U.y() * V.y() + U.z() * V.z();
    }

    /**
	 * Set the material.
	 * 
	 * @param material 
	 */
	public void applyMaterial(Material material) {
        // Set the diffuse levels of the material
		gl.glMaterialfv(GL_FRONT_AND_BACK, GL_DIFFUSE, material.diffuse, 0);
        // Set the specular levels of the material
		gl.glMaterialfv(GL_FRONT_AND_BACK, GL_SPECULAR, material.specular, 0);
        // Set the ambient levels of the material
        gl.glMaterialfv(GL_FRONT_AND_BACK, GL_AMBIENT, material.ambient, 0);
        // Set the shininess levels of the material
        gl.glMaterialf(GL_FRONT_AND_BACK, GL_SHININESS, material.shininess);
	}

    /**
     * Calculate {@code n} faculty.
     * 
     * @param  n
     * @return n!
     */
    public double faculty(double n) {
        if (n == 0) {
            // Base: faculty(0) = 1
            return 1;
        }
        // Assertion: faculty(n - 1) = (n - 1)!
        // Then: faculty(n) = n! = n * (n - 1)! = n * faculty(n - 1)
        return n * faculty(n - 1);
    }

    /**
     * Calculate binomial coefficients.
     * 
     * @param  n
     * @param  k
     * @return n! / (k! (n - k)!)
     */
    public double binomial(double n, double k) {
        // Binomial coefficient (n, k) := n! / (k! (n - k)!)
        return faculty(n) / (faculty(k) * faculty(n - k));
    }

    /**
     * Calculate a cubic bezier curve.
     * 
     * @param  t
     * @return
     */
    public Vector BezierCurve(double t, Vector[] controlPoints) {
        // The Beziercurve is the sum of the Bernstein polynomials
        Vector sum = new Vector(0, 0, 0);
        // Calculate the Beziercurve with n control points
        int n = controlPoints.length - 1;
        for (int i = 0; i <= n; i++) {
            sum = sum.add(controlPoints[i].scale(BernsteinPolynomial(i, n, t)));
        }
        return sum;
    }

    /**
     * Calculate the derivative of a Bezier curve.
     * 
     * @param  t              
     * @param  controlPoints Control points for the curve
     * @return Tangent at point t
     */
    public Vector BezierCurveTangent(double t, Vector[] controlPoints) {
        // Calculate the tangent of the Beziercurve
        Vector sum = new Vector(0, 0, 0);
        // For a Beziercurve with n control points
        int n = controlPoints.length - 1;
        for (int i = 0; i <= n - 1; i++) {
            sum = sum.add(controlPoints[i + 1].subtract(controlPoints[i]).scale(n * BernsteinPolynomial(i, n - 1, t)));
        }
        return sum;
    }

    /**
     * Get a point at a cubic Bezier curve.
     * 
     * @param  t  Parameter in [0, 1].
     * @param  P0 First point.
     * @param  P1 First control point.
     * @param  P2 Second control point.
     * @param  P3 Second point.
     * @return Bezier curve at parameter t.
     */
    public Vector getCubicBezierPnt(double t, Vector P0, Vector P1, Vector P2, Vector P3) {
        // A cubic Bezier curve is just a special case of a Bezier curve
        Vector[] vectors = new Vector[4];
        vectors[0] = P0;
        vectors[1] = P1;
        vectors[2] = P2;
        vectors[3] = P3;
        // So create a list with 4 points and give it to the Beziercurve method
        return BezierCurve(t, vectors);
    }

    /**
     * Get the tangent at a cubic Bezier curve.
     * 
     * @param  t  Parameter in [0, 1].
     * @param  P0 First point.
     * @param  P1 First control point.
     * @param  P2 Second control point.
     * @param  P3 Second point.
     * @return Bezier tangent at parameter t.
     */
    public Vector getCubicBezierTng(double t, Vector P0, Vector P1, Vector P2, Vector P3) {
        // A cubic Bezier curve is just a special case of a Bezier curve
        Vector[] vectors = new Vector[4];
        vectors[0] = P0;
        vectors[1] = P1;
        vectors[2] = P2;
        vectors[3] = P3;
        return BezierCurveTangent(t, vectors);
    }

    /**
     * Get the value of a Bernstein polynomial.
     * 
     * @param  i Parameter.
     * @param  n Parameter.
     * @param  t Parameter.
     * @return   Value of the Bernstein polynomial at point t.
     */
    public double BernsteinPolynomial(int i, int n, double t) {
        // Bernstein[i, n](t) := binomial(n, i) * t^i * (1 - t)^(n - i)
        return binomial(n, i) * Math.pow(t, i) * Math.pow(1 - t, n - i);
    }
	
	/*========================================================================*/
	// END GLOBAL METHODS
	/*========================================================================*/
    
    /**
     * Constructs this robot race by initializing robots,
     * camera, track, and terrain.
     */
    public RobotRace() {
        
        // Create a new array of four robots
        robots = new Robot[4];
        
        // Initialize robot 0
        robots[0] = new Robot(Material.GOLD
            /* add other parameters that characterize this robot */);
        
        // Initialize robot 1
        robots[1] = new Robot(Material.SILVER
            /* add other parameters that characterize this robot */);
        
        // Initialize robot 2
        robots[2] = new Robot(Material.WOOD
            /* add other parameters that characterize this robot */);

        // Initialize robot 3
        robots[3] = new Robot(Material.ORANGE
            /* add other parameters that characterize this robot */);

        // Initialize the trees
        trees = new Tree[3];
        // Tree with size 4.2
        trees[0] = new Tree(4.2);
        // Tree with size 5.0
        trees[1] = new Tree(5.0);
        // Tree with size 3.8
        trees[2] = new Tree(3.8);

        // Delta time for the robot (how far are they from the actual time)
        robotDeltaTime = new double[4];
        // Time difference for robot #1 such that at time t, robot #1 is at the location for time t + robotDeltaTime[0]
        robotDeltaTime[0] = 0;
        // Time difference for robot #2 such that at time t, robot #2 is at the location for time t + robotDeltaTime[1]
        robotDeltaTime[1] = 0;
        // Time difference for robot #3 such that at time t, robot #3 is at the location for time t + robotDeltaTime[2]
        robotDeltaTime[2] = 0;
        // Time difference for robot #4 such that at time t, robot #4 is at the location for time t + robotDeltaTime[3]
        robotDeltaTime[3] = 0;

        // Set the time of the track
        trackTime = 0;
        
        // Initialize the camera
        camera = new Camera();
        
        // Initialize the race track
        raceTrack = new RaceTrack();
        
        // Initialize the terrain
        terrain = new Terrain();

        // Initialize the landscape
        landscape = new Landscape();
    }
    
    /**
     * Called upon the start of the application.
     * Primarily used to configure OpenGL.
     */
    @Override
    public void initialize() {        
        // Enable blending.
        gl.glEnable(GL_BLEND);
        gl.glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
        
        // Enable anti-aliasing.
        gl.glHint(GL_LINE_SMOOTH_HINT, GL_NICEST);
        gl.glHint(GL_POLYGON_SMOOTH_HINT, GL_NICEST);
        
        // Enable depth testing.
        gl.glEnable(GL_DEPTH_TEST);
        gl.glDepthFunc(GL_LESS);
        
        // Enable textures. 
        gl.glEnable(GL_TEXTURE_2D);
        gl.glHint(GL_PERSPECTIVE_CORRECTION_HINT, GL_NICEST);
        gl.glBindTexture(GL_TEXTURE_2D, 0);
        
        // Initialize camera properties.
        gs.theta = 0.5f * 0.5f * (float)Math.PI;
        gs.phi = 0.5f * 0.5f * (float)Math.PI;

        // Setup the lighting
        initializeLighting();
    }

    /**
     * Initialize the lighting.
     */
    public void initializeLighting() {
        // Enable shading and lighting
        float[] ambientColor = {0.5f, 0.5f, 0.5f, 1f};
        gl.glEnable(GL_LIGHTING);
        gl.glShadeModel(GL_SMOOTH);
        gl.glEnable(GL_COLOR_MATERIAL);
        gl.glEnable(GL_NORMALIZE);
    }

    /**
     * Create lights.
     */
    public void createLights() {
        // Define the ambient lighting
        float strength = 0.3f;
        float[] ambientColor = {strength, strength, strength, strength};
        float[] ambientPosition = {0f, 0f, 20f, 0f};
        float[] ambientDiffuse = {1f, 1f, 1f, 1f};
        float[] ambientSpecular = {1f, 1f, 1f, 1f};

        // Enable the lightning
        gl.glLightfv(GL_LIGHT0, GL_AMBIENT, ambientColor, 0);
        gl.glLightfv(GL_LIGHT0, GL_POSITION, ambientPosition, 0);
        gl.glEnable(GL_LIGHT0);

        // Reposition the light at the left-top camera position.
        // We need to move the camera to the left.
        // This can be done by calculating (0, 0, 1) x (C - E) (which is "left").
        // Then, "up" is (0, 0, 1).
        Vector Vup = new Vector(0, 0, 1);
        Vector Vleft = Vup.cross(camera.center.subtract(camera.eye)).normalized();
        
        // Calculate the light position and convert to float array.
        // Light position = E + Vleft + Vup.
        Vector cameralightPosition = camera.eye.add(Vleft.scale(0.1)).add(Vup.scale(0.1));
        float[] fCameralightPosition = {
            (float)cameralightPosition.x(),
            (float)cameralightPosition.y(),
            (float)cameralightPosition.z()
        };
        
        // Calculate the light direction. This is simply C - E.
        float[] fCameralightDirection = {
            (float)camera.center.subtract(camera.eye).normalized().scale(40).x(),
            (float)camera.center.subtract(camera.eye).normalized().scale(40).y(),
            (float)camera.center.subtract(camera.eye).normalized().scale(40).z(),
            1f
        };
        
        // Now create a spotlight which starts at the camera light position
        // and goes in the direction of C - E with an angle of 60 degrees.
        float[] lightSpecular = {1f, 1f, 1f, 1f};
        float[] lightDiffuse = {1f, 1f, 1f, 0.5f};
        gl.glLightfv(GL_LIGHT1, GL_SPECULAR, lightSpecular, 0);
        gl.glLightfv(GL_LIGHT1, GL_DIFFUSE, lightDiffuse, 0);
        gl.glLightfv(GL_LIGHT1, GL_POSITION, fCameralightPosition, 0);
        gl.glLightf(GL_LIGHT1, GL_SPOT_CUTOFF, 40f);
        gl.glLightf(GL_LIGHT1, GL_SPOT_EXPONENT, 100f);
        gl.glLightfv(GL_LIGHT1, GL_SPOT_DIRECTION, fCameralightDirection, 0);
        gl.glEnable(GL_LIGHT1);
    }
    
    /**
     * Configures the viewing transform.
     */
    @Override
    public void setView() {
        // Select part of window.
        gl.glViewport(0, 0, gs.w, gs.h);
        
        // Set projection matrix.
        gl.glMatrixMode(GL_PROJECTION);
        gl.glLoadIdentity();

        // Set the perspective.
        // Modify this to meet the requirements in the assignment.
        // Let alpha be the viewing angle.
        // Then tan(1/2 alpha) = 1/2 * viewWidth / viewDistance
        // So alpha = 2 * arcTan(viewWidth / (2 * viewDistance))
        float alpha = 2f * (float)Math.atan(gs.vWidth / (2 * gs.vDist));
        glu.gluPerspective(40, (float)gs.w / (float)gs.h, 0.1 * gs.vDist, 10 * gs.vDist);
        
        // Set camera.
        gl.glMatrixMode(GL_MODELVIEW);
        gl.glLoadIdentity();
               
        // Update the view according to the camera mode
        camera.update(gs.camMode);
        glu.gluLookAt(camera.eye.x(),    camera.eye.y(),    camera.eye.z(),
                      camera.center.x(), camera.center.y(), camera.center.z(),
                      camera.up.x(),     camera.up.y(),     camera.up.z());

        // Create the lights before doing anything else
        createLights();
    }
    
    /**
     * Draws the entire scene.
     */
    @Override
    public void drawScene() {
        // Background color.
        gl.glClearColor(0f, 0f, 0f, 0f);
        
        // Clear background.
        gl.glClear(GL_COLOR_BUFFER_BIT);
        
        // Clear depth buffer.
        gl.glClear(GL_DEPTH_BUFFER_BIT);
        
        // Set color to black.
        gl.glColor3f(0f, 0f, 0f);
        
        gl.glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);
        
        // Draw the axis frame
        if (gs.showAxes) {
            drawAxisFrame();
        }
        
        //
        // Draw a horizontal line through the center point with width gs.vWidth and through
        // center point C, parallel with the XY-plane and perpendicular on the view
        // direction.
        //
        // So, the line can be represented as L(t) := C + t*W with W as vector
        // such that W perpendicular on V (=E-C) and in the XY-plane. If it is
        // in the XY-plane, it is perpendicular on the Z-axis. So, it is for
        // example perpendicular with (0, 0, 1).
        // Beware that V can be in the same direction as (0, 0, 1)! In that case,
        // we approach (0, 0, 1) by (0, 0, 0.999...).
        //
        Vector V = camera.eye.add(gs.cnt.scale(-1));
        Vector W;
        if (V.x() == 0 && V.y() == 0) {
            // Same direction! Use an approach for (0, 0, 1).
            W = V.cross(new Vector(0f, 0f, 0.99999f));
        } else {
            W = V.cross(new Vector(0f, 0f, 1f));
        }
        Vector C = gs.cnt;
        
        //
        // Let F and G be the begin point and end point respectively of the line
        // segment.
        // So we need to find a parameter t such that:
        // F = C - tW
        // G = C + tW
        // And |F-G| = gs.vWidth.
        // F-G=-tW-tW=-2tW
        // So gs.vWidth = |-2tW| = 2|t||W| and therefor |t|=gs.vWidth/(2|W|).
        // 
        double t = gs.vWidth / (2 * W.length());
        Vector F = C.add(W.scale(-t));
        Vector G = C.add(W.scale(t));
        
		gl.glPushMatrix();

        // Update the track timer
        trackTime = gs.tAnim / 20.0;

        // Draw all 4 robots
        for (int i = 0; i < 4; i++) {
            gl.glPushMatrix();

            // Calculate the time for this robot
            double robotTrackTime = trackTime + robotDeltaTime[i];

            // Calculate all directions and positions needed for the robots
            Vector position = raceTrack.getCurvePoint(robotTrackTime, gs.trackNr);
            // Calculate the direction of the robot
            Vector direction = raceTrack.getCurveTangent(robotTrackTime, gs.trackNr);
            // Calculate what is "left" for the robot
            Vector left = direction.cross(new Vector(0, 0, 1)).normalized();
            // Calculate what is "right" for the robot (= -left)
            Vector right = left.scale(-1);

            // Translate the robot such that it is on the desired position
            gl.glTranslated(position.x(), position.y(), position.z());

            // Go two meter to the left
            // And translate half the robot width to the right
            double robotWidth = 0.5;
            gl.glTranslated(left.scale(2).x(), left.scale(2).y(), left.scale(2).z());
            gl.glTranslated(right.scale(robotWidth).x(), right.scale(robotWidth).y(), right.scale(robotWidth).z());

            // Change the robot direction
            robots[i].setDirection(direction);
            robots[i].draw(gs.showStick);

            gl.glPopMatrix();

            // Translate one meter to the right for the next robot
            gl.glTranslated(right.x(), right.y(), right.z());

            // Variate the time of this robot the next time
            robotDeltaTime[i] += Math.random() * 0.002;
        }

        gl.glPopMatrix();

        // Reset the color
        applyMaterial(Material.BLACK);
        
        // Draw race track
        raceTrack.draw(gs.trackNr);
        
        // Draw terrain
        // Move 1.5 m lower
        gl.glTranslated(0, 0, -1.5);
        terrain.draw();

        // Draw trees on the terrain
        
        // First tree
        gl.glPushMatrix();
        // Translate such that is on the right position and right height
        // and move it somewhat lower such that it is in the ground
        gl.glTranslated(0, -3, terrain.heightAt(0f, 3f) - 0.5);
        trees[0].draw();
        gl.glPopMatrix();

        // Second tree
        gl.glPushMatrix();
        // Translate such that is on the right position and right height
        // and move it somewhat lower such that it is in the ground
        gl.glTranslated(12f, -10f, terrain.heightAt(12f, -10f) - 0.5);
        trees[1].draw();
        gl.glPopMatrix();
        
        // Last tree
        gl.glPushMatrix();
        // Translate such that is on the right position and right height
        // and move it somewhat lower such that it is in the ground
        gl.glTranslated(-15, 15, terrain.heightAt(-15f, 15f) - 0.5);
        trees[2].draw();
        gl.glPopMatrix();

        // Recover from the 1.5 m translation of the terrain
        gl.glTranslated(0, 0, 1.5);

        // Draw the landscape
        gl.glPushMatrix();
        gl.glTranslated(0, 0, -2);
        landscape.draw();
        gl.glPopMatrix();

        // Draw outer sphere
        // Set a blueish color for the atmosphere
        gl.glColor4d(135.0 / 256.0, 206.0 / 256.0, 250.0 / 256.0, 1.0);
        // Draw the atmosphere
        glut.glutSolidSphere(30, 100, 100);

        // Reset color
        gl.glColor4d(0, 0, 0, 1);
    }
    
    
    /**
     * Draws the x-axis (red), y-axis (green), z-axis (blue),
     * and origin (yellow).
     */
    public void drawAxisFrame() {
        // Set the size of the cube to 1m
        float cubeSize = 1f;

        // Set the radius of the sphere
        float sphereRadius = 0.1f * cubeSize;
        
        // Set the base and height of the cones
        float coneBase = 0.1f * cubeSize;
        float coneHeight = 0.5f * cubeSize;
        
        // Draw the axis cube (from (0, 0, 0) to (1, 1, 1))
        // Since the center of the cube will be (0.5, 0.5, 0.5), we need to
        // translate the cube a bit
        gl.glTranslatef(0.5f, 0.5f, 0.5f);
        // Draw the cube
        glut.glutWireCube(cubeSize);
        // Undo the translation
        gl.glTranslatef(-0.5f * cubeSize, -0.5f * cubeSize, -0.5f * cubeSize);
        
        // Draw the yellow sphere at (0, 0, 0)
        // First, set the color of the sphere
        applyMaterial(Material.YELLOW);
        // Then, draw the sphere
        glut.glutSolidSphere(sphereRadius, 30, 30);
        // Reset the color to black
        applyMaterial(Material.BLACK);
        
        //
        // The cones need first to be rotated when they are at the origin.
        // After the rotation, a translation is needed. So let V be the
        // coordinate vector. Let R be the rotation matrix and T be the translation
        // matrix. Then the transformed coordinates V' after the rotation
        // are V' = RV. The transformed coordinates V'' after the translation
        // are thus V'' = TV' = TRV. So, first the translation matrix need
        // to be applied and after that the rotation vector must be applied.
        // 
        
        // Draw the red cone at (1, 0, 0)
        // Set the color for the x-axis cone (red)
        applyMaterial(Material.RED);
        // Translate to (1, 0, 0)
        gl.glTranslatef(1f * cubeSize, 0f, 0f);
        // Now rotate over the y-axis
        gl.glRotatef(90f, 0f, 1f, 0f);
        // Draw the cone
        glut.glutSolidCone(coneBase, coneHeight, 20, 20);
        // Undo the rotation
        gl.glRotatef(-90f, 0f, 1f, 0f);
        // Undo the translation
        gl.glTranslatef(-1f * cubeSize, 0f, 0f);
        
        // Draw the green cone at (0, 1, 0)
        // Set the color for the y-axis cone (green)
        applyMaterial(Material.GREEN);
        // Translate to (0, 1, 0)
        gl.glTranslatef(0f, 1f * cubeSize, 0f);
        // Now rotate over the x-axis
        gl.glRotatef(-90f, 1f, 0f, 0f);
        // Draw the cone
        glut.glutSolidCone(coneBase, coneHeight, 20, 20);
        // Undo the rotation
        gl.glRotatef(90f, 1f, 0f, 0f);
        // Undo the translation
        gl.glTranslatef(0f, -1f * cubeSize, 0f);
        
        // Draw the blue cone at (0, 0, 1)
        // Set the color for the z-axis cone (blue)
        applyMaterial(Material.BLUE);
        // Translate to (0, 0, 1)
        gl.glTranslatef(0f, 0f, 1f * cubeSize);
        // Draw the cone
        glut.glutSolidCone(coneBase, coneHeight, 20, 20);
        // Undo the translation
        gl.glTranslatef(0f, 0f, -1f * cubeSize);
        
        // Reset the color
        applyMaterial(Material.BLACK);
    }
    
    /**
     * Materials that can be used for the robots.
     */
    public enum Material {
			
		/**
		 * Black material for testing purposes.
		 */
		BLACK (
            new float[] {0f, 0f, 0f, 0f},
            new float[] {0f, 0f, 0f, 0f},
            new float[] {0f, 0f, 0f, 0f},
            0f),
        
        /** 
         * Gold material properties.
         * Modify the default values to make it look like gold.
         */
        GOLD (
            new float[] {0.75164f, 0.60648f, 0.22648f, 1.0f},
            new float[] {0.628281f, 0.555802f, 0.366065f, 1.0f},
            new float[] {0.24725f, 0.1995f, 0.1045f, 1f},
            4f),
        
        /**
         * Silver material properties.
         * Modify the default values to make it look like silver.
         */
        SILVER (
            new float[] {0.50754f, 0.50754f, 0.50754f, 1.0f},
            new float[] {0.508273f, 0.508273f, 0.508273f, 1.0f},
            new float[] {0.19225f, 0.19225f, 0.19225f, 1f},
            4f),
        
        /** 
         * Wood material properties.
         * Modify the default values to make it look like wood.
         */
        WOOD (
            new float[] {1.0f, 1.0f, 1.0f, 1.0f},
            new float[] {0.3f, 0.1f, 0.1f, 1.0f},
            new float[] {0.3f, 0.106f, 0f, 1.0f},
            3f),
        
        /**
         * Orange material properties.
         * Modify the default values to make it look like orange.
         */
        ORANGE (
            new float[] {1.0f, 1.0f, 1.0f, 1.0f},
            new float[] {1.0f, 0.6f, 0.0f, 1.0f},
            new float[] {0.25f, 0.25f, 0.25f, 1.0f},
            1f),

        /**
         * Red material properties.
         * Modify the default values to make it look like red.
         */
        RED (
            new float[] {1.0f, 1.0f, 1.0f, 1.0f},
            new float[] {1.0f, 0.0f, 0.0f, 1.0f},
            new float[] {0f, 0f, 0f, 1f},
            0f),

        /**
         * BLUE material properties.
         * Modify the default values to make it look like BLUE.
         */
        BLUE (
            new float[] {1.0f, 1.0f, 1.0f, 1.0f},
            new float[] {0.0f, 0.0f, 1.0f, 1.0f},
            new float[] {0f, 0f, 0f, 1f},
            0f),

        /**
         * GREEN material properties.
         * Modify the default values to make it look like GREEN.
         */
        GREEN (
            new float[] {1.0f, 1.0f, 1.0f, 1.0f},
            new float[] {0.0f, 1.0f, 0.0f, 1.0f},
            new float[] {0f, 0f, 0f, 1f},
            0f),

        /**
         * LEAF material properties.
         * Modify the default values to make it look like LEAF.
         */
        LEAF (
            new float[] {1.0f, 1.0f, 1.0f, 1.0f},
            new float[] {0f, 0.1f, 0.0f, 1.0f},
            new float[] {0f, 0f, 0f, 1f},
            0f),

        /**
         * YELLOW material properties.
         * Modify the default values to make it look like YELLOW.
         */
        YELLOW (
            new float[] {1.0f, 1.0f, 1.0f, 1.0f},
            new float[] {1.0f, 1.0f, 0.0f, 1.0f},
            new float[] {0f, 0f, 0f, 1f},
            0f);
        
        /** The diffuse RGBA reflectance of the material. */
        public float[] diffuse;
        
        /** The specular RGBA reflectance of the material. */
        public float[] specular;

        /** The ambient RGBA reflectance of the material. **/
        public float[] ambient;

        /** The shininess reflectance of the material. **/
        public float shininess;
        
        /**
         * Constructs a new material with diffuse and specular properties.
         */
        private Material(float[] diffuse, float[] specular, float[] ambient, float shininess) {
            this.diffuse = diffuse;
            this.specular = specular;
            this.ambient = ambient;
            this.shininess = shininess;
        }
    }
    
    /**
     * Represents a Robot, to be implemented according to the Assignments.
     */
    private class Robot {
			
        // Angle for the left upper arm
		public double angleLUpperArm = 180.0;
        // Angle for the left lower arm
		public double angleLLowerArm = -0.0;
        // Angle for the left hand
		public double angleLHand = 5.0;
		
        // Angle for the right upper arm
		public double angleRUpperArm = 180.0;
        // Angle for the right lower arm
		public double angleRLowerArm = -0.0;
        // Angle for the right hand arm
		public double angleRHand = 5.0;
		
        // Angle for the left upper leg
		public double angleLUpperLeg = 0.0;
        // Angle for the left lower leg
		public double angleLLowerLeg = 0.0;
        // Angle for the left foot
		public double angleLFoot = 180.0;
		
        // Angle for the right upper leg
		public double angleRUpperLeg = 0.0;
        // Angle for the right lower leg
		public double angleRLowerLeg = 0.0;
        // Angle for the right foot
		public double angleRFoot = 180.0;
		
        // Angle for the head
		public double angleHead = 0;
        // Angle for the neck
		public double angleNeck = 0;
        // Angle for the torso
        public double angleTorso = 0;

        // The direction angle where the robot is looking to
        private double directionAngle = 0;

        // The period for the running animation
        private double period = 1;
        
        /** The material from which this robot is built. */
        private final Material material;
        
        /**
         * Constructs the robot with initial parameters.
         */
        public Robot(Material material
            /* add other parameters that characterize this robot */) {
            this.material = material;
            // Add some random integer to the period, to variate the animations
            // of the robots
            period = period + Math.random() / 10.0;
        }

        /**
         * Set the direction of the robot.
         * 
         * @param V Vector the robot looks with.
         */
        public void setDirection(Vector V) {
            // Let V be the direction vector
            // Then (0, 1, 0).V = |U|*|V|*cos(alpha)
            // So, alpha = ArcCos((0, 1, 0).V/(|U|*|V|))
            // But, alpha needs to be within -90 <= alpha < 90
            // So in other cases, we need to invert the direction angle
            Vector U = new Vector(0, 1, 0);
            double cosAlpha = V.dot(U) / (U.length() * V.length());
            double directionRadians = Math.acos(cosAlpha);
            this.directionAngle = 360 * directionRadians / (2 * Math.PI);
            if (V.x() > 0) {
                this.directionAngle = -this.directionAngle;
            }
        }

        public void update() {
            // Get the current time
            double time = gs.tAnim % period;
            // Get the relative time from the period
            // Such that t in [0, 1)
            double t = time / period;

            // Simulate human running motion
            angleTorso = -10;

            // Left upper arm goes from -40 degrees to -80
            angleLUpperArm = -40 * (Math.sin(t * 2 * Math.PI) + 1) / 2.0;
            // Right upper arm is the opposite motion of the left upper arm
            angleRUpperArm = -40 - angleLUpperArm;

            // When running, humans have their lower arm in a direction of 90 degrees (relative to the upper arm)
            angleLLowerArm = 90;
            angleRLowerArm = 90;

            // Let the right upper leg be the motion of the left upper arm, but then somewhat bigger
            angleRUpperLeg = 1.2 * angleLUpperArm + 10;
            // Same for the left upper leg
            angleLUpperLeg = 1.2 * angleRUpperArm + 10;

            // The lower leg is more to the back when you inspect human motion
            angleRLowerLeg = -80 * (Math.sin(t * 2 * Math.PI) + 1) / 2.0;
            // Same for the left lower leg
            angleLLowerLeg = -80 - angleRLowerLeg;
        }
        
        /**
         * Draws this robot (as a {@code stickfigure} if specified).
         */
        public void draw(boolean stickFigure) {
            // Update the motion
            update();

            // Apply the robot materials
			applyMaterial(this.material);

            // Rotate
            gl.glRotated(this.directionAngle, 0, 0, 1);
			
			// Left leg
			gl.glTranslatef(-0.2f, 0f, 0.8f);
			this.drawLeg(stickFigure, this.angleLUpperLeg, this.angleLLowerLeg, this.angleLFoot);
			gl.glTranslatef(0.2f, 0f, -0.8f);
			
			// Right leg
			gl.glTranslatef(0.2f, 0f, 0.8f);
			this.drawLeg(stickFigure, this.angleRUpperLeg, this.angleRLowerLeg, this.angleRFoot);
			gl.glTranslatef(-0.2f, 0f, -0.8f);
			
			// Torso
            Vector side = new Vector(1, 0, 0);
			gl.glTranslatef(0f, 0f, 0.8f);
            gl.glRotated(this.angleTorso, side.x(), side.y(), side.z());
			this.drawTorso(stickFigure);

            // Head
            gl.glTranslatef(0f, 0f, 0.7f);
            this.drawHead(stickFigure);
            gl.glTranslatef(0f, 0f, -0.7f);

            // Left arm
            gl.glTranslatef(-0.3f, 0f, 0.7f);
            this.drawArm(stickFigure, this.angleLUpperArm, this.angleLLowerArm, this.angleLHand);
            gl.glTranslatef(0.3f, 0f, -0.7f);
            
            // Right arm
            gl.glTranslatef(0.3f, 0f, 0.7f);
            this.drawArm(stickFigure, this.angleRUpperArm, this.angleRLowerArm, this.angleRHand);
            gl.glTranslatef(-0.3f, 0f, -0.7f);

            // Rotate back (torso)
            gl.glRotated(-this.angleTorso, side.x(), side.y(), side.z());

            // Translate back (torso)
			gl.glTranslatef(0f, 0f, -0.8f);

            // Rotate back
            gl.glRotated(this.directionAngle, 0, 0, -1);
        }
				
		public void drawHead(boolean stickFigure) {
			if (stickFigure) {
				gl.glBegin(GL_LINES);
				// Draw the neck
				gl.glVertex3f(0f, 0f, 0f);
				gl.glVertex3f(0f, 0f, 0.1f);

				// Draw the head
				gl.glVertex3f(0f, 0f, 0.1f);
				gl.glVertex3f(0f, 0f, 0.5f);
				gl.glEnd();
			} else {
				// Neck
				glut.glutSolidCylinder(0.05f, 0.1f + 0.15f / 2.0f, 30, 30);
				
				// Head
                head.bind(gl);
                gl.glColor4d(1, 1, 1, 1);
                gl.glBegin(GL_QUAD_STRIP);

                // Front (draw the face! :))
                gl.glNormal3d(0, 1, 0);
                gl.glTexCoord2d(0, 0);
                gl.glVertex3d(-0.15, 0.10, 0.1);
                gl.glTexCoord2d(1, 0);
                gl.glVertex3d(0.15, 0.10, 0.1);
                gl.glTexCoord2d(0, 1);
                gl.glVertex3d(-0.15, 0.10, 0.5);
                gl.glTexCoord2d(1, 1);
                gl.glVertex3d(0.15, 0.10, 0.5);

                gl.glColor4f(0, 0, 0, 1);

                // Top
                gl.glNormal3d(0, 0, 1);
                gl.glVertex3d(-0.15, -0.10, 0.5);
                gl.glVertex3d(0.15, -0.10, 0.5);

                // Back
                gl.glNormal3d(0, -1, 0);
                gl.glVertex3d(-0.15, -0.10, 0.1);
                gl.glVertex3d(0.15, -0.10, 0.1);
                gl.glEnd();

                gl.glBegin(GL_QUAD_STRIP);

                // Left
                gl.glNormal3d(-1, 0, 0);
                gl.glVertex3d(-0.15, -0.10, 0.5);
                gl.glVertex3d(-0.15, 0.10, 0.5);
                gl.glVertex3d(-0.15, -0.10, 0.1);
                gl.glVertex3d(-0.15, 0.10, 0.1);
                
                
                // Bottom
                gl.glNormal3d(0, 0, -1);
                gl.glVertex3d(0.15, -0.10, 0.1);
                gl.glVertex3d(0.15, 0.10, 0.1);
                
                // Right
                gl.glNormal3d(1, 0, 0);
                gl.glVertex3d(0.15, -0.10, 0.5);
                gl.glVertex3d(0.15, 0.10, 0.5);
                gl.glEnd();
               
               // And reset the color
               gl.glColor4f(0, 0, 0, 1);
			}
		}
				
		public void drawTorso(boolean stickFigure) {
			if (stickFigure) {
				gl.glBegin(GL_LINES);
				// Draw the back
				gl.glVertex3f(0f, 0f, 0f);
				gl.glVertex3f(0f, 0f, 0.7f);

				// Draw the shoulders
				gl.glVertex3f(-0.3f, 0f, 0.7f);
				gl.glVertex3f(0.3f, 0f, 0.7f);

				// Draw the hips
				gl.glVertex3f(-0.2f, 0f, 0.0f);
				gl.glVertex3f(0.2f, 0f, 0.0f);
				gl.glEnd();
			} else {
				gl.glTranslatef(0f, 0f, 0.7f / 2f);
				gl.glScalef(0.6f, 0.2f, 0.7f);
				
                // Torso
                torso.bind(gl);
                gl.glColor4d(1, 1, 1, 1);
                gl.glBegin(GL_QUAD_STRIP);
                // Front (draw the texture on the torso)
                gl.glNormal3d(0, 1, 0);
                gl.glTexCoord2d(0, 0);
                gl.glVertex3d(-0.5, 0.5, -0.5);
                gl.glTexCoord2d(1, 0);
                gl.glVertex3d(0.5, 0.5, -0.5);
                gl.glTexCoord2d(0, 1);
                gl.glVertex3d(-0.5, 0.5, 0.5);
                gl.glTexCoord2d(1, 1);
                gl.glVertex3d(0.5, 0.5, 0.5);

                gl.glColor4f(0, 0, 0, 1);

                // Top
                gl.glNormal3d(0, 0, 1);
                gl.glVertex3d(-0.5, -0.5, 0.5);
                gl.glVertex3d(0.5, -0.5, 0.5);

                // Back
                gl.glNormal3d(0, -1, 0);
                gl.glVertex3d(-0.5, -0.5, -0.5);
                gl.glVertex3d(0.5, -0.5, -0.5);
                gl.glEnd();

                gl.glBegin(GL_QUAD_STRIP);
                // Left
                gl.glNormal3d(-1, 0, 0);
                gl.glVertex3d(-0.5, -0.5, 0.5);
                gl.glVertex3d(-0.5, 0.5, 0.5);
                gl.glVertex3d(-0.5, -0.5, -0.5);
                gl.glVertex3d(-0.5, 0.5, -0.5);
                
                
                // Bottom
                gl.glNormal3d(0, 0, -1);
                gl.glVertex3d(0.5, -0.5, -0.5);
                gl.glVertex3d(0.5, 0.5, -0.5);
                
                // Right
                gl.glNormal3d(1, 0, 0);
                gl.glVertex3d(0.5, -0.5, 0.5);
                gl.glVertex3d(0.5, 0.5, 0.5);
                gl.glEnd();
               
                // Reset the color
                gl.glColor4f(0, 0, 0, 1);

    			gl.glScalef(1f / 0.6f, 1f / 0.2f, 1f / 0.7f);
    			gl.glTranslatef(0f, 0f, -0.7f / 2f);
			}
		}
		
		public void drawLeg(boolean stickFigure, double angleUpperLeg, double angleLowerLeg, double angleFoot) {
			// Upper leg rotation
			gl.glRotatef((float)angleUpperLeg, 1f, 0f, 0f);
			
			if (stickFigure) {
				gl.glBegin(GL_LINES);
				// Draw the upper leg
				gl.glVertex3f(0f, 0f, 0f);
				gl.glVertex3f(0f, 0f, -0.4f);
				gl.glEnd();
			} else {
				// Draw the upper leg
				glut.glutSolidCylinder(0.08f, -0.4f, 20, 20);
			}
			
			gl.glTranslatef(0f, 0f, -0.4f);
			gl.glRotatef((float)angleLowerLeg, 1f, 0f, 0f);
			if (stickFigure) {
				gl.glBegin(GL_LINES);
				// Draw the lower leg
				gl.glVertex3f(0f, 0f, 0f);
				gl.glVertex3f(0f, 0f, -0.4f);
				gl.glEnd();
			} else {
				// Draw lower leg
				glut.glutSolidCylinder(0.08f, -0.4f, 20, 20);
			}
			
			gl.glTranslatef(0f, 0f, -0.4f);
			gl.glRotatef((float)angleFoot, 1f, 0f, 0f);
			if (stickFigure) {
				gl.glBegin(GL_LINES);
				// Draw the foot
				gl.glVertex3f(0f, 0f, 0f);
				gl.glVertex3f(0f, 0f, 0.1f);
				gl.glEnd();
			} else {
				glut.glutSolidCylinder(0.08f, 0.1f, 20, 20);
			}
			
			// Undo all transformations
			gl.glRotatef(-(float)angleFoot, 1f, 0f, 0f);
			gl.glTranslatef(0f, 0f, 0.4f);
			
			gl.glRotatef(-(float)angleLowerLeg, 1f, 0f, 0f);
			gl.glTranslatef(0f, 0f, 0.4f);
			
			gl.glRotatef(-(float)angleUpperLeg, 1f, 0f, 0f);
		}
		
		public void drawArm(boolean stickFigure, double angleUpperArm, double angleLowerArm, double angleHand) {
			// Upper arm rotation
			gl.glRotatef((float)angleUpperArm, 1f, 0f, 0f);
			
			if (stickFigure) {
				gl.glBegin(GL_LINES);
				// Draw the upper arm
				gl.glVertex3f(0f, 0f, 0f);
				gl.glVertex3f(0f, 0f, -0.4f);
				gl.glEnd();
			} else {
				// Draw upper arm
				glut.glutSolidCylinder(0.08f, -0.4f, 20, 20);
			}
			
			// Lower arm translation and then rotation
			gl.glTranslatef(0f, 0f, -0.4f);
			gl.glRotatef((float)angleLowerArm, 1f, 0f, 0f);
			if (stickFigure) {
				gl.glBegin(GL_LINES);
				// Draw the lower arm
				gl.glVertex3f(0f, 0f, 0f);
				gl.glVertex3f(0f, 0f, -0.4f);
				gl.glEnd();
			} else {
				// Draw lower arm
				glut.glutSolidCylinder(0.08f, -0.4f, 20, 20);
			}
			
			// Hand translation and then rotation
			gl.glTranslatef(0f, 0f, -0.4f);
			gl.glRotatef((float)angleHand, 1f, 0f, 0f);
			if (stickFigure) {
				gl.glBegin(GL_LINES);
				// Draw the hand
				gl.glVertex3f(0f, 0f, 0f);
				gl.glVertex3f(0f, 0.1f, 0f);
				gl.glEnd();
			} else {
				glut.glutSolidCylinder(0.08f, 0.1f, 20, 20);
			}
			
			// Undo all transformations
			gl.glRotatef(-(float)angleHand, 1f, 0f, 0f);
			gl.glTranslatef(0f, 0f, 0.4f);
			
			gl.glRotatef(-(float)angleLowerArm, 1f, 0f, 0f);
			gl.glTranslatef(0f, 0f, 0.4f);
			
			gl.glRotatef(-(float)angleUpperArm, 1f, 0f, 0f);
		}
    }
    
    /**
     * Implementation of a camera with a position and orientation. 
     */
    private class Camera {
        
        /** The position of the camera. */
        public Vector eye = new Vector(3f, 6f, 5f);
        
        /** The point to which the camera is looking. */
        public Vector center = Vector.O;
        
        /** The up vector. */
        public Vector up = Vector.Z;
        
        /**
         * Updates the camera viewpoint and direction based on the
         * selected camera mode.
         */
        public void update(int mode) {
            // Helicopter mode
            if (1 == mode) {  
                setHelicopterMode();
                
            // Motor cycle mode
            } else if (2 == mode) { 
                setMotorCycleMode();
                
            // First person mode
            } else if (3 == mode) { 
                setFirstPersonMode();
                
            // Auto mode
            } else if (4 == mode) {
                // Switch every 4 seconds from camera
                // The camera modes are in this order:
                double period = 4;
                double timer = gs.tAnim % (3 * period);
                if (timer <= period) {
                    setHelicopterMode();
                } else if (timer <= 2 * period) {
                    setMotorCycleMode();
                } else if (timer <= 3 * period) {
                    setFirstPersonMode();
                }
            } else {
                setDefaultMode();
            }
        }
        
        /**
         * Computes {@code eye}, {@code center}, and {@code up}, based
         * on the camera's default mode.
         */
        private void setDefaultMode() {
            //
            // Define C as center point (given by gs.cnt).
            // Let E be the eye point and V=E-C (a vector from C to E).
            // Then E=C+V.
            //
            // Given: |V| (gs.vDist), φ (gs.phi), θ (gs.theta) with:
            //    |V|:  Lenth of vector V.
            //    φ:    Angle between positive X-axis and V projected on the XY-plane.
            //    θ:    Angle between V and V projected on the XY-plane.
            //
            // Now we can calculate V = (x, y, z):
            //    z = |V| * sin(φ)
            //    
            // Let V' be V projected on the XY-plane. Then:
            //    |V'| = |V| * cos(φ)
            //
            // From this we get:
            //     x = |V'| * cos(θ)
            //     y = |V'| * sin(θ)
            //
            // Thus:
            //     V = (x, y, z) = (|V|cos(θ)cos(φ), |V|sin(θ)cos(φ), |V|sin(φ))
                
            Vector V = new Vector(
                gs.vDist * Math.cos(gs.theta) * Math.cos(gs.phi),
                gs.vDist * Math.sin(gs.theta) * Math.cos(gs.phi),
                gs.vDist * Math.sin(gs.phi)
            );
            
            // Thus, eye point E = C + V
            this.eye = gs.cnt.add(V);
            this.center = gs.cnt;
        }

        /**
         * View from top (fixed). Computes {@code eye}, {@code center} and {@code up}.
         */
        private void setTopMode() {
            // Set the view from above
            this.eye = new Vector(0, 0, gs.phi * 100);
            this.center = new Vector(1, 1, 1);
        }
        
        /**
         * Computes {@code eye}, {@code center}, and {@code up}, based
         * on the helicopter mode.
         */
        private void setHelicopterMode() {
            // First find out what the avarage position of the robots is
            double sum = 0;
            for (int i = 0; i < 4; i++) {
                sum += robotDeltaTime[i];
            }
            double avgDeltaTime = sum / 4;
            double time = trackTime + avgDeltaTime;

            // Then go a little to the back and a little upward
            Vector center = raceTrack.getCurvePoint(time, gs.trackNr);
            Vector tangent = raceTrack.getCurveTangent(time, gs.trackNr).normalized();
            this.center = center;
            Vector eye = center.subtract(tangent.scale(8)).add(new Vector(0, 0, 8));
            this.eye = eye;
        }
        
        /**
         * Computes {@code eye}, {@code center}, and {@code up}, based
         * on the motorcycle mode.
         */
        private void setMotorCycleMode() {
            // Find the leading robot
            double max = 0;
            for (int i = 0; i < 4; i++) {
                if (robotDeltaTime[i] > max) max = robotDeltaTime[i];
            }
            double time = trackTime + max;

            // Now go to the left
            Vector center = raceTrack.getCurvePoint(time, gs.trackNr);
            Vector tangent = raceTrack.getCurveTangent(time, gs.trackNr).normalized();
            Vector left = tangent.cross(up).normalized().scale(5);
            this.eye = center.add(left.scale(1.1)).add(new Vector(0, 0, 2));
            this.center = center;
        }
        
        /**
         * Computes {@code eye}, {@code center}, and {@code up}, based
         * on the first person mode.
         */
        private void setFirstPersonMode() {
            // Find the last robot
            double min = -1;
            for (int i = 0; i < 4; i++) {
                if (robotDeltaTime[i] < min || min == -1) min = robotDeltaTime[i];
            }
            double time = trackTime + min;

            // Now go a bit forward and upward
            Vector position = raceTrack.getCurvePoint(time, gs.trackNr);
            Vector tangent = raceTrack.getCurveTangent(time, gs.trackNr).normalized();
            this.eye = position.add(new Vector(0, 0, 1.8));
            this.center = this.eye.add(tangent.scale(4)).add(new Vector(0, 0, -0.3));
        }
        
    }
    
    /**
     * Implementation of a race track that is made from Bezier segments.
     */
    private class RaceTrack {
        
        /** Array with control points for the O-track. */
        private Vector[] controlPointsOTrack;
        
        /** Array with control points for the L-track. */
        private Vector[] controlPointsLTrack;
        
        /** Array with control points for the C-track. */
        private Vector[] controlPointsCTrack;
        
        /** Array with control points for the custom track. */
        private Vector[] controlPointsCustomTrack;

        /** Size of the tracks */
        private double trackSize = 4.0;

        private int steps = 200;
        
        /**
         * Constructs the race track, sets up display lists.
         */
        public RaceTrack() {
            initOTrack();
            initLTrack();
            initCTrack();
            initCustomTrack();
        }

        /**
         * Initialize the control points of the custom track (8-shape).
         */
        private void initCustomTrack() {
            Vector[] controlPoints;
            controlPoints = new Vector[0];
            controlPoints = addStartPoint(controlPoints, new Vector(0.5, 1, 0));
            controlPoints = addBezierCurve(
                controlPoints,
                new Vector(1, 1, 0),
                new Vector(1, 0.5, 0),
                new Vector(0.5, 0.5, 0)
            );
            controlPoints = addBezierCurve(
                controlPoints,
                new Vector(0, 0.5, 0),
                new Vector(0, 0, 0),
                new Vector(0.5, 0, 0)
            );
            controlPoints = addBezierCurve(
                controlPoints,
                new Vector(1, 0, 0),
                new Vector(1, 0.5, 0),
                new Vector(0.5, 0.5, 0)
            );
            controlPoints = addBezierCurve(
                controlPoints,
                new Vector(0, 0.5, 0),
                new Vector(0, 1, 0),
                new Vector(0.5, 1, 0)
            );
           
            controlPoints = scale(controlPoints, 30);
            controlPoints = translate(controlPoints, -20, -20);
            controlPoints = inset(controlPoints, 40, 40, trackSize);
            controlPointsCustomTrack = controlPoints;
        }

        /**
         * Initialize the control points of the C track.
         */
        private void initCTrack() {
            Vector[] controlPoints;
            controlPoints = new Vector[0];
            controlPoints = addStartPoint(controlPoints, new Vector(0.5, 1, 0));
            controlPoints = addBezierCurve(
                controlPoints,
                new Vector(0, 1, 0),
                new Vector(0, 0, 0),
                new Vector(0.5, 0, 0)
            );
            controlPoints = addBezierCurve(
                controlPoints,
                new Vector(1, 0, 0),
                new Vector(1, 0.25, 0),
                new Vector(0.5, 0.25, 0)
            );
            controlPoints = addBezierCurve(
                controlPoints,
                new Vector(0.25, 0.25, 0),
                new Vector(0.25, 0.75, 0),
                new Vector(0.5, 0.75, 0)
            );
            controlPoints = addBezierCurve(
                controlPoints,
                new Vector(1, 0.75, 0),
                new Vector(1, 1, 0),
                new Vector(0.5, 1, 0)
            );
            controlPoints = scale(controlPoints, 30);
            controlPoints = translate(controlPoints, -20, -20);
            controlPoints = inset(controlPoints, 40, 40, trackSize);
            controlPointsCTrack = controlPoints;
        }

        /**
         * Initialize the control points of the L track.
         */
        private void initLTrack() {
            Vector[] controlPoints;
            controlPoints = new Vector[0];
            controlPoints = addStartPoint(controlPoints, new Vector(0, 0.75, 0));
            controlPoints = addBezierCurve(
                controlPoints,
                new Vector(0, 1, 0),
                new Vector(0.25, 1, 0),
                new Vector(0.25, 0.75, 0)
            );
            controlPoints = addLine(controlPoints, new Vector(0.25, 0.30, 0));
            controlPoints = addBezierCurve(
                controlPoints,
                new Vector(0.25, 0.25, 0),
                new Vector(0.25, 0.25, 0),
                new Vector(0.30, 0.25, 0)
            );
            controlPoints = addLine(controlPoints, new Vector(0.4, 0.25, 0));
            controlPoints = addBezierCurve(
                controlPoints,
                new Vector(0.5, 0.25, 0),
                new Vector(0.5, 0, 0),
                new Vector(0.4, 0, 0)
            );
            controlPoints = addLine(controlPoints, new Vector(0.3, 0, 0));
            controlPoints = addBezierCurve(
                controlPoints,
                new Vector(0, 0, 0),
                new Vector(0, 0, 0),
                new Vector(0, 0.3, 0)
            );
            controlPoints = addLine(controlPoints, new Vector(0, 0.75, 0));
           
            controlPoints = scale(controlPoints, 30);
            controlPoints = translate(controlPoints, -20, -20);
            controlPoints = inset(controlPoints, 40, 40, trackSize);
            controlPointsLTrack = controlPoints;
        }

        /**
         * Initialize the control points of the O track.
         */
        private void initOTrack() {
            Vector[] controlPoints;
            controlPoints = new Vector[0];
            controlPoints = addStartPoint(controlPoints, new Vector(0.5, 1, 0));
            controlPoints = addBezierCurve(
                controlPoints,
                new Vector(0, 1, 0),
                new Vector(0, 0, 0),
                new Vector(0.5, 0, 0)
            );
            controlPoints = addBezierCurve(
                controlPoints,
                new Vector(1, 0, 0),
                new Vector(1, 1, 0),
                new Vector(0.5, 1, 0)
            );

            controlPoints = scale(controlPoints, 30);
            controlPoints = translate(controlPoints, -20, -20);
            controlPoints = inset(controlPoints, 40, 40, trackSize);
            controlPointsOTrack = controlPoints;
        }

        /**
         * Add a Bezier curve by specifying its control points {@code P1} and {@code P2} 
         * and an end point {@code P3}.
         */
        private Vector[] addBezierCurve(Vector[] controlPoints, Vector P1, Vector P2, Vector P3) {
            Vector points[] = new Vector[controlPoints.length + 3];
            // Copy the existing points
            for (int i = 0; i < controlPoints.length; i++) {
                points[i] = controlPoints[i];
            }
            // Add the new points for the Beziercurve
            Vector startPoint = controlPoints[controlPoints.length - 1];
            points[(points.length - 1) - 2] = P1;
            points[(points.length - 1) - 1] = P2;
            points[(points.length - 1) - 0] = P3;
            return points;
        }

        /**
         * Add a line by specifying an endpoint {@code endPoint}.
         */
        private Vector[] addLine(Vector[] controlPoints, Vector endPoint) {
            Vector points[] = new Vector[controlPoints.length + 3];
            // Copy the existing points
            for (int i = 0; i < controlPoints.length; i++) {
                points[i] = controlPoints[i];
            }
            // Add the Beziercurve points that simulates a line
            Vector startPoint = controlPoints[controlPoints.length - 1];
            Vector Q1 = endPoint;
            Vector Q2 = startPoint;
            points[(points.length - 1) - 2] = Q1;
            points[(points.length - 1) - 1] = Q2;
            points[(points.length - 1) - 0] = endPoint;
            return points;
        }

        /**
         * Add a start point {@code startPoint} to the control points.
         */
        private Vector[] addStartPoint(Vector[] controlPoints, Vector startPoint) {
            // Very simple: initialize and add a point
            controlPoints = new Vector[1];
            controlPoints[0] = startPoint;
            return controlPoints;
        }

        /**
         * Scale all control points by {@code scale}.
         */
        private Vector[] scale(Vector[] controlPoints, double scale) {
            // Scale all control points
            for (int i = 0; i < controlPoints.length; i++) {
                double x = scale * controlPoints[i].x();
                double y = scale * controlPoints[i].y();
                double z = scale * controlPoints[i].z();
                controlPoints[i] = new Vector(x, y, z);
            }
            return controlPoints;
        }

        /**
         * Translate all controlpoints by x coordinate {@code x} and y coordinate {@code y}.
         */
        private Vector[] translate(Vector[] controlPoints, double x, double y) {
            // Translate all control points
            for (int i = 0; i < controlPoints.length; i++) {
                // Add x to the control point x coordinate
                double Px = x + controlPoints[i].x();
                // Add y to the control point x coordinate
                double Py = y + controlPoints[i].y();
                double Pz = controlPoints[i].z();
                controlPoints[i] = new Vector(Px, Py, Pz);
            }
            return controlPoints;
        }

        /**
         * Inset all control points such that there is a padding of {@code inset}
         * around all {@code controlPoints}. All control points must reside in [0, width)
         * and [0, height).
         */
        private Vector[] inset(Vector[] controlPoints, double width, double height, double inset) {
            // Inset all controlpoints
            for (int i = 0; i < controlPoints.length; i++) {
                double x = controlPoints[i].x();
                double y = controlPoints[i].y();
                double z = controlPoints[i].z();
                if (x > 0.5 * width) {
                    // Inset x
                    x = x - inset;
                } else if (x < 0.5 * width) {
                    // Inset x
                    x = x + inset;
                }
                if (y > 0.5 * height) {
                    // Inset y
                    y = y - inset;
                } else if (y < 0.5 * height) {
                    // Inset y
                    y = y + inset;
                }
                controlPoints[i] = new Vector(x, y, z);
            }
            return controlPoints;
        }

        /**
         * Draw the track from the track with track number {@code trackNr}.
         */
        public void drawTrack(int trackNr) {
            for (int i = 0; i < steps; i++) {
                // Loop through all steps and draw all (mini) parts of the track
                drawTrackPart(i / (float)steps, (i + 1) / (float)steps, trackNr);
            }
        }

        /**
         * Draw the part of track with track number {@code trackNr} with
         * {@code tStart} <= t <= {@code tEnd}.
         */
        public void drawTrackPart(double tStart, double tEnd, int trackNr) {
            // Calculate global directions
            Vector up = new Vector(0, 0, 1);
            Vector down = up.scale(-1);

            Vector P1 = getCurvePoint(tStart, trackNr);
            Vector P2 = getCurvePoint(tEnd, trackNr);
            Vector P3 = getCurvePoint((tEnd + (tEnd - tStart)) % 1, trackNr);
            
            // Calculate local directions
            Vector forward1 = P2.subtract(P1);
            Vector left1 = forward1.cross(up).normalized().scale(2);
            Vector right1 = left1.scale(-1);
            Vector forward2 = P3.subtract(P2);
            Vector left2 = forward2.cross(up).normalized().scale(2);
            Vector right2 = left2.scale(-1);

            // Calculate all vertexes
            Vector Q0 = P1.add(left1).add(down);
            Vector Q1 = P2.add(left2).add(down);
            Vector Q2 = P1.add(left1);
            Vector Q3 = P2.add(left2);
            Vector Q4 = P1.add(right1);
            Vector Q5 = P2.add(right2);
            Vector Q6 = Q4.add(down);
            Vector Q7 = Q5.add(down);

            // Calculate all normals
            Vector N0 = forward1.cross(new Vector(0, 0, 1)).scale(-1);
            Vector N1 = forward2.cross(new Vector(0, 0, 1)).scale(-1);
            Vector N2 = N0;
            Vector N3 = N1;
            Vector N4 = N0.scale(-1);
            Vector N5 = N1.scale(-1);
            Vector N6 = N4;
            Vector N7 = N5;

            // And now draw all the vertexes
            int repeat = (int)((float)getTrackLength(trackNr) / 1.5);
            double texStart = tStart * repeat % 1;
            double texEnd = tEnd * repeat % 1;
            gl.glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
            gl.glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
            if (texEnd < texStart) {
                texEnd = 1;
            }

            // Left side
            gl.glColor3d(1, 1, 1);
            brick.bind(gl);
            gl.glBegin(GL_QUADS);
            gl.glTexCoord2d(texStart, 0);
            gl.glNormal3d(N4.x(), N4.y(), N4.z());
            gl.glVertex3d(Q4.x(), Q4.y(), Q4.z());

            gl.glTexCoord2d(texEnd, 0);
            gl.glNormal3d(N5.x(), N5.y(), N5.z());
            gl.glVertex3d(Q5.x(), Q5.y(), Q5.z());

            gl.glTexCoord2d(texEnd, 1);
            gl.glNormal3d(N7.x(), N7.y(), N7.z());
            gl.glVertex3d(Q7.x(), Q7.y(), Q7.z());

            gl.glTexCoord2d(texStart, 1);
            gl.glNormal3d(N4.x(), N4.y(), N4.z());
            gl.glVertex3d(Q6.x(), Q6.y(), Q6.z());
            gl.glEnd();

            // Right side
            gl.glColor3d(1, 1, 1);
            brick.bind(gl);
            gl.glBegin(GL_QUADS);
            gl.glTexCoord2d(texStart, 0);
            gl.glNormal3d(N0.x(), N0.y(), N0.z());
            gl.glVertex3d(Q0.x(), Q0.y(), Q0.z());

            gl.glTexCoord2d(texEnd, 0);
            gl.glNormal3d(N1.x(), N1.y(), N1.z());
            gl.glVertex3d(Q1.x(), Q1.y(), Q1.z());

            gl.glTexCoord2d(texEnd, 1);
            gl.glNormal3d(N3.x(), N3.y(), N3.z());
            gl.glVertex3d(Q3.x(), Q3.y(), Q3.z());

            gl.glTexCoord2d(texStart, 1);
            gl.glNormal3d(N2.x(), N2.y(), N2.z());
            gl.glVertex3d(Q2.x(), Q2.y(), Q2.z());
            gl.glEnd();

            // Top
            gl.glColor3d(1, 1, 1);
            track.bind(gl);
            gl.glBegin(GL_QUADS);
            gl.glTexCoord2d(0, 0);
            gl.glNormal3d(N2.x(), N2.y(), N2.z());
            gl.glVertex3d(Q2.x(), Q2.y(), Q2.z());

            gl.glTexCoord2d(0, 1);
            gl.glNormal3d(N3.x(), N3.y(), N3.z());
            gl.glVertex3d(Q3.x(), Q3.y(), Q3.z());

            gl.glTexCoord2d(1, 0);
            gl.glNormal3d(N5.x(), N5.y(), N5.z());
            gl.glVertex3d(Q5.x(), Q5.y(), Q5.z());

            gl.glTexCoord2d(1, 1);
            gl.glNormal3d(N4.x(), N4.y(), N4.z());
            gl.glVertex3d(Q4.x(), Q4.y(), Q4.z());
            gl.glEnd();
        }
        
        /**
         * Draws this track, based on the selected track number.
         */
        public void draw(int trackNr) { 
            // The test track is selected
            if (0 == trackNr) {
                drawTrack(trackNr);
            // The O-track is selected
            } else if (1 == trackNr) {
                drawTrack(trackNr);
            // The L-track is selected
            } else if (2 == trackNr) {
                drawTrack(trackNr);
            // The C-track is selected
            } else if (3 == trackNr) {
                drawTrack(trackNr);
            // The custom track is selected (8-track)
            } else if (4 == trackNr) {
                drawTrack(trackNr);
            }
        }

        /**
         * Get the length of the track.
         * 
         * @param  trackNr Identifier of the track.
         * @return         Length of the track.
         */
        public double getTrackLength(int trackNr) {
            Vector previousPoint = getCurvePoint(0, trackNr);
            double sum = 0;
            // Just add up all lengths between every two points that are after each other
            for (int i = 1; i <= steps; i++) {
                double t = (double)i / (double)steps;
                Vector point = getCurvePoint(t, trackNr);
                double length = point.subtract(previousPoint).length();
                sum += length;
                previousPoint = point;
            }
            return sum;
        }

        /**
         * Get the relative time in a segment.
         * 
         * @param  t             Global time.
         * @param  controlPoints All control points.
         * @return               Relative time in a segment.
         */
        public double getSegmentTime(double t, Vector[] controlPoints) {
            // Bring t back in interval [0, 1)
            t = t % 1;

             // Calculate # segments
            double segmentCount = (controlPoints.length - 1) / 3.0;

            // Calculate in which segment the t falls
            int segment = (int)(t * segmentCount) % (int)segmentCount;

            // Calculate relative t
            double tRel = t * segmentCount - segment;

            return tRel;
        }

        /**
         * Get all points of a segment.
         *
         * @param  t Global time.
         * @param  controlPoints All control points.
         * @return All points of the segment where the t is in.
         */
        public Vector[] getSegmentPoints(double t, Vector[] controlPoints) {
            // Bring t back in interval [0, 1)
            t = t % 1;

            // Calculate # segments
            double segmentCount = (controlPoints.length - 1) / 3.0;

            // Calculate in which segment the t falls
            int segment = (int)(t * segmentCount) % (int)segmentCount;

            // Calculate relative t
            double tRel = t * segmentCount - segment;

            // Calculate the cubic Bezier curve points
            Vector[] segmentPoints = new Vector[4];
            segmentPoints[0] = controlPoints[3 * segment];
            segmentPoints[1] = controlPoints[3 * segment + 1];
            segmentPoints[2] = controlPoints[3 * segment + 2];
            segmentPoints[3] = controlPoints[3 * segment + 3];

            return segmentPoints;
        }

        /**
         * Get a point at the current curve.
         *
         * @param  t             Parameter 0 <= {@code t} <= 1.
         * @param  trackNr       The number of the track.
         * @return               Point at curve at time {@code t}.
         */
        public Vector getCurvePoint(double t, int trackNr) {
            if (trackNr == 0) {
                return getPoint(t);
            } else if (1 == trackNr) {
                return getCurvePoint(t, controlPointsOTrack);
            // The L-track is selected
            } else if (2 == trackNr) {
                return getCurvePoint(t, controlPointsLTrack);
            // The C-track is selected
            } else if (3 == trackNr) {
                return getCurvePoint(t, controlPointsCTrack);
            // The custom track is selected (8-track)
            } else if (4 == trackNr) {
                return getCurvePoint(t, controlPointsCustomTrack);
            }
            return new Vector(0, 0, 0);
        }

        /**
         * Get the tangent at the current curve.
         * 
         * @param  t             Parameter 0 <= {@code t} <= 1.
         * @param  trackNr       The number of the track.
         * @return               Tangent at curve at time {@code t}.
         */
        public Vector getCurveTangent(double t, int trackNr) {
            if (trackNr == 0) {
                return getTangent(t);
            } else if (1 == trackNr) {
                return getCurveTangent(t, controlPointsOTrack);
            // The L-track is selected
            } else if (2 == trackNr) {
                return getCurveTangent(t, controlPointsLTrack);
            // The C-track is selected
            } else if (3 == trackNr) {
                return getCurveTangent(t, controlPointsCTrack);
            // The custom track is selected (8-track)
            } else if (4 == trackNr) {
                return getCurveTangent(t, controlPointsCustomTrack);
            }
            return new Vector(0, 0, 0);
        }

        /**
         * Get a point at a curve.
         * 
         * @param  t             Parameter 0 <= {@code t} <= 1.
         * @param  controlPoints Control points for the curve.
         * @return               Point at curve (based on {@code controlPoints}) at time {@code t}.
         */
        public Vector getCurvePoint(double t, Vector[] controlPoints) {
            Vector[] segmentPoints = getSegmentPoints(t, controlPoints);
            return BezierCurve(getSegmentTime(t, controlPoints), segmentPoints);
        }

        /**
         * Get the tangent at a curve.
         * 
         * @param  t             Parameter 0 <= {@code t} <= 1.
         * @param  controlPoints Control points for the curve.
         * @return               Tangent at curve (based on {@code controlPoints}) at time {@code t}.
         */
        public Vector getCurveTangent(double t, Vector[] controlPoints) {
            Vector[] segmentPoints = getSegmentPoints(t, controlPoints);
            return BezierCurveTangent(getSegmentTime(t, controlPoints), segmentPoints).normalized().scale(3);
        }
        
        /**
         * Returns the position of the curve at 0 <= {@code t} <= 1.
         */
        public Vector getPoint(double t) {
            // P(t) = (10 cos(2 Pi t), 14 sin(2 Pi t), 1)
            Vector P = new Vector(
                10 * Math.cos(2 * Math.PI * t),
                14 * Math.sin(2 * Math.PI * t),
                0
            );
            
            return P;
        }
        
        /**
         * Returns the tangent of the curve at 0 <= {@code t} <= 1.
         */
        public Vector getTangent(double t) {
            // T(t) = P'(t) = (- 10 * 2 * Pi * sin(2 Pi t), 14 * 2 * Pi * cos(2 Pi t), 0)
            Vector T = new Vector(
                -10 * 2 * Math.PI * Math.sin(2 * Math.PI * t),
                14 * 2 * Math.PI * Math.cos(2 * Math.PI * t),
                0
            );

            return T;
        }
        
    }
    
    /**
     * Implementation of the terrain.
     */
    private class Terrain {

        private int uSteps = 200;
        private int vSteps = 200;
        private double[][] xCoordinate;
        private double[][] yCoordinate;
        private double[][] zCoordinate;
        private Vector[][] normals;
        private double[][] rValue;
        private double[][] gValue;
        private double[][] bValue;
        
        /**
         * Can be used to set up a display list.
         */
        public Terrain() {
            // Initialize the terrain
            // Such that all information is available for all
            // (u, v) coordinates.
            // List with x coordinates
            xCoordinate = new double[uSteps][vSteps];
            // List with y coordinates
            yCoordinate = new double[uSteps][vSteps];
            // List with z coordinates
            zCoordinate = new double[uSteps][vSteps];
            // List with red values
            rValue = new double[uSteps][vSteps];
            // List with green values
            gValue = new double[uSteps][vSteps];
            // List with blue values
            bValue = new double[uSteps][vSteps];
            // List with the normals
            normals = new Vector[uSteps][vSteps];
            for (int u = 0; u < uSteps; u++) {
                for (int v = 0; v < vSteps; v++) {
                    // Calculate the coordinates
                    double x = 40 * u / (uSteps - 1) - 20;
                    double y = 40 * v / (vSteps - 1) - 20;
                    double z = (double)heightAt((float)x, (float)y);
                    // Calculate the normal
                    Vector Vx = new Vector(1, 0, dX(x, y));
                    Vector Vy = new Vector(0, 1, dY(x, y));
                    Vector normal = Vy.cross(Vx);
                    // Set the coordinates
                    xCoordinate[u][v] = x;
                    yCoordinate[u][v] = y;
                    zCoordinate[u][v] = z;
                    // Set the normal
                    normals[u][v] = normal;
                    if (z < 0) {
                        // Below 0, we simulate a blue water color
                        rValue[u][v] = 0;
                        gValue[u][v] = 0;
                        bValue[u][v] = 1;
                    } else if (z <= 0.5f) {
                        // Between 0 and 0.5, we simulate sand by a yellow color
                        rValue[u][v] = 0.5;
                        gValue[u][v] = 0.5;
                        bValue[u][v] = 0;
                    } else {
                        // Above 0.5 we simulate a green color
                        rValue[u][v] = 0;
                        gValue[u][v] = 1;
                        bValue[u][v] = 0;
                    }
                }
            }
        }
        
        /**
         * Draws the terrain.
         */
        public void draw() {
            // Draw all (u, v) pairs
            for (int u = 0; u < uSteps - 1; u++) {
                for (int v = 0; v < vSteps - 1; v++) {
                    gl.glBegin(GL_QUADS);
                    initVertex(u, v);
                    initVertex(u + 1, v);
                    initVertex(u + 1, v + 1);
                    initVertex(u, v + 1);
                    gl.glEnd();
                }
            }

            // Add a transparant plane at z = 0
            gl.glColor4d(0.125, 0.125, 0.25, 0.8);
            gl.glBegin(GL_QUADS);
            gl.glVertex3d(-20, -20, 0);
            gl.glVertex3d(-20, 20, 0);
            gl.glVertex3d(20, 20, 0);
            gl.glVertex3d(20, -20, 0);
            gl.glEnd();

            // Reset the color
            gl.glColor4d(0, 0, 0, 1);
        }

        /**
         * Initialize a vertex.
         * 
         * @param u
         * @param v
         */
        private void initVertex(int u, int v) {
            gl.glColor3d(rValue[u][v], gValue[u][v], bValue[u][v]);
            gl.glNormal3d(normals[u][v].x(), normals[u][v].y(), normals[u][v].z());
            gl.glVertex3d(xCoordinate[u][v], yCoordinate[u][v], zCoordinate[u][v]);
        }

        /**
         * Get the derivative.
         * 
         * @param  x
         * @param  y
         * @return df(x, y) / dx
         */
        private double dX(double x, double y) {
            return -0.4 * Math.sin(x - 0.5 * y) - 0.3 * Math.sin(0.3 * x + 0.2 * y);
        }

        /**
         * Get the derivative.
         * 
         * @param  x
         * @param  y
         * @return df(x, y) / dy
         */
        private double dY(double x, double y) {
            return 0.2 * Math.sin(x - 0.5 * y) - 0.2 * Math.sin(0.3 * x + 0.2 * y);
        }
        
        /**
         * Computes the elevation of the terrain at ({@code x}, {@code y}).
         */
        public float heightAt(float x, float y) {
            return (float)Math.cos(0.3f * x + 0.2f * y) + 0.4f * (float)Math.cos(x - 0.5f * y);
        }
    }

    /**
     * Implementation of the (more realistic) landscape.
     */
    private class Landscape {

        private int uSteps = 10;
        private int vSteps = 10;
        private double[][] xCoordinate;
        private double[][] yCoordinate;
        private double[][] zCoordinate;
        private Vector[][] normals;
        private double[][] rValue;
        private double[][] gValue;
        private double[][] bValue;
        
        /**
         * Can be used to set up a display list.
         */
        public Landscape() {
            // Just as in terrain, initialize all lists
            xCoordinate = new double[uSteps][vSteps];
            yCoordinate = new double[uSteps][vSteps];
            zCoordinate = new double[uSteps][vSteps];
            rValue = new double[uSteps][vSteps];
            gValue = new double[uSteps][vSteps];
            bValue = new double[uSteps][vSteps];
            normals = new Vector[uSteps][vSteps];
            for (int u = 0; u < uSteps; u++) {
                for (int v = 0; v < vSteps; v++) {
                    double x = 40 * u / (uSteps - 1) - 20;
                    double y = 40 * v / (vSteps - 1) - 20;
                    double z = (double)heightAt((float)x, (float)y);
                    Vector Vx = new Vector(1, 0, dX(x, y));
                    Vector Vy = new Vector(0, 1, dY(x, y));
                    Vector normal = Vy.cross(Vx);
                    xCoordinate[u][v] = x;
                    yCoordinate[u][v] = y;
                    zCoordinate[u][v] = z;
                    normals[u][v] = normal;
                    if (z < 5) {
                        // Greyish color for the mountains
                        rValue[u][v] = 0.3;
                        gValue[u][v] = 0.3;
                        bValue[u][v] = 0.3;
                    } else {
                        // Of course it snows on tops :)!
                        rValue[u][v] = 1;
                        gValue[u][v] = 1;
                        bValue[u][v] = 1;
                    }
                }
            }
        }
        
        /**
         * Draws the landscape.
         */
        public void draw() {
            // Draw all (u, v) pairs
            for (int u = 0; u < uSteps - 1; u++) {
                for (int v = 0; v < vSteps - 1; v++) {
                    gl.glBegin(GL_QUADS);
                    initVertex(u, v);
                    initVertex(u + 1, v);
                    initVertex(u + 1, v + 1);
                    initVertex(u, v + 1);
                    gl.glEnd();
                }
            }

            gl.glColor4d(0, 0, 0, 1);
        }

        /**
         * Initialize a vertex.
         * 
         * @param u
         * @param v
         */
        private void initVertex(int u, int v) {
            gl.glColor3d(rValue[u][v], gValue[u][v], bValue[u][v]);
            gl.glNormal3d(normals[u][v].x(), normals[u][v].y(), normals[u][v].z());
            gl.glVertex3d(xCoordinate[u][v], yCoordinate[u][v], zCoordinate[u][v]);
        }

        /**
         * Get the derivative.
         * 
         * @param  x
         * @param  y
         * @return df(x, y) / dx
         */
        private double dX(double x, double y) {
            if ((x >= -19 && x <= 19) && (y >= -19 && y <= 19)) {
                return 0;
            } else {
                return 20 * (0.2 * (float)Math.cos(x - 0.5f * y) - 0.12f * (float)Math.cos(0.3f * x + 0.2f * y));
            }
        }

        /**
         * Get the derivative.
         * 
         * @param  x
         * @param  y
         * @return df(x, y) / dy
         */
        private double dY(double x, double y) {
            if ((x >= -19 && x <= 19) && (y >= -19 && y <= 19)) {
                return 0;
            } else {
                return 20 * (-0.1f * (float)Math.cos(x - 0.5f * y) - 0.08f * (float)Math.cos(0.3 * x + 0.2f * y));
            }
        }
        
        /**
         * Computes the elevation of the terrain at ({@code x}, {@code y}).
         */
        public float heightAt(float x, float y) {
            if ((x >= -19 && x <= 19) && (y >= -19 && y <= 19)) {
                // Do not draw mountains in the terrain
                return 0;
            } else {
                // Mountain simulation (after the terrain)
                return 20 * ((float)Math.cos(0.3f * x + 0.2f * y) + 0.4f * (float)Math.cos(x - 0.5f * y));
            }
        }
    }

    /**
     * Tree object.
     */
    class Tree {

        // Maximal number of recursion
        // Runs in O(branchesPerLevel^maxDepth)
        private int maxDepth = 2;
        // Number of branches per level
        private int branchesPerLevel = 5;
        // Number of leafs per branch
        private int leafsPerBranch = 10;
        // At which z position a branch is attached to its previous branch
        private double[][] zAttachnmentBranch;
        // The angle at with the branch is
        private double[][] angleAttachmentBranch;
        // Same for leafs
        private double[][][] zAttachnmentLeaf;
        private double[][][] angleAttachmentLeaf;
        // Scale of leafs
        private double[][][] scaleLeaf;
        // Scale per level (for branches)
        private double[] levelScale;
        // Height of the tree
        private double height;

        /**
         * Initialize the tree.
         * 
         * @param  height Height of the tree.
         */
        public Tree(double height) {
            this.height = height;
            // Initialize the variables
            zAttachnmentBranch = new double[maxDepth][branchesPerLevel];
            angleAttachmentBranch = new double[maxDepth][branchesPerLevel];
            zAttachnmentLeaf = new double[maxDepth][branchesPerLevel][leafsPerBranch];
            angleAttachmentLeaf = new double[maxDepth][branchesPerLevel][leafsPerBranch];
            scaleLeaf = new double[maxDepth][branchesPerLevel][leafsPerBranch];
            levelScale = new double[maxDepth];

            // And now randomize the values of the variables
            // such that the trees all have different shapes.
            // Loop through all levels
            for (int level = 0; level < maxDepth; level++) {
                if (level == 0) {
                    levelScale[level] = 1;
                } else if (level == 1) {
                    levelScale[level] = 0.3;
                } else {
                    levelScale[level] = 0.8 * levelScale[level - 1];
                }
                // Loop through all branches
                for (int branch = 0; branch < branchesPerLevel; branch++) {
                    zAttachnmentBranch[level][branch] = 0.5 * Math.random() + 0.3;
                    angleAttachmentBranch[level][branch] = Math.random();
                    // Loop through all leafs
                    for (int leaf = 0; leaf < leafsPerBranch; leaf++) {
                        zAttachnmentLeaf[level][branch][leaf] = 2.0 * Math.random();
                        angleAttachmentLeaf[level][branch][leaf] = Math.random();
                        scaleLeaf[level][branch][leaf] = 0.7 + (Math.random() - 0.5) / 10.0;
                    }
                }
            }
        }

        // Draw everything!
        public void draw() {
            gl.glPushMatrix();
            gl.glScaled(height, height, height);
            // Draw level 0 and draw the other levels by recursion!
            drawLevel(0);
            gl.glPopMatrix();
        }

        /**
         * Draw level >= {@code n}.
         * 
         * @param n Begin level to draw.
         */
        public void drawLevel(int n) {
            gl.glPushMatrix();
            if (n == 0) {
                // Base case
                drawBranch();
                // Draw the next level
                if (n + 1 < maxDepth) drawLevel(n + 1);
            } else {
                gl.glRotated(-90, 0, 1, 0);
                for (int branchNr = 0; branchNr < branchesPerLevel; branchNr++) {
                    // Get the values
                    double z = zAttachnmentBranch[n][branchNr];
                    double angle = angleAttachmentBranch[n][branchNr];
                    double scale = levelScale[n];
                    // Translate, rotate, scale
                    gl.glPushMatrix();
                    gl.glTranslated(z, 0, 0);
                    gl.glRotated(angle * 360, 1, 0, 0);
                    gl.glScaled(scale, scale, scale);
                    // Draw all leafs
                    for (int leafNr = 0; leafNr < leafsPerBranch; leafNr++) {
                        // Get the properties of the leaf
                        double leafAngle = angleAttachmentLeaf[n][branchNr][leafNr];
                        double leafZ = zAttachnmentLeaf[n][branchNr][leafNr];
                        double leafScale = scaleLeaf[n][branchNr][leafNr];
                        // Translate, scale, rotate
                        gl.glPushMatrix();
                        gl.glTranslated(leafZ, 0, 0);
                        gl.glRotated(leafAngle * 360, 1, 0, 0);
                        gl.glScaled(leafScale, leafScale, leafScale);
                        drawLeaf();
                        gl.glPopMatrix();
                    }
                    // Draw the branch
                    drawBranch();
                    gl.glPushMatrix();
                    gl.glTranslated(1, 0, 0);
                    gl.glPopMatrix();
                    // Draw the next level
                    if (n + 1 < maxDepth) drawLevel(n + 1);
                    gl.glPopMatrix();
                }
            }
            gl.glPopMatrix();
        }

        /**
         * Draw a single branch.
         */
        public void drawBranch() {
            // Wood color ofcourse
            applyMaterial(Material.WOOD);
            glut.glutSolidCylinder(0.1, 0.7, 30, 30);
            glut.glutSolidCone(0.2, 0.4, 30, 30);
            gl.glPushMatrix();
            gl.glTranslated(0, 0, 0.7);
            glut.glutSolidCone(0.1, 0.3, 30, 30);
            gl.glPopMatrix();
        }

        /**
         * Draw a single leaf.
         */
        public void drawLeaf() {
            // Leaf color
            applyMaterial(Material.LEAF);

            gl.glPushMatrix();
            double translation = 0.8;
            double scale = 0.8;
            for (int n = 0; n < 4; n++) {
                drawLeafLevel(n);
                gl.glTranslated(0, 0, translation);
                gl.glScaled(scale, scale, scale);
                translation = translation * scale;
            }
            gl.glPopMatrix();
        }

        /**
         * Draw a leaf level.
         * 
         * @param n Level for the leaf.
         */
        public void drawLeafLevel(int n) {
            gl.glPushMatrix();
            gl.glRotated(45, 0, 1, 0);
            glut.glutSolidCube(1f);
            gl.glPopMatrix();
        }

    }
    
    /**
     * Main program execution body, delegates to an instance of
     * the RobotRace implementation.
     */
    public static void main(String args[]) {
        RobotRace robotRace = new RobotRace();
    }
    
}