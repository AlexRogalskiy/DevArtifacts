namespace JenkinsRestClient.Data
{
    public class Job
    {
        public string Name { get; set; }
        public string Url { get; set; }
        public string Color { get; set; }
        public const string Success = "blue";
        public const string Failed = "red";
        public bool IsSuccess()
        {
            return Color == Success;
        }
        public bool IsFailed()
        {
            return Color == Failed;
        }
    }
}