using System.Net;

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log, IAsyncCollector<object> outputDocument)
{
    log.Info("C# HTTP trigger function processed a request.");

    dynamic data = await req.Content.ReadAsAsync<object>();
    user doc=new user();
    if(data?.name!=null)
    {
        var id=Guid.NewGuid();
        doc=new user{name=data?.name,id=Guid.NewGuid(),created=DateTime.Now};
        log.Verbose("Outgoing userId:" + doc.id);
        await outputDocument.AddAsync(doc);
    }
 
    return doc.name == null
        ? req.CreateResponse(HttpStatusCode.BadRequest, "Please pass a name on the query string or in the request body")
        : req.CreateResponse(HttpStatusCode.OK, doc);
    }
public class user{
    public string name {get;set;}
    public Guid id {get;set;}
    public DateTime created{get;set;}
}
