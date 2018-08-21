package com.pauloneto.minhaescola.comuns.modelo;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

@Entity
@Table(name="tb_contato")
public class Contato implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="id_contato")
	private Integer idContato;
	
	@Column(nullable=false)
	private String dsContato;
	
	@ManyToOne
	@JoinColumn(name="id_aluno")
	@Fetch(FetchMode.JOIN)
	private Aluno aluno;
	
	@ManyToOne
	@JoinColumn(name="id_responsavel")
	@Fetch(FetchMode.JOIN)
	private ResponsavelAluno responsavelAluno;
	
	@ManyToOne
	@JoinColumn(name="id_professor")
	@Fetch(FetchMode.JOIN)
	private Professor professor;
	
	@Column(name="tpContato",nullable=false)
	@Enumerated(EnumType.STRING)
	private TipoContato tpContato;

	/**
	 * @return the idContato
	 */
	public Integer getIdContato() {
		return idContato;
	}

	/**
	 * @param idContato the idContato to set
	 */
	public void setIdContato(Integer idContato) {
		this.idContato = idContato;
	}

	/**
	 * @return the dsContato
	 */
	public String getDsContato() {
		return dsContato;
	}

	/**
	 * @param dsContato the dsContato to set
	 */
	public void setDsContato(String dsContato) {
		this.dsContato = dsContato;
	}

	/**
	 * @return the tpContato
	 */
	public TipoContato getTpContato() {
		return tpContato;
	}

	/**
	 * @param tpContato the tpContato to set
	 */
	public void setTpContato(TipoContato tpContato) {
		this.tpContato = tpContato;
	}
}
