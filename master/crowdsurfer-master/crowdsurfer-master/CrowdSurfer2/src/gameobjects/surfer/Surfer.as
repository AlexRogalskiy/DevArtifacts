package gameobjects.surfer
{
	import flash.geom.Point;
	
	import citrus.objects.NapePhysicsObject;
	import citrus.physics.PhysicsCollisionCategories;
	
	import nape.constraint.AngleJoint;
	import nape.constraint.PivotJoint;
	import nape.dynamics.InteractionFilter;
	import nape.geom.Vec2;
	import nape.phys.Material;

	public class Surfer extends NapePhysicsObject
	{
		
		
		//UPPER ARMS
		protected var _upperLeftArm:SurferBodyPart;
		protected var _upperRightArm:SurferBodyPart;
		protected var _lowerLeftArm:SurferBodyPart;
		protected var _lowerRightArm:SurferBodyPart;
		protected var _upperLeftLeg:SurferBodyPart;
		protected var _upperRightLeg:SurferBodyPart;
		protected var _lowerLeftLeg:SurferBodyPart;
		protected var _lowerRightLeg:SurferBodyPart;
		protected var _head:SurferBodyPart;
	
		protected var _leftShoulderPivotJoint:PivotJoint;
		protected var _leftShoulderAngleJoint:AngleJoint;		
		protected var _rightShoulderPivotJoint:PivotJoint;
		protected var _rightShoulderAngleJoint:AngleJoint;
		protected var _leftElbowPivotJoint:PivotJoint;
		protected var _leftElbowAngleJoint:AngleJoint;
		protected var _rightElbowPivotJoint:PivotJoint;
		protected var _rightElbowAngleJoint:AngleJoint;
		
		protected var _armUlength:Number = 40;
		protected var _armUwidth:Number = 13;
		protected var _armBlength:Number = 35;
		protected var _armBwidth:Number = 10;

	
		protected var _leftPelvicPivotJoint:PivotJoint;
		protected var _leftPelvicAngleJoint:AngleJoint;
		protected var _rightPelvicPivotJoint:PivotJoint;
		protected var _rightPelvicAngleJoint:AngleJoint;
		

		protected var _leftKneePivotJoint:PivotJoint;
		protected var _leftKneeAngleJoint:AngleJoint;
		protected var _rightKneePivotJoint:PivotJoint;
		protected var _rightKneeAngleJoint:AngleJoint;
		
		protected var _legUlength:Number = 40;
		protected var _legUwidth:Number = 13;
		protected var _legBlength:Number = 35;
		protected var _legBwidth:Number = 10;
		
	
		protected var _headPivotJoint:PivotJoint;
		protected var _headAngleJoint:AngleJoint;
		protected var _headMaterial:Material;
		
		protected var _headwidth:Number = 50;
		protected var _headlength:Number = 50;
		

		
		public var upperLeftArmArt:*;
		public var upperRightArmArt:*;
		public var lowerLeftArmArt:*;
		public var lowerRightArmArt:*;
		public var upperLeftLegArt:*;
		public var upperRightLegArt:*;
		public var lowerLeftLegArt:*;
		public var lowerRightLegArt:*;
		public var headArt:*;
		
		public var upperLeftArmWidth:Number;
		public var upperLeftArmHeight:Number;
		public var posLeftShoulder:Point = new Point();
		
		public var upperRightArmWidth:Number;
		public var upperRightArmHeight:Number;
		public var posRightShoulder:Point = new Point();
		
		
		public function Surfer(name:String, params:Object )
		{
		
			super(name, params);
		}
		
		
		override protected function createMaterial():void {
	
			_material = new Material(0, 0, 0, 10, 0);
		}
	
		
		override protected function createFilter():void {
			
			_body.setShapeFilters(new InteractionFilter(PhysicsCollisionCategories.Get("Surfer"), PhysicsCollisionCategories.Get("Crowd", "Level")));
		}
				
		
		public function createBodyParts():void
		{
			//UPPER LEFT ARM
			_upperLeftArm = new SurferBodyPart("upperLeftArm", {view:upperLeftArmArt, width:upperLeftArmWidth, height:upperLeftArmHeight, x:x + posLeftShoulder.x, y:y + posLeftShoulder.y});
			_ce.state.add(_upperLeftArm);
			_leftShoulderPivotJoint = new PivotJoint(_body, _upperLeftArm.body, new Vec2(posLeftShoulder.x, posLeftShoulder.y), new Vec2(upperLeftArmWidth*0.5, 0) );
			_leftShoulderPivotJoint.space = _nape.space;
			_leftShoulderAngleJoint = new AngleJoint(_body, _upperLeftArm.body, (Math.PI/180)*-70, (Math.PI/180)*70, 1);
			_leftShoulderAngleJoint.space = _nape.space;
			
			//UPPER RIGHT ARM
			_upperRightArm = new SurferBodyPart("upperRighttArm", {view:upperRightArmArt, width:upperRightArmWidth, height:upperRightArmHeight, x:x + posRightShoulder.x, y:y + posRightShoulder.y});
			_ce.state.add(_upperRightArm);
			_rightShoulderPivotJoint = new PivotJoint(_body, _upperRightArm.body, new Vec2(posRightShoulder.x, posRightShoulder.y), new Vec2(-upperRightArmWidth*0.5, 0) );
			_rightShoulderPivotJoint.space = _nape.space;
			_rightShoulderAngleJoint = new AngleJoint(_body, _upperRightArm.body, (Math.PI/180)*-70, (Math.PI/180)*70, 1);
			_rightShoulderAngleJoint.space = _nape.space;
			
		}
	}
}