package com.pauloneto.minhaescola.apresentacao.mb;

import java.io.Serializable;

import javax.annotation.PostConstruct;

import org.primefaces.model.menu.DefaultMenuItem;
import org.primefaces.model.menu.DefaultMenuModel;
import org.primefaces.model.menu.DefaultSubMenu;
import org.primefaces.model.menu.MenuModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.pauloneto.minhaescola.comuns.modelo.ItemMenu;
import com.pauloneto.minhaescola.comuns.modelo.Menu;
import com.pauloneto.minhaescola.comuns.modelo.SubMenu;
import com.pauloneto.minhaescola.comuns.modelo.Usuario;
import com.pauloneto.minhaescola.comuns.util.FacesUtil;
import com.pauloneto.minhaescola.comuns.util.excecao.SiseducaException;
import com.pauloneto.minhaescola.negocio.interfaces.IMenuService;
import com.pauloneto.minhaescola.negocio.interfaces.IUsuarioService;

@Controller(value="sessaoControlador")
@Scope("session")
public class SessaoControlador implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private MenuModel menuModel;
	
	private Usuario usuarioLogado;
	
	@Autowired
	private IUsuarioService usuarioService;
	
	@Autowired
	private IMenuService menuService;
	
	@PostConstruct
	public void init() throws SiseducaException{
		String login = FacesUtil.getLoginUsuarioLogado();
		if(null != login && !login.isEmpty()){
			this.usuarioLogado = usuarioService.pesquisarPorLogin(login);
			obterMenuUsuario(usuarioLogado);
		}
	}

	private void obterMenuUsuario(Usuario usuario) throws SiseducaException{
		Menu menuUsuario = usuario.getMenu();
		if(menuUsuario != null 
				&& menuUsuario.getSubMenus() != null
					&& !menuUsuario.getSubMenus().isEmpty()){
			this.menuModel = new DefaultMenuModel();
			DefaultSubMenu subMenu;
			for(SubMenu sb: menuUsuario.getSubMenus()){
				subMenu = new DefaultSubMenu(sb.getDsSubMenu());
				DefaultMenuItem itemMenu;
				if(sb.getItensMenu() != null
						&& !sb.getItensMenu().isEmpty()){
					for(ItemMenu item :sb.getItensMenu()){
						itemMenu = new DefaultMenuItem(item.getDsItemMenu());
						itemMenu.setUrl(item.getUrl());
						subMenu.addElement(itemMenu);
					}
				}
				menuModel.addElement(subMenu);
			}
		}
	}
	
	/**
	 * @return the menuModel
	 */
	public MenuModel getMenuModel() {
		return menuModel;
	}

	/**
	 * @param menuModel the menuModel to set
	 */
	public void setMenuModel(MenuModel menuModel) {
		this.menuModel = menuModel;
	}

	/**
	 * @return the usuarioLogado
	 */
	public Usuario getUsuarioLogado() {
		return usuarioLogado;
	}

	/**
	 * @param usuarioLogado the usuarioLogado to set
	 */
	public void setUsuarioLogado(Usuario usuarioLogado) {
		this.usuarioLogado = usuarioLogado;
	}
}
