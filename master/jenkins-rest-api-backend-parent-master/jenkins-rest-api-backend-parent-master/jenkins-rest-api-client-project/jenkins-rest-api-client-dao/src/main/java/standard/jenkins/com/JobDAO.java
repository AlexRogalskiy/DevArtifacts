package standard.jenkins.com;

import es.standard.http.client.common.HttpConstants;
import es.standard.http.client.domain.HttpRequestDTO;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import standard.jenkins.com.interfaces.IJobDAO;

import javax.enterprise.inject.Default;
import javax.inject.Singleton;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;

@Singleton
@Default
public class JobDAO implements IJobDAO {

    public JobDTO updateConfigXML (JobDTO jobDTO) throws Exception {
        Document document = null;
        StringWriter writer = null;

        try {
            document = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(Constants.CONFIG_XML_TEMPLATE);
            this.updateDataNodeXML(document, Constants.REMOTE_NODE, jobDTO.getUrl());
            writer = new StringWriter();
            TransformerFactory.newInstance().newTransformer().transform(new DOMSource(document), new StreamResult(writer));
            jobDTO.setConfigXML(writer.toString());
            return jobDTO;

        } catch (Exception ex) {
            throw ex;
        }
    }

    public HttpRequestDTO sendRequestToJenkinsRestApi(JobDTO jobDTO, String jenkinsIP) throws Exception {
        HttpRequestDTO httpRequestDTO = null;
        Map<String, String> header = null;

        try {
            httpRequestDTO = new HttpRequestDTO();
            httpRequestDTO.setRequestMethod(HttpConstants.POST_HTTP_METHOD);
            httpRequestDTO.setProtocol(HttpConstants.UNSECURE_PROTOCOL);
            httpRequestDTO.setUrlEndpoint("http://" + jenkinsIP + "/createItem?name=" + jobDTO.getJobName());

            header = new HashMap<String, String>();
            header.put(Constants.HEADER_CONTENT_TYPE_KEY, Constants.HEADER_CONTENT_TYPE_VALUE);
            httpRequestDTO.setHeader(header);
            httpRequestDTO.setRequestBody(jobDTO.getConfigXML());
            return httpRequestDTO;

        } catch (Exception ex) {
            throw ex;
        }
    }

    private Node getNodeFromConfigXML(String nodeName, Document document) throws Exception {
        Node node = null;

        try {
            node = (Element) document.getElementsByTagName(nodeName).item(0);
            return node;

        } catch (Exception ex) {
            throw ex;
        }
    }

    private void updateDataNodeXML(Document document, String nodeName, String nodeValue) throws Exception {
        try {
            this.getNodeFromConfigXML(nodeName, document).setTextContent(nodeValue);

        } catch (Exception ex) {
            throw ex;
        }
    }
}
