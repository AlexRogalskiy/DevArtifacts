using Hardcodet.Wpf.TaskbarNotification;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;

namespace Dashboard.Desktop
{
    internal class NotifyService : INotifyService
    {
        private TaskbarIcon icon = new TaskbarIcon
        {
            Name = "NotifyIcon",
            ToolTipText = "Jenkins Dashboard",
            Icon =
            new System.Drawing.Icon(
                Application.GetResourceStream(new Uri("/Assets/jenkinsheadshot.ico", UriKind.Relative)).Stream),
        };


        public void Notify(string message)
        {
            Notify(string.Empty, message);
        }

        public void ChangeIconSource(string path)
        {
            icon.Icon = new System.Drawing.Icon(
                        Application.GetResourceStream(new Uri(path)).Stream);
        }

        public void Notify(string title, string message)
        {
            icon.ShowBalloonTip(title, message, BalloonIcon.Info);
        }
    }
}
