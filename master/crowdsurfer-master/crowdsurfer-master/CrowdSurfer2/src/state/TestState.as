package state
{
	import flash.geom.Point;
	
	import citrus.core.starling.StarlingState;
	import citrus.math.MathVector;
	import citrus.objects.CitrusSprite;
	import citrus.objects.NapePhysicsObject;
	import citrus.physics.PhysicsCollisionCategories;
	import citrus.physics.nape.Nape;
	
	import gameobjects.Arm;
	import gameobjects.surfer.Surfer;
	
	import nape.constraint.PivotJoint;
	import nape.geom.Vec2;
	
	import starling.display.Image;
	import starling.display.Quad;
	import starling.display.Shape;
	import starling.events.Touch;
	import starling.events.TouchEvent;
	import starling.events.TouchPhase;

	
	public class TestState extends StarlingState
	{
		
		
		private var _nape : Nape;
		
		//game objects
		private var _surfer : Surfer;
		private var _arms:Vector.<Arm>;
		private var _touchPad:NapePhysicsObject;
		
		//settings
		private var _cam_easing : MathVector 	= new MathVector(0.1, 0.1);
		private var _gravity 	: Vec2 			= new Vec2(0,400);
		private var currentzoom:Number;
		private var targetzoom:Number;
		private var surferspeed:Number;
		private var CAM_ZOOM_FACTOR:Number = 0.002;
		private var CAM_ZOOM_SMOOTH:Number = 0.04;
		private var touchLocation:Point = new Point();
		private var _hand:PivotJoint;

		private var CROWD_BUMP_RADIUS:Number = 100;
		private var CROWD_GAP:Number = 40;
		private var _camdummy:Object;
		
		
		public function TestState()
		{
			super();
		}
		
		
		override public function initialize():void{
			
			super.initialize();
			
			PhysicsCollisionCategories.Add("Crowd");
			PhysicsCollisionCategories.Add("Surfer");
			
			
			//bg
			var _bgSpt:CitrusSprite = new CitrusSprite("bg", {x:-stage.stageWidth, y:-stage.stageHeight, view:new Quad(stage.stageWidth*3, stage.stageHeight*3, 0x000000)});
			this.addChildAt(new Quad(stage.stageWidth, stage.stageHeight, 0), 0);
		
			
			/** NAPE */
			_nape = new Nape("nape");
			_nape.gravity = _gravity;
			_nape.visible = false;
			
			this.add(_nape);
			
			
			/** CROWD */

			
			var _armHeight:int = 300;
			var num_arms:int = (stage.stageWidth+100)/CROWD_GAP;
			var _arm:NapePhysicsObject;
			_arms = new Vector.<Arm>();
			var _shape:Shape;
			var _size:Number = (CROWD_GAP/3) * 2;
			var _img:Image;
			
			for(var i:uint = 0; i < num_arms; i++){
				
				_shape = new Shape();
				_shape.graphics.beginFill(0x0000FF);
				_shape.graphics.drawCircle(_size,_size/2,_size);
				_shape.graphics.endFill();
				_img = Assets.getImage("crowd_arm_00000", 0.5, 0.1);
				_arm = new Arm("arm"+i, {x: (CROWD_GAP*i) - 50, y:stage.stageHeight-_armHeight/2, radius:(CROWD_GAP/3)*2, view:_img});
				_arms.push(_arm);
				this.add(_arm);
			}
			
			
			/** SURFER */
			_surfer = new Surfer("surfer", {x:stage.stageWidth/2+10, y:0, width:50, height:50, view:Assets.getImage("body_00000")});
			_surfer.posLeftShoulder.x = -20;
			_surfer.posLeftShoulder.y = -5;
			_surfer.upperLeftArmWidth = 30;
			_surfer.upperLeftArmHeight = 10;
			_surfer.upperLeftArmArt = Assets.getImage("arm_00000");
			
			_surfer.posRightShoulder.x = 20;
			_surfer.posRightShoulder.y = -5;
			_surfer.upperRightArmWidth = 30;
			_surfer.upperRightArmHeight = 10;
			_surfer.upperRightArmArt = Assets.getImage("arm_00000")
			
			_surfer.createBodyParts();
			this.add(_surfer);
			
			
			/** WALLS */
			//var _wall:Platform = new Platform("wall", {x:0, y:-stage.stageHeight*2, width:50, height:stage.stageHeight*6, view:new Quad(50, stage.stageHeight*6, 0x7777777)});
			//this.add(_wall);
			//_wall = new Platform("wall", {x:stage.stageWidth, y:-stage.stageHeight*2, width:50, height:stage.stageHeight*6, view:new Quad(50, stage.stageHeight*6, 0x7777777)});
			//this.add(_wall);
			
			
			/** CROWD TOUCH CONTROL **/
			stage.addEventListener(TouchEvent.TOUCH, onStageTouch);
			
			
			/** CAMERA */
			_camdummy = new Object();
			_camdummy.x = _surfer.x;
			_camdummy.y = stage.stageHeight * 0.5;
			view.camera.allowZoom = true;
			view.camera.setUp(_camdummy, new MathVector(stage.stageWidth/2, stage.stageHeight/2), null, _cam_easing);
		}
		
		
		private function onStageTouch(e:TouchEvent):void{
			
			var touch:Touch = e.getTouch(this);
			if(!touch)return;
			touchLocation = touch.getLocation(this);
			
			if(touch.phase == TouchPhase.ENDED){
				touchLocation.x = -2000;
			}
		}
		
		private var _camvelocity:Number = 0;
		private var _lastcamposition:Number = 0;
		
		override public function update(timeDelta:Number):void{
			super.update(timeDelta);
			
			var offset:Number;
			var touchloc:Vec2 = new Vec2();
			touchloc.x = touchLocation.x;
			touchloc.y = touchLocation.y;
			touchloc = _nape.space.world.localPointToWorld(touchloc);
			
			_camvelocity = view.camera.camPos.x - _lastcamposition;
			_lastcamposition = view.camera.camPos.x;
						
			
			// loop through arms
			for(var i:uint = 0; i < _arms.length; i++){
				
				if(_camvelocity > 0){
					//moving right
					//move crowd hands leaving view to the right side of the crowd
					if(_arms[i].x - (view.camera.camPos.x * view.camera.camProxy.scale) < 0){
						_arms[i].x += (_arms.length * 40);
						_arms[i].offset.y = 0;
					}
					
				}else{
					if(_arms[i].x - (view.camera.camPos.x * view.camera.camProxy.scale) > stage.stageWidth){
						_arms[i].x -= (_arms.length * 40);
						_arms[i].offset.y = 0; 
					}
				}
			
				
				offset = int(touchloc.x + view.camera.camPos.x - _arms[i].x) * 0.5;
				if(offset < 0)offset = -offset;
				offset *= offset * 0.004;
				offset = CROWD_BUMP_RADIUS - offset;
				if(offset < 0)offset = 0;
				if(offset > _arms[i].offset.y)
					_arms[i].offset.y = offset;
				
			}
			
			
			
			//mannually place camera to follow surfer, but never loose the crowd, so zoom out when moving too far up
			currentzoom = view.camera.getZoom();
			targetzoom  = 1.3 - (int(_surfer.body.velocity.length * CAM_ZOOM_FACTOR * 100)/100);
			currentzoom += int((targetzoom - currentzoom) * CAM_ZOOM_SMOOTH * 100)/100;
			//view.camera.setZoom(currentzoom);
			
			//camdummy follow surfer
			_camdummy.x = _surfer.x;
			
		}
	}
}