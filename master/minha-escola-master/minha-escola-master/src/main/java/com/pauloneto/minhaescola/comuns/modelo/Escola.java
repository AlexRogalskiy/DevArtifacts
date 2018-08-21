package com.pauloneto.minhaescola.comuns.modelo;

import java.io.Serializable;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name="tb_escola")
public class Escola implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id_escola")
	private int id;
	
	@Column(name="nome",nullable=false)
	private String nome;
	
	@Column(name="cnpj")
	private String cnpj;
	
	@Column(name="telefone",nullable=false)
	private String telefone;
	
	@Column(name="cod_inep")
	private String codInep;
	
	/**
	 * Se o aluno procede de uma outra escola 
	 * deve ser preenchido para indicar o periodo 
	 * em que o aluno estudou na escola anterior.
	 * Se o Aluno n�o procede de uma outra escola n�o deve ser preenchido.
	 * Periodo: MANH� - TARDE - NOITE
	 * */
	private String periodo;
	
	/**
	 * Se o aluno procede de uma outra escola 
	 * deve ser preenchido para indicar a serie 
	 * em que o aluno estudou na escola anterior.
	 * Se o Aluno n�o procede de uma outra escola n�o deve ser preenchido. 
	 * */
	private String serie;
	
	
	/**
	 * Se o aluno procede de uma outra escola 
	 * deve ser preenchido para indicar o nivel de ensino(Fundamental 1 ou 2) 
	 * em que o aluno estudou na escola anterior.
	 * Se o Aluno n�o procede de uma outra escola n�o deve ser preenchido.
	 * */
	@Column(name="nivel_ensino")
	private String nivelEnsino;
	
	@OneToOne(fetch=FetchType.EAGER,cascade=CascadeType.MERGE)
	@JoinColumn(name="id_endereco")
	private Endereco endereco;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getCnpj() {
		return cnpj;
	}

	public void setCnpj(String cnpj) {
		this.cnpj = cnpj;
	}

	public String getTelefone() {
		return telefone;
	}

	public void setTelefone(String telefone) {
		this.telefone = telefone;
	}

	public String getCodInep() {
		return codInep;
	}

	public void setCodInep(String codInep) {
		this.codInep = codInep;
	}

	public Endereco getEndereco() {
		return endereco;
	}

	public void setEndereco(Endereco endereco) {
		this.endereco = endereco;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	public String getPeriodo() {
		return periodo;
	}

	public void setPeriodo(String periodo) {
		this.periodo = periodo;
	}

	public String getSerie() {
		return serie;
	}

	public void setSerie(String serie) {
		this.serie = serie;
	}

	public String getNivelEnsino() {
		return nivelEnsino;
	}

	public void setNivelEnsino(String nivelEnsino) {
		this.nivelEnsino = nivelEnsino;
	}
	
	
}
