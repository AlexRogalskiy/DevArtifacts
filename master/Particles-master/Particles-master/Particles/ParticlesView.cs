using System;
using CocosSharp;
using Xamarin.Forms;
using System.Linq;

namespace Particles
{
	public class ParticlesView : ContentView
    {
		ParticlesScene _scene;

        public ParticlesView()
        {
			var sharpView = new CocosSharpView
            {
                HorizontalOptions = LayoutOptions.FillAndExpand,
                VerticalOptions = LayoutOptions.FillAndExpand,
				ViewCreated = HandleViewCreated
            };

			Content = sharpView;
        }

		void HandleViewCreated(object sender, EventArgs e)
		{
			var ccGView = sender as CCGameView;
            if (ccGView != null)
            {
                ccGView.DesignResolution = new CCSizeI(App.Width, App.Height);

                _scene = new ParticlesScene(ccGView);
				var touchEvent = new CCEventListenerTouchOneByOne();
                touchEvent.OnTouchBegan = (touch, _event) =>
                {
					_scene.DrawParticle(touch.LocationOnScreen);
					return true;
                };
				touchEvent.OnTouchMoved = (touch, _event) =>
                {
					_scene.DrawParticle(touch.LocationOnScreen);
                };

				_scene.AddEventListener(touchEvent);
                ccGView.RunWithScene(_scene);
            }
		}
    }
}
