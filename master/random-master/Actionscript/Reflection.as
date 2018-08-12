//  ********************************************************  \\
//  **********                USAGE               **********  \\
//                                                            \\
//  var ref:Reflection = new Reflection(MC_NAME,ALPHA,RAYS);  \\
//  ref.drawIt();                                             \\
//  ref.addBlur(2,2,3);                                       \\
//                                                            \\
//  ********************************************************  \\
//  ********************************************************  \\

import flash.display.BitmapData;
import flash.filters.BlurFilter;

class Reflection {

    private var bmdClip:BitmapData;
    private var bmdReflection:BitmapData;
    private var clip:MovieClip;
    private var alfa:Number;
    private var ray:Number;
    private var bf:BlurFilter;

    function Reflection(clip:MovieClip,alfa:Number,ray:Number) {
        this.clip = clip;
        this.alfa = alfa;
        this.ray = ray;
        init();
    }

    private function init():Void {
        bmdClip = new BitmapData(clip._width,clip._height,false,0x000000);
        clip.createEmptyMovieClip("reflection",clip.getNextHighestDepth());
        clip.reflection._visible = false;
        clip.reflection.attachBitmap(bmdClip,1);
        clip.reflection._yscale = -100;
        clip.reflection._y = clip._height + 2;
        clip.createEmptyMovieClip("masker",clip.getNextHighestDepth());
        var fillType:String = "linear";
        var grad:Array = [0xFFFFFF, 0xFFFFFF];
        var alfas:Array = [alfa,0];
        var rat:Array = [0,ray];
        var mat:Object = {matrixType:"box",x:0,y:0,w:clip._width,h:clip._height/4,r:(90/180)*Math.PI};
        var spread:String = "pad";
        clip.masker.beginGradientFill(fillType,grad,alfas,rat,mat,spread);
        clip.masker.moveTo(0,0);
        clip.masker.lineTo(0,clip._height/2);
        clip.masker.lineTo(clip._width,clip._height/2);
        clip.masker.lineTo(clip._width,0);
        clip.masker.lineTo(0,0);
        clip.masker.endFill();
        clip.masker._y = clip._height/2;
        clip.masker.cacheAsBitmap = true;
        clip.reflection.cacheAsBitmap = true;
        clip.reflection.setMask(clip.masker);
    }

    public function drawIt():Void {
        clip.reflection._visible = true;
        bmdClip.draw(clip);
    }

    public function addBlur(x:Number,y:Number,q:Number):Void {
        bf = new BlurFilter(x,y,q);
        clip.reflection.filters = [bf];
    }

}
