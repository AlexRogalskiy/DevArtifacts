package gameobjects
{
	import flash.geom.Point;
	
	import citrus.core.CitrusEngine;
	import citrus.objects.NapePhysicsObject;
	import citrus.physics.PhysicsCollisionCategories;
	import citrus.physics.nape.Nape;
	
	import nape.constraint.PivotJoint;
	import nape.dynamics.InteractionFilter;
	import nape.geom.Vec2;
	import nape.phys.Body;
	import nape.phys.Material;
	
	public class Arm extends NapePhysicsObject
	{
		private var _baseY:int;
		
		public var life:int;
		public var frequency:Number = 0.1;
		public var amplitude:Number = 20;
		public var offset:Point = new Point();
		public var joint:PivotJoint;
		
		private var _nape:Nape;
		
		public function Arm(name:String, params:Object=null)
		{
			_nape = CitrusEngine.getInstance().state.getFirstObjectByType(Nape) as Nape;
			
			super(name, params);
			
		
			_baseY = _y;
			life = Math.random() * 10;
		}
		
		override public function set x(value:Number):void{
			super.x = value;
			
			joint.anchor2.x = x;
			_body.position.x = x;
		}
		
		override protected function createBody():void {
			
			_body = new Body(_bodyType, new Vec2(_x, _y));
			_body.userData.myData = this;
			_body.allowMovement = true;
			_body.allowRotation = false;
			_body.rotate(new Vec2(_x, _y), _rotation);
			
			
		}
		
		
		override protected function createMaterial():void {
			
			_material = new Material(0, 0, 0, 10, 0);
		}
		
		
		override protected function createFilter():void {
			
			_body.setShapeFilters(new InteractionFilter(PhysicsCollisionCategories.Get("Crowd"), PhysicsCollisionCategories.Get("Surfer")));
		}
		
		
		override protected function createConstraint():void{
			super.createConstraint();
			//create joint
			joint = new PivotJoint(_body, _nape.space.world, new Vec2(), new Vec2(_x, _y));
			joint.active = true;
			joint.stiff = false;
			joint.space = _nape.space;
		}

		private var targetY:Number;
		private var delta:Number;
		override public function update(timeDelta:Number):void{
			
			super.update(timeDelta);
			
			if(offset.y == 0)
				targetY = int(Math.sin(life++ * frequency) * amplitude - offset.y);	
			else
				targetY = -offset.y;
			
			offset.y = int(offset.y * 90)/100;	
			joint.anchor2.y += int(((_baseY + targetY) - joint.anchor2.y)*50)/100;

		
		}
		
	}
}