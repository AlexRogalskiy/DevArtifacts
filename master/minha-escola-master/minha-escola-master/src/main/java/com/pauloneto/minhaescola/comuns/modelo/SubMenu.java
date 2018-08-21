package com.pauloneto.minhaescola.comuns.modelo;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.*;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

/**
 * Entity implementation class for Entity: SubMenu
 *
 */
@Entity
@Table(name="tb_sub_menu")
public class SubMenu implements Serializable {

	
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="id_subMenu")
	private Integer idSubMenu;
	
	@Column(nullable=false)
	private String dsSubMenu;
	
	@Column(nullable=false)
	private int ordem;
	
	@ManyToOne
	@JoinColumn(name="id_menu")
	@Fetch(FetchMode.JOIN)
	private Menu menu;
	
	@OneToMany(mappedBy="subMenu",
			   cascade=CascadeType.ALL,
			   fetch=FetchType.EAGER)
	private Set<ItemMenu> itensMenu;
	
	public SubMenu(){
		super();
		this.itensMenu = new HashSet<ItemMenu>();
	}
	
	/**
	 * @return the dsSubMenu
	 */
	public String getDsSubMenu() {
		return dsSubMenu;
	}

	/**
	 * @param dsSubMenu the dsSubMenu to set
	 */
	public void setDsSubMenu(String dsSubMenu) {
		this.dsSubMenu = dsSubMenu;
	}

	/**
	 * @return the ordem
	 */
	public int getOrdem() {
		return ordem;
	}

	/**
	 * @param ordem the ordem to set
	 */
	public void setOrdem(int ordem) {
		this.ordem = ordem;
	}

	/**
	 * @return the itensMenu
	 */
	public Set<ItemMenu> getItensMenu() {
		return itensMenu;
	}

	/**
	 * @param itensMenu the itensMenu to set
	 */
	public void setItensMenu(Set<ItemMenu> itensMenu) {
		this.itensMenu = itensMenu;
	}

	/**
	 * @return the menu
	 */
	public Menu getMenu() {
		return menu;
	}

	/**
	 * @param menu the menu to set
	 */
	public void setMenu(Menu menu) {
		this.menu = menu;
	}
	
	public void addItemMenu(ItemMenu itemMenu){
		itemMenu.setSubMenu(this);
		this.itensMenu.add(itemMenu);
	}

	/**
	 * @return the idSubMenu
	 */
	public Integer getIdSubMenu() {
		return idSubMenu;
	}

	/**
	 * @param idSubMenu the idSubMenu to set
	 */
	public void setIdSubMenu(Integer idSubMenu) {
		this.idSubMenu = idSubMenu;
	}
	
	
}
