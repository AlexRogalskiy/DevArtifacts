package com.pauloneto.minhaescola.comuns.modelo;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name="tb_professor")
public class Professor implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id_professor")
	private int idProfessor;
	
	@Column(name="nome",nullable=false)
	private String nome;
	
	@Column(name="matricula",nullable=false,unique=true)
	private String matricula;
	
	@OneToMany(mappedBy="professor")
	private Set<Contato> contatos;
	
	@OneToOne
	@JoinColumn(name="id_endereco")
	private Endereco endereco;
	
}
