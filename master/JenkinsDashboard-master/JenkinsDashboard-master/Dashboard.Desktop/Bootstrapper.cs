using Microsoft.Practices.ServiceLocation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;

namespace Dashboard.Desktop
{
    public class Bootstrapper : Prism.Bootstrapper
    {
        public override void Run(bool runWithDefaultConfiguration)
        {

        }

        protected override void ConfigureServiceLocator()
        {
        }

        protected override DependencyObject CreateShell()
        {
            return ServiceLocator.Current.GetInstance<Views.MainWindow>();
        }

        protected override void InitializeShell()
        {
            Application.Current.MainWindow.Show();
        }
    }
}
