using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace Dashboard.Desktop.Views
{
    /// <summary>
    /// Interaction logic for Configuration.xaml
    /// </summary>
    public partial class ServerConfiguration : Window
    {
        internal ViewModels.MainWindowViewModel _serverConfigModel;
        internal ServerConfiguration()
        {
            _serverConfigModel = new ViewModels.MainWindowViewModel();
            InitializeComponent();

            DataContext = _serverConfigModel;
        }
        internal ServerConfiguration(ViewModels.MainWindowViewModel model) :
            this()
        {
            if (model == null)
                _serverConfigModel = new ViewModels.MainWindowViewModel();
            else
                _serverConfigModel = model;

            DataContext = _serverConfigModel;
        }

        private void windowServerConfig_Loaded(object sender, RoutedEventArgs e)
        {
            groupBox.GetBindingExpression(GroupBox.IsEnabledProperty).UpdateSource();
        }

        private void btnSave_Click(object sender, RoutedEventArgs e)
        {
            this.DialogResult = true;
        }
    }
}
