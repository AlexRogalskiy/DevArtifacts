using Prism.Interactivity.InteractionRequest;
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
    /// Interaction logic for ProjectsConfiguration.xaml
    /// </summary>
    public partial class ProjectsConfiguration : UserControl
    {
        //public ProjectConfigurationModel(MainWindowModel model)
        //{

        //}

        public ProjectsConfiguration()
        {
            InitializeComponent();

        }

        private void btnAdd_Click(object sender, RoutedEventArgs e)
        {

        }


        ////internal Model.ProjectConfigurationModel projectConfig;

        //public ProjectsConfiguration()
        //{
        //    InitializeComponent();

        //    //projectConfig = new Model.ProjectConfigurationModel();
        //    //this.listView.DataContext = projectConfig.Servers;
        //}

        //internal ProjectsConfiguration(Model.ProjectConfigurationModel projectModel )
        //    :this()
        //{
        //    projectConfig = projectModel;
        //    //this.listView.DataContext = projectConfig.Servers;

        //    listView.SelectedIndex = 0;
        //}

        //private void windowProjectConfiguration_Loaded(object sender, RoutedEventArgs e)
        //{

        //}

        //private void btnAdd_Click(object sender, RoutedEventArgs e)
        //{
        //    ServerConfiguration serverConfig = new ServerConfiguration();
        //    var result = serverConfig.ShowDialog();

        //    if ( result.HasValue && result.Value)
        //    {
        //        //projectConfig.Servers.Add(serverConfig._serverConfigModel);
        //    }
        //}

        //private void listView_SelectionChanged(object sender, SelectionChangedEventArgs e)
        //{
        //    //var currentConfig = listView.SelectedItem as Model.MainWindowViewModel;
        //    //LoadJobs(currentConfig);
        //}

        //private async void LoadJobs(ViewModel.MainWindowViewModel config)
        //{
        //    //JenkinsClient.JenkinsDataLoader jcDL = new JenkinsClient.JenkinsDataLoader(config.ServerInfo);
        //    //var BuildData = await jcDL.GetProjects();
        //    //listViewJobs.DataContext = BuildData.jobs;
        //}

        //private void btnSave_Click(object sender, RoutedEventArgs e)
        //{
        //    //projectConfig.BuildJobs.Clear();
        //    //foreach (var item  in listViewJobs.SelectedItems)
        //    //{
        //    //    projectConfig.BuildJobs.Add(item as JenkinsClient.BuildJob);
        //    //}

        //    this.DialogResult = true;
        //}
    }
}
