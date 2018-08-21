namespace JenkinsRestClient
{
    public interface IJenkinsServerApi 
    {
        T Get<T>(string url) where T : new();
        void Post(string url);
    }
}