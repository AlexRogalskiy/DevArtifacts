package com.pauloneto.minhaescola.comuns.modelo;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;



@Entity
@Table(name="tb_serie")
public class Serie implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="id_serie")
	private Integer idSerie;
	
	
	@Column(name="dsSerie",nullable=false)
	private String dsSerie;
	
	@ManyToOne
	@JoinColumn(name="id_anoLetivo")
	@Fetch(FetchMode.JOIN)
	private AnoLetivo anoletivo;

	@OneToMany(mappedBy="serie")
	private Set<Disciplina> disciplinas;
	
	/**
	 * @return the idSerie
	 */
	public Integer getIdSerie() {
		return idSerie;
	}

	/**
	 * @param idSerie the idSerie to set
	 */
	public void setIdSerie(Integer idSerie) {
		this.idSerie = idSerie;
	}

	/**
	 * @return the dsSerie
	 */
	public String getDsSerie() {
		return dsSerie;
	}

	/**
	 * @param dsSerie the dsSerie to set
	 */
	public void setDsSerie(String dsSerie) {
		this.dsSerie = dsSerie;
	}

	/**
	 * @return the anoletivo
	 */
	public AnoLetivo getAnoletivo() {
		return anoletivo;
	}

	/**
	 * @param anoletivo the anoletivo to set
	 */
	public void setAnoletivo(AnoLetivo anoletivo) {
		this.anoletivo = anoletivo;
	}
}
