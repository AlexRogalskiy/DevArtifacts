using Dashboard.Desktop.Model;
using Prism.Commands;
using Prism.Interactivity.InteractionRequest;
using Prism.Mvvm;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;
using System.Windows.Input;

namespace Dashboard.Desktop.ViewModels
{
    internal class ProjectsConfigurationViewModel : BindableBase, IInteractionRequestAware
    {
        public ICommand SelectItemCommand { get; private set; }

        private List<ServerModel> _servers;
        public List<ServerModel> Servers { get { return _servers; } set { SetProperty(ref _servers, value); } }


        public ProjectsConfigurationViewModel()
        {
            this.SelectItemCommand = new DelegateCommand(this.AcceptSelectedItem);
        }
         
        public void AcceptSelectedItem()
        {

        }
        public Action FinishInteraction
        {
             get; set; 

        }

        public INotification Notification
        {
            get;set;
        }
    }
}
