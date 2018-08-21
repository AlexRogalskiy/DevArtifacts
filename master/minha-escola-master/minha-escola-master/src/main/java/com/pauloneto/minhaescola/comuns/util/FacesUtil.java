package com.pauloneto.minhaescola.comuns.util;

import java.io.IOException;
import java.util.Collection;
import java.util.Collections;
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

import javax.faces.component.EditableValueHolder;
import javax.faces.component.UIComponent;
import javax.faces.component.visit.VisitCallback;
import javax.faces.component.visit.VisitContext;
import javax.faces.component.visit.VisitHint;
import javax.faces.component.visit.VisitResult;
import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;
import javax.faces.context.PartialViewContext;

import org.jboss.logging.Logger;

import com.pauloneto.minhaescola.comuns.util.log.LogFactory;

public class FacesUtil {

	private static Logger log = LogFactory.getLog(FacesUtil.class);

	private FacesUtil() {
		super();
	}

	public static String getRequestParameter(String name) {
		return (String) FacesContext.getCurrentInstance().getExternalContext()
				.getRequestParameterMap().get(name);
	}

	public static ExternalContext getExternalContext() {
		return FacesContext.getCurrentInstance().getExternalContext();
	}

	public static Map getSessionMap() {
		return FacesContext.getCurrentInstance().getExternalContext()
				.getSessionMap();
	}

//	public static ServletContext getServletContext() {
//		return (ServletContext) FacesContext.getCurrentInstance()
//				.getExternalContext().getContext();
//	}
//
//	public static HttpServletRequest getServletRequest() {
//		return (HttpServletRequest) FacesContext.getCurrentInstance()
//				.getExternalContext().getRequest();
//	}
//
//	public static HttpServletResponse getServletResponse() {
//		return (HttpServletResponse) FacesContext.getCurrentInstance()
//				.getExternalContext().getResponse();
//	}

	public static String getRequestContextPath() {
		return FacesContext.getCurrentInstance().getExternalContext()
				.getRequestContextPath();
	}

	public static void forward(String url) {

		FacesContext context = FacesContext.getCurrentInstance();
		context.getApplication().getNavigationHandler()
				.handleNavigation(context, null, url);
		context.renderResponse();
	}

	public static void forward(String url, boolean redirect) {
		url = url + (redirect ? "?faces-redirect=true" : "");

		FacesContext context = FacesContext.getCurrentInstance();
		context.getApplication().getNavigationHandler()
				.handleNavigation(context, null, url);
		context.renderResponse();
	}

	public static void redirecionar(String url) {

		try {

			FacesContext
					.getCurrentInstance()
					.getExternalContext()
					.redirect(
							FacesContext.getCurrentInstance()
									.getExternalContext()
									.getRequestContextPath()
									+ url);
		} catch (IOException e) {
			log.warn("nao foi possivel redirecionar o acesso do usuario", e);
		}

	}

	public static void redirecionar(String url, boolean mesmoPath) {

		try {

			StringBuilder pathCompleto = new StringBuilder();
			pathCompleto.append(FacesContext.getCurrentInstance()
					.getExternalContext().getRequestContextPath());

			if (mesmoPath) {

				String valor = FacesContext.getCurrentInstance()
						.getExternalContext().getRequestServletPath();

				pathCompleto.append(valor.substring(0, valor.lastIndexOf("/")));
				pathCompleto.append("/");
				pathCompleto.append(url);

			} else {
				pathCompleto.append(url);

			}

			FacesContext.getCurrentInstance().getExternalContext()
					.redirect(pathCompleto.toString());

		} catch (IOException e) {
			log.warn("nao foi possivel redirecionar o acesso do usuario", e);
		}
	}

	public static void renderComponent(String clientId) {
		FacesContext facesContext = FacesContext.getCurrentInstance();
		renderComponent(facesContext, clientId);
	}

	public static void renderComponent(FacesContext facesContext,
			String clientId) {
		facesContext.getPartialViewContext().getRenderIds().add(clientId);
	}

	public static void renderComponent(UIComponent uiComponent) {
		FacesContext facesContext = FacesContext.getCurrentInstance();
		renderComponent(facesContext, uiComponent);
	}

	public static void renderComponent(FacesContext facesContext,
			UIComponent uiComponent) {
		renderComponent(facesContext, uiComponent.getClientId(facesContext));
	}

	public static void resetEditableValueHolders() {
		Set<VisitHint> visitHints = EnumSet.of(VisitHint.SKIP_TRANSIENT);
		FacesContext context = FacesContext.getCurrentInstance();
		PartialViewContext partialViewContext = context.getPartialViewContext();

		if (partialViewContext.isAjaxRequest()) {
			Collection<String> renderIds = getRenderIds(partialViewContext);
			Collection<String> executeIds = partialViewContext.getExecuteIds();

			if (!renderIds.isEmpty() && !renderIds.containsAll(executeIds)) {
				FacesUtil.resetEditableValueHolders(VisitContext
						.createVisitContext(context, renderIds, visitHints),
						context.getViewRoot(), executeIds);
			}
		}
	}

	/**
	 * Find all editable value holder components in the component hierarchy,
	 * starting with the given component and reset them when they are not
	 * covered by the given execute IDs.
	 * 
	 * @param context
	 *            The visit context to work with.
	 * @param component
	 *            The starting point of the component hierarchy to look for
	 *            editable value holder components.
	 * @param executeIds
	 *            The execute IDs.
	 */
	private static void resetEditableValueHolders(VisitContext context,
			final UIComponent component, final Collection<String> executeIds) {
		component.visitTree(context, new VisitCallback() {
			@Override
			public VisitResult visit(VisitContext context, UIComponent target) {
				if (executeIds.contains(target.getClientId(context
						.getFacesContext()))) {
					return VisitResult.REJECT;
				}

				if (target instanceof EditableValueHolder) {
					((EditableValueHolder) target).resetValue();
				} else if (context.getIdsToVisit() != VisitContext.ALL_IDS) {
					// Render ID didn't point an EditableValueHolder. Visit all
					// children
					// as well.
					FacesUtil.resetEditableValueHolders(
							VisitContext.createVisitContext(
									context.getFacesContext(), null,
									context.getHints()), target, executeIds);
				}

				return VisitResult.ACCEPT;
			}
		});
	}

	private static Collection<String> getRenderIds(
			PartialViewContext partialViewContext) {
		Collection<String> renderIds = partialViewContext.getRenderIds();

		if (renderIds.isEmpty()) {
			renderIds = Collections.emptyList();
		}
		return renderIds;
	}

	/**
	 * Invalida a sessão corrente.
	 */
//	public static void invalidarSessao() {
//		SecurityContextHolder.clearContext();
//		getSession().invalidate();
//	}

	/**
	 * Obter a sessao (HttpSession) da requisicao
	 * 
	 * @return HttpSession
	 */
//	private static HttpSession getSession() {
//		return getServletRequest().getSession();
//	}
	
	public static String getLoginUsuarioLogado(){
		return getExternalContext().getRemoteUser();
	}
}