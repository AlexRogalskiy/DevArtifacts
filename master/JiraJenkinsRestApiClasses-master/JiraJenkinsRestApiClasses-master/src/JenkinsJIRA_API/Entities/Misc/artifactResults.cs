namespace JenkinsJIRA_API.Entities.Misc
{
    #region using
    using Newtonsoft.Json;
    #endregion
    public class artifactResults
    {
        [JsonProperty("displayPath")]
        public string DispPath { get; set; }

        [JsonProperty("fileName")]
        public string FileName { get; set; }

        [JsonProperty("relativePath")]
        public string RelativePath { get; set; }

    }
}
