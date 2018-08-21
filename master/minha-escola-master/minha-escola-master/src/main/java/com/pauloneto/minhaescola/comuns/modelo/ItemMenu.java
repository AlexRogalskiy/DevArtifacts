package com.pauloneto.minhaescola.comuns.modelo;

import java.io.Serializable;
import javax.persistence.*;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

/**
 * Entity implementation class for Entity: ItemMenu
 *
 */
@Entity
@Table(name="tb_item_menu")
public class ItemMenu implements Serializable {

	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer idItemMenu;
	
	@Column(nullable=false)
	private String dsItemMenu;
	
	@Column(nullable=false)
	private String url;
	
	@Column(nullable=false)
	private int ordem;
	
	@ManyToOne
	@JoinColumn(name="id_subMenu")
	@Fetch(FetchMode.JOIN)
	private SubMenu subMenu;

	/**
	 * @return the idItemMenu
	 */
	public Integer getIdItemMenu() {
		return idItemMenu;
	}

	/**
	 * @param idItemMenu the idItemMenu to set
	 */
	public void setIdItemMenu(Integer idItemMenu) {
		this.idItemMenu = idItemMenu;
	}

	/**
	 * @return the dsItemMenu
	 */
	public String getDsItemMenu() {
		return dsItemMenu;
	}

	/**
	 * @param dsItemMenu the dsItemMenu to set
	 */
	public void setDsItemMenu(String dsItemMenu) {
		this.dsItemMenu = dsItemMenu;
	}

	/**
	 * @return the url
	 */
	public String getUrl() {
		return url;
	}

	/**
	 * @param url the url to set
	 */
	public void setUrl(String url) {
		this.url = url;
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
	 * @return the subMenu
	 */
	public SubMenu getSubMenu() {
		return subMenu;
	}

	/**
	 * @param subMenu the subMenu to set
	 */
	public void setSubMenu(SubMenu subMenu) {
		this.subMenu = subMenu;
	}
}
