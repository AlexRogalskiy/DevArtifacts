namespace JenkinsJIRA_API.Entities.TestExcecution
{
    #region using
    using Newtonsoft.Json;
    #endregion
    public class TestRun
    {
        [JsonProperty("id")]
        public int ID { get; set; }

        [JsonProperty("key")]
        public string Key { get; set; }

        [JsonProperty("rank")]
        public int Rank { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }
    }
}
