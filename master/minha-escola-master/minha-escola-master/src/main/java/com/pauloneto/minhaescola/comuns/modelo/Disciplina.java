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
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

@Entity
@Table(name="tb_disciplina")
public class Disciplina implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id_disciplina")
	private int idDisciplina;

	@Column(name="nome",nullable=false)
	private String nome;
	
	@OneToOne
	@JoinColumn(name = "id_planoCurso")
	private PlanoCurso planoCurso;
	
	@ManyToOne
	@JoinColumn(name="id_serie")
	@Fetch(FetchMode.JOIN)
	private Serie serie;
	
	@OneToMany(mappedBy="disciplina")
	private Set<Bimestre> bimestre;
	
	@OneToMany(mappedBy="disciplina")
	private Set<RegistroAula> registroAula;
	
}
