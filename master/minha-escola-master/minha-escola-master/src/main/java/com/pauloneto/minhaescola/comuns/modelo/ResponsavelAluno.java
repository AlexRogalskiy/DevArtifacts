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

@Entity(name="tb_responsavelAluno")
public class ResponsavelAluno implements Serializable{

	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id_responsavel")
	private int idResponsavel;
	
	@Column(name="nome_responsavel",nullable=false)
	private String nome;
	
	private int idade;
	
	@OneToOne
	@JoinColumn(name="id_endereco")	
	private Endereco endereco;
	
	@OneToMany(mappedBy="aluno")
	private Set<Contato> contatos;
	
	@Column(name="grau_parentesco")
	private String grauParentesco;
	
	private String profissao;
	
	
}
