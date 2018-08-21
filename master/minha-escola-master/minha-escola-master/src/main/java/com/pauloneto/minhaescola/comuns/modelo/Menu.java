package com.pauloneto.minhaescola.comuns.modelo;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.*;

/**
 * Entity implementation class for Entity: Menu
 *
 */
@Entity
@Table(name="tb_menu")
public class Menu implements Serializable {

	
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="id_menu")
	private Integer idMenu;
	
	@OneToMany(mappedBy="menu",
			   cascade=CascadeType.ALL,
			   fetch=FetchType.EAGER)
	private Set<SubMenu> subMenus;
	
	public Menu(){
		super();
		this.subMenus = new HashSet<SubMenu>();
	}
	
	/**
	 * @return the idMenu
	 */
	public Integer getIdMenu() {
		return idMenu;
	}
	
	/**
	 * @param idMenu the idMenu to set
	 */
	public void setIdMenu(Integer idMenu) {
		this.idMenu = idMenu;
	}

	/**
	 * @return the subMenus
	 */
	public Set<SubMenu> getSubMenus() {
		return subMenus;
	}

	/**
	 * @param subMenus the subMenus to set
	 */
	public void setSubMenus(Set<SubMenu> subMenus) {
		this.subMenus = subMenus;
	}
	
	public void addSubMenu(SubMenu subMenu){
		subMenu.setMenu(this);
		this.subMenus.add(subMenu);
	}
}
