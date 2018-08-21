namespace JenkinsJIRA_API.SpecFlowResultsParser
{
    #region using
    using System;
    using System.Collections.Generic;
    using HtmlAgilityPack;
    using System.Net;
    using System.Text.RegularExpressions;
    #endregion
    public class HTMLParser
    {
        //Work from a stream to Jenkins HTML specflow results if possible otherwise download
        #region Constructor
        /// <summary>
        /// Create HTML manager to work with a stream
        /// </summary>
        /// <param name="url"></param>
        public HTMLParser(string url)
        {
            this.Docu = getHTMLDOC(url);
        }
        #endregion

        #region Properties
        public HtmlDocument Docu { get; }
        #endregion

        #region Public Methods
        /// <summary>
        /// Match issue keys to Test results in HTML
        /// </summary>
        /// <param name="nodeCollection"></param>
        /// <param name="testCaseIssueList"></param>
        /// <returns></returns>
        public Dictionary<string, bool?> getTestResults(HtmlNodeCollection nodeCollection, List<String> testCaseIssueList)
        {
            var results = new Dictionary<string, bool?>();
            //initilize dictionary with defaul null values
            foreach (var issueKey in testCaseIssueList)
            {
                results.Add(issueKey,null);
            }


            foreach (var node in nodeCollection)
            {
                //get title
                var title = node.SelectSingleNode("td/span[@title]").Attributes[0].Value;
                var isSuccess = (node.SelectSingleNode("td[@class='success']") != null);
                //regex for issues in title
                var matches = getIssuesInTitle(title);
                //See if any issues match testCaseIssueList
                foreach (Match foundIssue in matches)
                {
                    var issue = foundIssue.Value;
                    issue = issue.Replace("_", "-"); //replace underscore with dash
                    if (testCaseIssueList.Contains(issue)){ results[issue] = isSuccess;}
                }
                //If there are matches update dictionary with <issueKey, bool success>
            }
            return results;
        }
        #endregion

        #region Methods
        protected HtmlDocument getHTMLDOC(string url)
        {
            var html = new HtmlDocument();
            HttpWebRequest request = WebRequest.Create(url) as HttpWebRequest;
            using (HttpWebResponse response = request.GetResponse() as HttpWebResponse)
            {
                   html.Load(response.GetResponseStream());
            }                 
            return html;
        }
        protected MatchCollection getIssuesInTitle(string testTitleStr)
        {
            string issueMatch = @"CDS2MSDA_\d+";
            MatchCollection matches = Regex.Matches(testTitleStr, issueMatch, RegexOptions.IgnoreCase);
            return matches;
        }
        #endregion

    }
}
