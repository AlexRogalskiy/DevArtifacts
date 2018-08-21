package com.pauloneto.minhaescola.comuns.util;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

import org.joda.time.DateTime;
import org.joda.time.Days;

import com.pauloneto.minhaescola.comuns.util.constantes.ConstantesGlobal;
import com.pauloneto.minhaescola.comuns.util.excecao.CoreValidacoes;
import com.pauloneto.minhaescola.comuns.util.excecao.SiseducaException;

public class CalendarioUtil {
    
    public static final String FORMATO_yyyyMM = "yyyyMM";
    
    public static final String FORMATO_MMMddyyyyHHmmaaa = "MMM dd yyyy hh:mmaaa";
    
    public static final String FORMATO_yyyyMMddHHmmssS = "yyyy-MM-dd HH:mm:ss.S";
    
    public static final String FORMATO_ddMMyyyyHHmmssS = "dd-MM-yyyy HH:mm:ss.S";
    
    public static final String FORMATO_yyyyMMdd = "yyyy-MM-dd";

    public static final String FORMATO_MMyyyy = "MM/yyyy";
    
    public static final String FORMATO_ddMMyyyy = "dd/MM/yyyy";
    
    public static final int PRIMEIRO_DIA_DO_MES = 1;
    
    public static final int MES_OUTUBRO = 10;
    
    public static final int ANO_2013 = 2013;
    
    public static final int DIAS_ANO_BISSEXTO = 366;
    
    public static final int DIAS_ANO = 365;
    
    private CalendarioUtil() {
	super();
    }

    public static int getAnoAtual() {
	return Calendar.getInstance().get(Calendar.YEAR);
    }
    
    public static int getAno(Date data){
	Calendar calendar = Calendar.getInstance();
	calendar.setTime(data);
	
	return calendar.get(Calendar.YEAR);
    }
    
    /**
     * 
     * @param dia
     * @param mes Considerando que Janeiro é igual a 1.
     * @param ano
     * @return
     */
    public static Date getData(int dia, int mes, int ano) {
	
	Calendar calendar = Calendar.getInstance();
	calendar.set(Calendar.DAY_OF_MONTH, dia);
	calendar.set(Calendar.MONTH, --mes);
	calendar.set(Calendar.YEAR, ano);
	
	return calendar.getTime();
    }
    
    public static Date getDataAtual() {
	return Calendar.getInstance().getTime();
    }
    
    /**
     * 
     * @param data
     * @return Retorna um int do Mês considerando que Janeiro é 1 diferentemente do Calendar que considera Janeiro igual a 0
     */
    public static int getMes(Date data) {
	Calendar calendar = Calendar.getInstance();
	calendar.setTime(data);
	
	return calendar.get(Calendar.MONTH) + 1;
    }
    
    public static int getMesAtual() {
	return Calendar.getInstance().get(Calendar.MONTH) + 1;
    }
    
    public static int getDiaDoMesAtual() {
	return Calendar.getInstance().get(Calendar.DAY_OF_MONTH);
    }
    
    
    public static String getDataFormatada(String pattern, Date data){
	SimpleDateFormat sdf = new SimpleDateFormat(pattern);
	return sdf.format(data);
    }
    
    public static Date getDataFormatadaDate(String pattern, Date data) throws SiseducaException{
	SimpleDateFormat sdf = new SimpleDateFormat(pattern);
	try {
	    data = sdf.parse(CalendarioUtil.getDataFormatada(pattern,data));
	} catch (Exception e) {
	    throw new SiseducaException(CoreValidacoes.ALERTA_DATA_INVALIDA, e);
	}
	return data;
    }
    
    /**
     * Método que a partir de uma String(data) retorna um Date no 
     * formato utilizado no Brasil a zero hora.
     *  
     * 
     * @author Alexandre
     * @param date - Data(String).
     * @return Date
     * @throws PMJPException
     */
    public static Date getDataStringFormatadaDate(String date) throws SiseducaException{

	SimpleDateFormat sdf = new SimpleDateFormat(FORMATO_ddMMyyyy);
	Date dateFormatada = null;	

	try {
	    dateFormatada = obterDataZeroHora(sdf.parse(date));
	} catch (Exception e) {
	    throw new SiseducaException(CoreValidacoes.ALERTA_DATA_INVALIDA, e);
	}

	return dateFormatada;
    }
    
    public static boolean verificaIntersecaoDatas(Date dataInicio, Date dataFim, Date dataInicioAlvo, Date dataFimAlvo) {
	
	//colocando validações para caso a data final seja indefinida
	if(dataFim == null && dataInicioAlvo.compareTo(dataInicio) >= ConstantesGlobal.VALOR_ZERO) {
	    return true;
	}
	
	//colocando validações para caso a data alvo final seja indefinida
	if(dataFimAlvo == null && dataInicioAlvo.compareTo(dataInicio) <= ConstantesGlobal.VALOR_ZERO) {
	    return true;
	}
	
	if(dataInicioAlvo != null && (dataInicioAlvo.compareTo(dataInicio) >= ConstantesGlobal.VALOR_ZERO 
		&& dataInicioAlvo.compareTo(dataFim) <= ConstantesGlobal.VALOR_ZERO)) {
	    return true;
	}
	
	if(dataFimAlvo != null && (dataFimAlvo.compareTo(dataInicio) >= ConstantesGlobal.VALOR_ZERO 
		&& dataFimAlvo.compareTo(dataFim) <= ConstantesGlobal.VALOR_ZERO)) {
	    return true;
	}
	
	return false;
    }
    
    /**
     * Método que verifica se a data passada é anterior a data atual.
     * @param dataAlvo - Data a ser comparada.
     * @return boolean - true se a data alvo for anterior a data atual, false se a data alvo 
     * for maior que a data atual.
     * @author Yallamy S. Silva  -  ydos@indracompany.com
     * @since 30/08/2013
     */
    public static boolean verificaDataAnteriorHoje(Date dataAlvo) {
	
  	if(dataAlvo != null && dataAlvo.compareTo(new Date()) < ConstantesGlobal.VALOR_ZERO) {
  	    return true;
  	}
  	
  	return false;
      }
    
    
    /**
     * Método que apartir de um String mês e um String ano, devolve um
     * Date representando o dia inicial deste mês.
     * @param String mes, String ano.
     * @return Date - dia inicial do mês passado. 
     * @author Paulo Neto pasilvan@indracompany.com
     * @since 17/09/2013
     */
    public static Date getDiaInicialDoMes(String mes, String ano) {
	int iMes = Integer.parseInt(mes);
	iMes = iMes - 1;
	int iAno = Integer.parseInt(ano);

	Calendar data = Calendar.getInstance(new Locale("pt","br"));

	data.set(Calendar.MONTH, iMes);
	data.set(Calendar.YEAR, iAno);
	data.set(Calendar.DAY_OF_MONTH,1);
	
	return data.getTime();
    }
    
    
    /**
     * Método que apartir de um String mês e um String ano, devolve um
     * Date representando o dia final deste mês.
     * @param String mes, String ano.
     * @return Date - dia inicial do mês passado. 
     * @author Paulo Neto pasilvan@indracompany.com
     * @since 17/09/2013
     */
    public static Date getDiaFinalDoMes(String mes, String ano){
	int iMes = Integer.parseInt(mes);
	iMes = iMes - 1;
	int iAno = Integer.parseInt(ano);
	
	int ultimoDia = 0;
	
	Calendar dataInicio = Calendar.getInstance(new Locale("pt","br"));
	Calendar dataFim = Calendar.getInstance(new Locale("pt","br"));

	dataInicio.set(Calendar.MONTH, iMes);
	dataInicio.set(Calendar.YEAR, iAno);
	dataInicio.set(Calendar.DAY_OF_MONTH,1);
	
	ultimoDia = dataInicio.getMaximum(Calendar.DAY_OF_MONTH);
	
	dataFim.set(Calendar.MONTH, iMes);
	dataFim.set(Calendar.YEAR, iAno);
	dataFim.set(Calendar.DAY_OF_MONTH,ultimoDia);
	
	return dataFim.getTime();
    }
    
    
    /**
     * Retornar um numero interiro correspondente ao último dia do mes 
     * passado no argumento
     * 
     * @author Paulo Neto
     * @param Sting mes,ano
     * @return int
     * **/
    public static int getUltimoDiaMes(String mes, String ano){
	int mesInt = Integer.parseInt(mes);  
	int anoInt = Integer.parseInt(ano);  
	Calendar c = Calendar.getInstance();    
	c.set(Calendar.MONTH, mesInt - 1);    
	c.set(Calendar.YEAR, anoInt);      
	return c.getActualMaximum(Calendar.DAY_OF_MONTH);
    }
    
    /**
     * Retornar um Date correspondente ao último dia do mes 
     * a partir do Date passado no argumento
     *
     * @Manutencao José Carlos Lacerda
     * 
     * @author Paulo Neto
     * @param Date date
     * @return Date
     * **/
    public static Date getUltimoDiaMes(Date data){
	
	Calendar c = Calendar.getInstance();
	c.setTime(data);
	
	c.set(Calendar.DAY_OF_MONTH, c.getActualMaximum(Calendar.DAY_OF_MONTH));
	
	return c.getTime();
    }
    
    /**
     * Verifica se o dia da data passada por parâmetro é útil.<br>
     * Os dias NÃO Útil são Sábado e Domingo.
     * 
     * @author José Carlos Lacerda
     * @param Date
     * @return boolean
     */
    public static boolean ehDiaUtil(Date data){
	
	Calendar c = Calendar.getInstance();
	c.setTime(data);
	
	int diaDaSemana = c.get(Calendar.DAY_OF_WEEK);
	
	if (diaDaSemana == Calendar.SATURDAY
		|| diaDaSemana == Calendar.SUNDAY) {
	    return false;
	}
	
	return true;
    }
    
    /**
     * Caso a data passada por parâmetro não sejá dia útil, o dia é alterado 
     * para o próximo dia útil.
     * 
     * @author José Carlos Lacerda
     * @param
     * @return Date
     * @throws
     */
    public static Date alteraParaDiaUtil(Date data) {
	
	if (!ehDiaUtil(data)) {
	    Calendar c = Calendar.getInstance();
	    c.setTime(data);
	    c.set(Calendar.DAY_OF_MONTH, c.get(Calendar.DAY_OF_MONTH) + 1);
	    
	    data = alteraParaDiaUtil(c.getTime());
	}
	
	return data;
	
    }
    
    
    /**
     * Método que verifica se a data de competência se encontra dentro do período
     * das duas datas para os profissionais em sociedade que considera apenas
     * o mês e o ano.
     * @param dataAlvo - Data da alvo.
     * @param dataInicio - Data início a ser verificada.
     * @param dataFim - Data fim a ser verificada.
     * @return boolean - true se a data alvo estiver no intervalo das datas inicio e fim - Data vigente.
     * False se a data alvo não estiver no intervalo das datas inicio e fim - Data não vigente.
     * @author Yallamy S. Silva  -  ydos@indracompany.com
     * @since 12/12/2013
     */
    public static boolean verificarDatasVigentesProfissionais(Date dataAlvo, Date dataInicio, Date dataFim) {
	
	//recuperando o mês e o ano das datas
	int mesAlvo = CalendarioUtil.getMes(dataAlvo);
	int anoAlvo = CalendarioUtil.getAno(dataAlvo);
	
	int mesInicio = CalendarioUtil.getMes(dataInicio);
	int anoInicio = CalendarioUtil.getAno(dataInicio);
	
	int mesFim = 0;
	int anoFim = 0;
	
	boolean dataVigente = false;
	
	if(dataFim != null) {
	    mesFim = CalendarioUtil.getMes(dataFim);
	    anoFim = CalendarioUtil.getAno(dataFim);
	}

	//verificando a interseção de datas
	if((anoInicio < anoAlvo)
		|| (anoInicio == anoAlvo && mesInicio <= mesAlvo)) {
	    
	    if(dataFim == null) {
		dataVigente = true;
	    } else if((anoFim > anoAlvo) 
		    || (anoFim == anoAlvo && mesFim >= mesAlvo)) {
		dataVigente = true;
	    }
	} 
	
	return dataVigente;
    }
    
    /**
     * Valida se duas datas são iguais
     * 
     * @author José Carlos Lacerda
     * 
     * @param Date dataPrimeira
     * @param Date dataSegunda
     * @param String pattern
     * @return boolean
     */
    public static boolean ehIgual(Date dataPrimeira, Date dataSegunda, String pattern){
	
	String dtPrimeira = getDataFormatada(pattern, dataPrimeira);
	String dtSegunda = getDataFormatada(pattern, dataSegunda);
	
	if (dtPrimeira.equals(dtSegunda)) {
	    return true;
	}
	
	return false;
    }
    
    /**
     * Verifica se e data contém no intervalo entre as datas dataInicio e 
     * dataFinal  
     * 
     * @author José Carlos Lacerda
     * 
     * @param Date dataInicio
     * @param Date dataInicio
     * @param Date data
     * 
     * @return boolean
     */
    public static boolean contemDataIntervalo(Date dataInicio, Date dataFinal,
	    Date data){
	
	int zero = 0;
	
	if (data.compareTo(dataInicio) >= zero 
		&& data.compareTo(dataFinal) <= zero) {
	    return true;
	}
	
	return false;
    }
    
    /**
     * Verifica se a soma do dias do intervalo das datas é maior ou menor que
     * {@value quantidadeDias}.
     * 
     * Se True, o intervalo é maior que {@value quantidadeDias}, caso contrario,
     * False.
     * 
     * Obs: A contagem é fechada em dtInicial e aberta e dtFinal.
     * 
     * @Manutenção Diego Sousa - dsazevedo@indracompany.com
     * @return boolean
     */
    public static boolean validaIntervaloDias(Date dtInicial, Date dtFinal,
	    int quantidadeDias) {

	if (dtFinal == null) {
	    dtFinal = dtInicial;
	}

	if (dtInicial == null) {
	    dtInicial = dtFinal;
	}

	DateTime dtinicio = new DateTime(dtInicial);
	DateTime dtFim = new DateTime(dtFinal);

	int intervalo = Days.daysBetween(dtinicio, dtFim).getDays();

	if (intervalo > quantidadeDias) {
	    return Boolean.FALSE;
    	}
    	return Boolean.TRUE;
    }
    
    
    
	/**
	 * Retorna a data atual com a hora, minutos e segundos igual a zero.
	 *  
	 * @return a data atual informada com a hora, minutos e segundos igual a zero.
	 */
	public static Date obterDataAtualZeroHora() {
		return obterDataZeroHora(new Date());
	}

	/**
	 * Retorna a data informada com a hora, minutos e segundos igual a zero.
	 * 
	 * @param data
	 *            a data que tera hora, minutos e segundos zerados.
	 * @return a data informada com a hora, minutos e segundos igual a zero.
	 */
	public static Date obterDataZeroHora(Date data) {
	    Date dataZeroHora = null;
	    if (data != null){
		Calendar calendario = Calendar.getInstance();
		calendario.setTime(data);
		calendario.set(Calendar.HOUR_OF_DAY, 0);
		calendario.set(Calendar.MINUTE, 0);
		calendario.set(Calendar.SECOND, 0);
		calendario.set(Calendar.MILLISECOND, 0);
		dataZeroHora = calendario.getTime();
	    }
	    return dataZeroHora;
	}    
	
	
	
	
	/**
	 * 
	 * Realiza a validação de uma data especifica em um período determinado,
	 * que eh representado por duas datas.
	 * 
	 * Exemplos de período valido :  
	 * 			
	 * 	exemplo: data esta entre o período de validade.
	 *      dataValidar = 21/06/2009
	 *  	Periodo de validade =  19/06/2009 eh 31/06/2009
	 *  	 
	 *  	Exemplo: data eh igual ao período inicial de validade.
	 *  	dataValidar = 19/06/2009
	 *  	Período de validade =  19/06/2009 eh 31/06/2009
	 *  
	 *  	Exemplo: data eh igual ao período final de validade.3
	 *  	dataValidar = 30/06/2009
	 *  	Período de validade =  19/06/2009 eh 30/06/2009
	 *
	 * Exemplos de período invalido :  
	 * 
	 *  	 
	 *  	Exemplo: data eh posterior ao período inicial de validade.
	 *  	portanto esta fora do período valido.
	 *  	dataValidar = 30/08/2010
	 *  	Período de validade =  19/06/2009 eh 31/06/2009
	 *  
	 *  	Exemplo: data eh anterior ao período inicial de validade.
	 *  	portanto esta fora do período valido.  
	 *  	dataValidar = 18/06/2009
	 *  	Período de validade =  19/06/2009 eh 30/06/2009
	 * 
	 * 
	 * 
	 * @param dataValidar
	 *                data a ser analisada.
	 * @param dataInicio
	 *                Date data de inicio.
	 * @param dataFim
	 *                Date data de fim.
	 * 
	 * @return <true> se data estiver entre data de inicio e data de fim
	 *         <false> caso contrário.
	 * 
	 */
	public static boolean ehPeriodoValidoEntreDatas(Date dataValidar,
		Date dataInicio, Date dataFim) {

	    boolean ehPeriodoValido = false;

	    if (dataValidar != null && dataInicio != null && dataFim != null) {
		dataValidar = obterDataZeroHora(dataValidar);
		dataInicio = obterDataZeroHora(dataInicio);
		dataFim = obterDataZeroHora(dataFim);

		ehPeriodoValido = (dataValidar.before(dataFim) && dataValidar
			.after(dataInicio))
			|| dataValidar.equals(dataInicio)
			|| dataValidar.equals(dataFim);
	    }

	    return ehPeriodoValido;

	}

	/**
	 * Validar as datas de vigencia, inicio e fim, de uma mensagem para usuario
	 * 
	 *  @author Paulo Neto - pasilvan@indracompany.com
	 *  @since 14/01/2015
	 *  @param Date 
	 *  @return boolean
	 */
	public static boolean validarVigenciaMsgUsuario(Date dataAtual,
		Date dtValidadeInicio, Date dtValidadeFim) {

	    if(dtValidadeInicio.before(dataAtual)){
		return false;
	    }
	    if(dtValidadeFim.before(dataAtual)){
		return false;
	    }
	    if(dtValidadeInicio.before(dataAtual)
		    && dtValidadeFim.before(dataAtual)){
		return false;
	    }
	    return true;
	}
	
	
	/**
	 * @author Éder Ferreira - efmendes@indracompany.com
	 * 
	 * Retorna um objeto Date de acordo com os anos somados.
	 * 
	 * @param data
	 *            a data a ser adicionada
	 * @param anos
	 *            o número de anos que serao adicionados
	 * @return a data somada
	 */
	public static Date adicionaAnos(Date data, int anos) {

	    Calendar calendar = Calendar.getInstance();

	    calendar.setTime(data);

	    calendar.add(Calendar.YEAR, anos);

	    return calendar.getTime();
	}
	
	/**
	 * Validar se as datas, dataInicio e dataFinal, correspondem a um 
	 * intervalo de 12 (Doze) meses.
	 * 
	 *  @author Paulo Neto - pasilvan@indracompany.com
	 *  @since 06/03/2015
	 *  @param Date 
	 *  @return boolean
	 */
    public static boolean isIntervaloMenorIgualDozeMeses(Date dataInicio,
	    Date dataFinal) {

	if (dataFinal == null) {
	    dataFinal = dataInicio;
	}

	if (dataInicio == null) {
	    dataInicio = dataFinal;
	}

	if (dataInicio.after(dataFinal)) {
	    return false;
	}

	DateTime dtinicio = new DateTime(dataInicio);
	DateTime dtFim = new DateTime(dataFinal);

	int intervalo = Days.daysBetween(dtinicio, dtFim).getDays();

	if (intervalo > DIAS_ANO_BISSEXTO) {
	    return Boolean.FALSE;
    	}
	return true;
    }
}

