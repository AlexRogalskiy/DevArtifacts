using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace Dashboard.Desktop.Model
{
    [Serializable]
    public class MainWindowModel : Prism.Mvvm.BindableBase
    {
        private List<ServerModel> _servers;
        public List<ServerModel> Servers { get { return _servers; } set { SetProperty(ref _servers, value); } }

      

        internal void Save(string fileName)
        {
            XmlSerializer serial = new XmlSerializer(typeof(MainWindowModel));
            try
            {

                if (!System.IO.Directory.Exists(Path.GetDirectoryName(fileName)))
                    Directory.CreateDirectory(Path.GetDirectoryName(fileName));

                using (StreamWriter sw = new StreamWriter(fileName))
                {
                    serial.Serialize(sw, this);
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine("Error saving File", ex.ToString());
            }
        }

        internal void Load(string FileName)
        {
            XmlSerializer xmlSerial = new XmlSerializer(typeof(MainWindowModel));

            try
            {
                var model = xmlSerial.Deserialize(File.OpenRead(FileName)) as MainWindowModel;

                this.Servers = model.Servers;
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine("Error loading File", ex.ToString());

            }
            
        }
    }
}
