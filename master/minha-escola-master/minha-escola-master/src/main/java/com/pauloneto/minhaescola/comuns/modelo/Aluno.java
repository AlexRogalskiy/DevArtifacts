package com.pauloneto.minhaescola.comuns.modelo;

import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name="tb_aluno")
public class Aluno implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="id_aluno")
	private Integer idAluno;
	
	@Column(nullable=false)
	private String noAluno;
	
	@Column(nullable=false)
	@Temporal(TemporalType.TIMESTAMP)
	private Date dtNascimento;
	
	@Column(nullable=false)
	private String noPai;
	
	@Column(nullable=false)
	private String noMae;
	
	@Column(nullable=false)
	private Cidade cidadeNatural;
	
	@Column(nullable=false)
	private Estado estadoNaturalidade;
	
	@OneToOne
	@JoinColumn(name="id_serie")
	private Serie serie;

	@OneToOne
	@JoinColumn(name="id_responsavel")
	private ResponsavelAluno responsavel;
	
	@OneToOne
	@JoinColumn(name="id_endereco")
	private Endereco endereco;
	
	@OneToMany(mappedBy="aluno")
	private Set<Contato> contatos;
	
	@OneToMany(mappedBy="aluno")
	private Set<Documento> documentos;
	
	@Enumerated(EnumType.STRING)
	private NivelEnsino nivelEnsino;
	
	@Enumerated(EnumType.STRING)
	private Turma turma;
	
	@Enumerated(EnumType.STRING)
	private Sexo sexo;
	
	@Enumerated(EnumType.STRING)
	private Turno turno;

	public Aluno(){
		this.contatos = new HashSet<Contato>();
		this.documentos = new HashSet<Documento>();
	}
	
	/**
	 * @return the idAluno
	 */
	public Integer getIdAluno() {
		return idAluno;
	}

	/**
	 * @param idAluno the idAluno to set
	 */
	public void setIdAluno(Integer idAluno) {
		this.idAluno = idAluno;
	}

	/**
	 * @return the noAluno
	 */
	public String getNoAluno() {
		return noAluno;
	}

	/**
	 * @param noAluno the noAluno to set
	 */
	public void setNoAluno(String noAluno) {
		this.noAluno = noAluno;
	}

	/**
	 * @return the dtNascimento
	 */
	public Date getDtNascimento() {
		return dtNascimento;
	}

	/**
	 * @param dtNascimento the dtNascimento to set
	 */
	public void setDtNascimento(Date dtNascimento) {
		this.dtNascimento = dtNascimento;
	}

	/**
	 * @return the noPai
	 */
	public String getNoPai() {
		return noPai;
	}

	/**
	 * @param noPai the noPai to set
	 */
	public void setNoPai(String noPai) {
		this.noPai = noPai;
	}

	/**
	 * @return the noMae
	 */
	public String getNoMae() {
		return noMae;
	}

	/**
	 * @param noMae the noMae to set
	 */
	public void setNoMae(String noMae) {
		this.noMae = noMae;
	}

	/**
	 * @return the cidadeNatural
	 */
	public Cidade getCidadeNatural() {
		return cidadeNatural;
	}

	/**
	 * @param cidadeNatural the cidadeNatural to set
	 */
	public void setCidadeNatural(Cidade cidadeNatural) {
		this.cidadeNatural = cidadeNatural;
	}

	/**
	 * @return the estadoNaturalidade
	 */
	public Estado getEstadoNaturalidade() {
		return estadoNaturalidade;
	}

	/**
	 * @param estadoNaturalidade the estadoNaturalidade to set
	 */
	public void setEstadoNaturalidade(Estado estadoNaturalidade) {
		this.estadoNaturalidade = estadoNaturalidade;
	}

	/**
	 * @return the serie
	 */
	public Serie getSerie() {
		return serie;
	}

	/**
	 * @param serie the serie to set
	 */
	public void setSerie(Serie serie) {
		this.serie = serie;
	}

	/**
	 * @return the responsavel
	 */
	public ResponsavelAluno getResponsavel() {
		return responsavel;
	}

	/**
	 * @param responsavel the responsavel to set
	 */
	public void setResponsavel(ResponsavelAluno responsavel) {
		this.responsavel = responsavel;
	}

	/**
	 * @return the endereco
	 */
	public Endereco getEndereco() {
		return endereco;
	}

	/**
	 * @param endereco the endereco to set
	 */
	public void setEndereco(Endereco endereco) {
		this.endereco = endereco;
	}

	/**
	 * @return the contatos
	 */
	public Set<Contato> getContatos() {
		return contatos;
	}

	/**
	 * @param contatos the contatos to set
	 */
	public void setContatos(Set<Contato> contatos) {
		this.contatos = contatos;
	}

	/**
	 * @return the documentos
	 */
	public Set<Documento> getDocumentos() {
		return documentos;
	}

	/**
	 * @param documentos the documentos to set
	 */
	public void setDocumentos(Set<Documento> documentos) {
		this.documentos = documentos;
	}

	/**
	 * @return the nivelEnsino
	 */
	public NivelEnsino getNivelEnsino() {
		return nivelEnsino;
	}

	/**
	 * @param nivelEnsino the nivelEnsino to set
	 */
	public void setNivelEnsino(NivelEnsino nivelEnsino) {
		this.nivelEnsino = nivelEnsino;
	}

	/**
	 * @return the turma
	 */
	public Turma getTurma() {
		return turma;
	}

	/**
	 * @param turma the turma to set
	 */
	public void setTurma(Turma turma) {
		this.turma = turma;
	}

	/**
	 * @return the sexo
	 */
	public Sexo getSexo() {
		return sexo;
	}

	/**
	 * @param sexo the sexo to set
	 */
	public void setSexo(Sexo sexo) {
		this.sexo = sexo;
	}

	/**
	 * @return the turno
	 */
	public Turno getTurno() {
		return turno;
	}

	/**
	 * @param turno the turno to set
	 */
	public void setTurno(Turno turno) {
		this.turno = turno;
	} 

	public Documento addDocumento(Documento documento){
		this.documentos.add(documento);
		documento.setAluno(this);
		return documento;
	}
}
