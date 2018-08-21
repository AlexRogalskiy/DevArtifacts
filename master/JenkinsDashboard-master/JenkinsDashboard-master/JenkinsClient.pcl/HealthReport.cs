using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JenkinsClient
{
    public class HealthReport
    {
        public string description { get; set; }
        public string iconClassName { get; set; }
        public string iconUrl { get; set; }
        public int score { get; set; }
    }
}
