namespace JenkinsJIRA_API.Entities.TestExcecution
{
    #region using
    using System.Collections.Generic;
    using Newtonsoft.Json;
    #endregion
    public class TestExcecutionAdd
    {
        [JsonProperty("add")]
        public List<string> TestToAddList { get; set; }

        [JsonProperty("remove")]
        public List<string> TestToRemoveList { get; set; }
    }
}
