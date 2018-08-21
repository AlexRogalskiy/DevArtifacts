package com.pauloneto.minhaescola.comuns.modelo;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="tb_tipo_arquivo")
public class TipoArquivo implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -1604771361485153975L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id_tipo_arquivo")
	private Integer idTipoArquivo;
	
	@Column(name="ds_tipo_arquivo")
	private String descricao;

	public TipoArquivo(){}
	
	public TipoArquivo(Integer id, String desc){
		super();
		this.idTipoArquivo = id;
		this.descricao = desc;
	}
	/**
	 * @return the idTipoArquivo
	 */
	public Integer getIdTipoArquivo() {
		return idTipoArquivo;
	}

	/**
	 * @param idTipoArquivo the idTipoArquivo to set
	 */
	public void setIdTipoArquivo(Integer idTipoArquivo) {
		this.idTipoArquivo = idTipoArquivo;
	}

	/**
	 * @return the descricao
	 */
	public String getDescricao() {
		return descricao;
	}

	/**
	 * @param descricao the descricao to set
	 */
	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#hashCode()
	 */
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result
				+ ((descricao == null) ? 0 : descricao.hashCode());
		result = prime * result
				+ ((idTipoArquivo == null) ? 0 : idTipoArquivo.hashCode());
		return result;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}
		if (obj == null) {
			return false;
		}
		if (getClass() != obj.getClass()) {
			return false;
		}
		TipoArquivo other = (TipoArquivo) obj;
		if (descricao == null) {
			if (other.descricao != null) {
				return false;
			}
		} else if (!descricao.equals(other.descricao)) {
			return false;
		}
		if (idTipoArquivo == null) {
			if (other.idTipoArquivo != null) {
				return false;
			}
		} else if (!idTipoArquivo.equals(other.idTipoArquivo)) {
			return false;
		}
		return true;
	}
}
