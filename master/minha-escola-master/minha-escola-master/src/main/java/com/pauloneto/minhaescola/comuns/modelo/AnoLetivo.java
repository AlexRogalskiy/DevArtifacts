package com.pauloneto.minhaescola.comuns.modelo;

import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name="tb_anoLetivo")
public class AnoLetivo implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id_anoLetivo")
	private Integer idAnoLetivo;
	
	@Column(name="nome",nullable=false)
	private String nome;
	
	@Column(name="data_inicio",nullable=false)
	private Date dataInicio;
	
	@Column(name="data_terminio",nullable=false)
	private Date dataTerminio;

	@OneToMany(mappedBy="anoletivo")
	private Set<Serie> series;
	
	public AnoLetivo(){
		this.series = new HashSet<Serie>();
	}
	
	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	public Date getDataInicio() {
		return dataInicio;
	}

	public void setDataInicio(Date dataInicio) {
		this.dataInicio = dataInicio;
	}

	public Date getDataTerminio() {
		return dataTerminio;
	}

	public void setDataTerminio(Date dataTerminio) {
		this.dataTerminio = dataTerminio;
	}

	/**
	 * @return the idAnoLetivo
	 */
	public Integer getIdAnoLetivo() {
		return idAnoLetivo;
	}

	/**
	 * @param idAnoLetivo the idAnoLetivo to set
	 */
	public void setIdAnoLetivo(Integer idAnoLetivo) {
		this.idAnoLetivo = idAnoLetivo;
	}

	/**
	 * @return the series
	 */
	public Set<Serie> getSeries() {
		return series;
	}

	/**
	 * @param series the series to set
	 */
	public void setSeries(Set<Serie> series) {
		this.series = series;
	}
}