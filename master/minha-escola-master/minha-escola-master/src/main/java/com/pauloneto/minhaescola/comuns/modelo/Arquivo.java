package com.pauloneto.minhaescola.comuns.modelo;

import java.io.Serializable;
import java.lang.Integer;
import java.lang.String;
import java.util.Arrays;

import javax.persistence.*;

/**
 * Entity implementation class for Entity: Arquivo
 *
 */
@Entity
@Table(name="tb_arquivo")
public class Arquivo implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="id_arquivo")
	private Integer idArquivo;
	
	@Lob
	@Column(name="arquivo_binario", nullable=false)
	private byte[] arquivoBinario;
	
	@Column(name="nome_arquivo")
	private String nomeArquivo;

	@OneToOne
	@JoinColumn(name="id_tipo_arquivo")
	private TipoArquivo tipoArquivo;
	
	public Arquivo() {
		super();
	}   
	public Integer getIdArquivo() {
		return this.idArquivo;
	}

	public void setIdArquivo(Integer idArquivo) {
		this.idArquivo = idArquivo;
	}   
	public byte[] getArquivoBinario() {
		return this.arquivoBinario;
	}

	public void setArquivoBinario(byte[] arquivoBinario) {
		this.arquivoBinario = arquivoBinario;
	}   
	public String getNomeArquivo() {
		return this.nomeArquivo;
	}

	public void setNomeArquivo(String nomeArquivo) {
		this.nomeArquivo = nomeArquivo;
	}
	/**
	 * @return the tipoArquivo
	 */
	public TipoArquivo getTipoArquivo() {
		return tipoArquivo;
	}
	/**
	 * @param tipoArquivo the tipoArquivo to set
	 */
	public void setTipoArquivo(TipoArquivo tipoArquivo) {
		this.tipoArquivo = tipoArquivo;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#hashCode()
	 */
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + Arrays.hashCode(arquivoBinario);
		result = prime * result
				+ ((idArquivo == null) ? 0 : idArquivo.hashCode());
		result = prime * result
				+ ((nomeArquivo == null) ? 0 : nomeArquivo.hashCode());
		result = prime * result
				+ ((tipoArquivo == null) ? 0 : tipoArquivo.hashCode());
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
		Arquivo other = (Arquivo) obj;
		if (!Arrays.equals(arquivoBinario, other.arquivoBinario)) {
			return false;
		}
		if (idArquivo == null) {
			if (other.idArquivo != null) {
				return false;
			}
		} else if (!idArquivo.equals(other.idArquivo)) {
			return false;
		}
		if (nomeArquivo == null) {
			if (other.nomeArquivo != null) {
				return false;
			}
		} else if (!nomeArquivo.equals(other.nomeArquivo)) {
			return false;
		}
		if (tipoArquivo == null) {
			if (other.tipoArquivo != null) {
				return false;
			}
		} else if (!tipoArquivo.equals(other.tipoArquivo)) {
			return false;
		}
		return true;
	}
}
