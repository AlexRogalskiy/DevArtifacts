package com.pauloneto.minhaescola.comuns.modelo;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

@Entity
@Table(name="tb_nota")
public class Nota implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="id_nota")
	private Integer idNota;

	@Column(nullable=false)
	private BigDecimal valor;
	
	@ManyToOne
	@JoinColumn(name="id_bimestre")
	@Fetch(FetchMode.JOIN)
	private Bimestre bimestre;
	
	@OneToMany(mappedBy="nota")
	private Set<JustificativaAlteracao> justificativa;
	
	@Enumerated(EnumType.STRING)
	private TipoNota tipo;
	
}
