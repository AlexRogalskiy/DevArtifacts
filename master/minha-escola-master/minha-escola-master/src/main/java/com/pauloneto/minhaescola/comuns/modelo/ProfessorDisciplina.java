package com.pauloneto.minhaescola.comuns.modelo;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name="tb_professor_disciplina")
public class ProfessorDisciplina implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id_professor_disciplina")
	private int idProfessorDisciplina;
	
	private boolean ativo;
	
	@Column(name="data_alteracao")
	@Temporal(TemporalType.TIMESTAMP)
	private Date dtAlteracao;
	
	@OneToOne
	@JoinColumn(name="id_justificativa")
	private JustificativaAlteracao justificativa;
	
	@OneToOne
	@JoinColumn(name="id_professor")
	private Professor professor;
	
	@OneToOne
	@JoinColumn(name="id_disciplina")
	private Disciplina disciplina;
}
