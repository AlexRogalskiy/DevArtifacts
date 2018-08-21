namespace JenkinsJIRA_API.Entities.TestExcecution
{
    #region using
    using Newtonsoft.Json;
    using System.Collections.Generic;
    #endregion
    public class TestExecutionGetRsp
    {
        public List<TestRun> TestRuns { get; set; }
    }
}
