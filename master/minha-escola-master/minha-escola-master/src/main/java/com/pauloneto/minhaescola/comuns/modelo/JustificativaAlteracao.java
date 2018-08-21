package com.pauloneto.minhaescola.comuns.modelo;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

@Entity
@Table(name="tb_justificativaAlteracao")
public class JustificativaAlteracao implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="id_justificativa")
	private Integer idJustificativa;
	
	@Column(name="texto_justificativa",nullable=false)
	private String textoJustificativa;
	
	@Column(name="data_edicao",nullable=false)
	private Date dtEdicao;
	
	@OneToOne
	@JoinColumn(name="username")
	private Usuario usuarioEditor;
	
	@ManyToOne
	@JoinColumn(name="id_nota")
	@Fetch(FetchMode.JOIN)
	private Nota nota;
}
