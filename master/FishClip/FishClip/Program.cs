using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Forms;

namespace WindowsFormsApplication1
{
    static class Program
    {
        /// <summary>
        /// Der Haupteinstiegspunkt für die Anwendung.
        /// </summary>
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);


            Form f = new Form1();
            //f.FormBorderStyle = FormBorderStyle.FixedToolWindow;
            //f.ShowInTaskbar = false;
            //f.StartPosition = FormStartPosition.Manual;
            //f.Location = new System.Drawing.Point(-2000, -2000);
            //f.Size = new System.Drawing.Size(1, 1);
            Application.Run(f);
        }
    }
}
