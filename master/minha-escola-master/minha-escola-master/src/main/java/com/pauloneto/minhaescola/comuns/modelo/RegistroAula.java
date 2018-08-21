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
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

@Entity
@Table(name="tb_registroAula")
public class RegistroAula implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id_registroAula")
	private Integer idRegistroAula;
	
	@Column(nullable=false)
	@Temporal(TemporalType.TIMESTAMP)
	private Date dtAula;
	
	@Column(nullable=false)
	private String textoAnotacao;
	
	@ManyToOne
	@JoinColumn(name="id_disciplina")
	@Fetch(FetchMode.JOIN)
	private Disciplina disciplina;
	

}
