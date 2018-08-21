using System.Net;
//call with:
// https://cookiebinge.azurewebsites.net/api/GetAccountId/{name}/{shortId}
//example: https://cookiebinge.azurewebsites.net/api/GetAccountId/54321/abcde
// SELECT c.id FROM c where (c.name="julie" and StartsWith(c.id,"99d2383d"))
//SELECT c.id FROM c where (c.name= {name} and StartsWith(c.id,{shortid}))
public static HttpResponseMessage Run(string name,string shortid,
               HttpRequestMessage req, IEnumerable<dynamic> documents, TraceWriter log)
{
    if (documents.Count() ==1)
    {
        log.Info($"Document Count: {documents.Count()}");
        var doc=documents.First();
        log.Info($"Id: {doc.id}");
        return req.CreateResponse(HttpStatusCode.OK,$"{doc.id}");
    }
    else
    {
        return req.CreateResponse(HttpStatusCode.NotFound);
    }
}
