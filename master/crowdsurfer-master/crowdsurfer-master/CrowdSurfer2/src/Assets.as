package
{
	import starling.display.Image;
	import starling.extensions.textureAtlas.DynamicAtlas;
	import starling.textures.TextureAtlas;

	public class Assets
	{
		
		private static var _atlas:TextureAtlas;
		
		
		public static function get atlas():TextureAtlas{
			
			if(_atlas == null){
				
				_atlas = DynamicAtlas.fromMovieClipContainer(new swcTextureAtlas());
			}
			
			
			return _atlas;
		}
		
		public static function getImage(param0:String, pivotx:Number = 0.5, pivoty:Number = 0.5):Image
		{
			var img:Image = new Image(atlas.getTexture(param0));
			img.pivotX = img.width * (pivotx - 0.5);
			img.pivotY = img.height * (pivoty - 0.5);
			return img;
		}
	}
}