package gameobjects.surfer
{
	import citrus.objects.NapePhysicsObject;
	import citrus.physics.PhysicsCollisionCategories;
	
	import nape.dynamics.InteractionFilter;
	import nape.phys.Material;
	
	public class SurferBodyPart extends NapePhysicsObject
	{
		public function SurferBodyPart(name:String, params:Object=null)
		{
			super(name, params);
		}
		
		override protected function createFilter():void {
			
			_body.setShapeFilters(new InteractionFilter(PhysicsCollisionCategories.Get("Surfer"), PhysicsCollisionCategories.GetNone()));//("Crowd", "Level")));
		}
		
		override protected function createMaterial():void {
			
			_material = new Material(0, 0, 0, 10, 0);
		}
	}
}