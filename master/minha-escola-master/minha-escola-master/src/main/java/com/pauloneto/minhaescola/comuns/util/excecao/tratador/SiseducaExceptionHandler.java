package com.pauloneto.minhaescola.comuns.util.excecao.tratador;

import java.util.Iterator;

import javax.faces.FacesException;
import javax.faces.application.FacesMessage;
import javax.faces.application.FacesMessage.Severity;
import javax.faces.application.ViewExpiredException;
import javax.faces.context.ExceptionHandler;
import javax.faces.context.ExceptionHandlerWrapper;
import javax.faces.context.FacesContext;
import javax.faces.event.ExceptionQueuedEvent;
import javax.faces.event.ExceptionQueuedEventContext;

import org.jboss.logging.Logger;

import com.pauloneto.minhaescola.comuns.util.excecao.CoreValidacoes;
import com.pauloneto.minhaescola.comuns.util.excecao.SiseducaException;
import com.pauloneto.minhaescola.comuns.util.log.LogFactory;

public class SiseducaExceptionHandler extends ExceptionHandlerWrapper{

	private static Logger log = LogFactory.getLog(SiseducaExceptionHandler.class);
	private ExceptionHandler wrapped;
	public SiseducaExceptionHandler(){}
	
	@Override
	public ExceptionHandler getWrapped() {
		return wrapped;
	}
	
	@Override
	public void handle() throws FacesException {
		// Itera na fila de Exception's
		for (Iterator<ExceptionQueuedEvent> i = getUnhandledExceptionQueuedEvents()
				.iterator(); i.hasNext();) {

			ExceptionQueuedEvent event = i.next();
			ExceptionQueuedEventContext context = (ExceptionQueuedEventContext) event
					.getSource();
			Throwable t = context.getException();

			FacesContext.getCurrentInstance().validationFailed();
			SiseducaException sisException = SiseducaException.getPrimeiroSiseducaException(t);
			if(sisException != null){
				
				try {
				    // exibe uma mensagem de erro na propria página onde o
				    // erro ocorreu
				    if (sisException.getValidacao() != null
					    && !sisException.getValidacao().getCodigoMsg()
						    .isEmpty()) {
					Severity severity = (sisException.getValidacao()
						.getSeveridade() == CoreValidacoes.SEVERIDADE_ERRO ? FacesMessage.SEVERITY_ERROR
						: FacesMessage.SEVERITY_WARN);

//					MessagesProperty
//						.exibeMsg(severity,
//								sisException.getValidacao().getCodigoMsg(),
//								sisException.getValidacao().getCodigoMsgAuxiliar(),
//								sisException.getParametros() != null ? 
//										sisException.getParametros().toArray(
//							    new String[sisException.getParametros().size()])
//							    : null);

				    } else {
					log.error("Ausencia de parametros em "+SiseducaException.class.getSimpleName());
					 //MessagesProperty.errorMsg("MN0161");
				    }

				} finally {
				    i.remove();
				}
			}else if (t instanceof ViewExpiredException) {

				try {
				    //MessagesProperty.warningMsg("MS008");
				    //FacesUtil.redirecionar("/login.jsf");
				} finally {
				    i.remove();
				}
			}else {
				
				log.error("Ocorreu um Erro Inesperado: "+t.getMessage(), t);
				String viewId = FacesContext.getCurrentInstance().getViewRoot().getViewId();
				if (viewId!=null && !viewId.equals("/login.xhtml") && viewId.contains("paginas")){
				    //FacesUtil.redirecionar("/paginas/index.jsf?codMsgErro=MN0161");
				}else{
				    //MessagesProperty.errorMsg("MN0161");
				}
			}
		}
	}
}
