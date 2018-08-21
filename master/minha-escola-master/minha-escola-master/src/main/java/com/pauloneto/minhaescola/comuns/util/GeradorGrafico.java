package com.pauloneto.minhaescola.comuns.util;

import java.awt.Color;
import java.awt.image.BufferedImage;
import java.util.ArrayList;
import java.util.Iterator;

import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.plot.PiePlot3D;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.data.category.DefaultCategoryDataset;
import org.jfree.data.general.DefaultPieDataset;
import org.jfree.util.Rotation;
import org.springframework.stereotype.Component;

import com.pauloneto.minhaescola.comuns.util.grafico.GraficoArquivoVo;

@Component
public class GeradorGrafico {

	/**
	 * 
	 * Gera um gráfico de barras 3D Vertical
	 * 
	 * @param tituloGrafico
	 *            String, o titulo do gráfico
	 * 
	 * @param tituloEixoX
	 *            String, o titulo do eixo X
	 * 
	 * @param tituloEixoY
	 *            String, o titulo do eixo Y
	 * 
	 * @param arrayValores
	 *            ArrayList, a lista com os valores para o gráfico
	 * 
	 * @return BufferedImage, a imagem do Gráfico gerada
	 * A classe DefaultCategoryDataset recebe os valores que irão gerar o gráfico
	 *
	 * DefaultCategoryDataset.addValue(Number, Comparable, Comparable)
	 * DefaultCategoryDataset.addValue(Double, Comparable, Comparable)
	 */

	public BufferedImage gerarGraficoBarraVertical3D(String tituloGrafico,
			String tituloEixoX, String tituloEixoY, ArrayList arrayValores)
			throws Exception {
		BufferedImage buf = null;
		try {
			DefaultCategoryDataset defaultCategoryDataset = new DefaultCategoryDataset();
			Iterator iterator = arrayValores.iterator();
			while (iterator.hasNext()) {
				GraficoArquivoVo modelo = (GraficoArquivoVo) iterator.next();
				defaultCategoryDataset.addValue(modelo.getQuantidade(),
				modelo.getTipoArquivo(), modelo.getTipoArquivo());
			}
			JFreeChart chart = ChartFactory.createBarChart3D(tituloGrafico,
					tituloEixoX,tituloEixoY, defaultCategoryDataset,
					PlotOrientation.VERTICAL,
					true, false, false);
			chart.setBorderVisible(true);
			chart.setBorderPaint(Color.black);
			buf = chart.createBufferedImage(400, 250);
		} catch (Exception e) {
			throw new Exception(e);
		}
		return buf;
	}

	/**
	 * 
	 * Gera um gráfico de barras Vertical
	 */
	public BufferedImage gerarGraficoBarraVertical(String tituloGrafico,
			String tituloEixoX, String tituloEixoY, ArrayList arrayValores)
			throws Exception {

		BufferedImage buf = null;
		try {
			DefaultCategoryDataset defaultCategoryDataset = new DefaultCategoryDataset();
			Iterator iterator = arrayValores.iterator();
			while (iterator.hasNext()) {
				GraficoArquivoVo modelo = (GraficoArquivoVo) iterator.next();
				defaultCategoryDataset.addValue(modelo.getQuantidade(),
				modelo.getTipoArquivo(), modelo.getTipoArquivo());
			}
			JFreeChart chart = ChartFactory.createBarChart(tituloGrafico,
					tituloEixoX,tituloEixoY, defaultCategoryDataset,
					PlotOrientation.VERTICAL, true, false, false);
			chart.setBorderVisible(true);
			chart.setBorderPaint(Color.black);
			buf = chart.createBufferedImage(400, 250);
		} catch (Exception e) {
			throw new Exception(e);
		}
		return buf;
	}

	/**
	 * 
	 * Gera um Grafico de Linhas
	 */
	public BufferedImage gerarGraficoLinha(String tituloGrafico,
			String tituloEixoX,String tituloEixoY, ArrayList arrayValores) throws Exception {
		BufferedImage buf = null;
		try {
			DefaultCategoryDataset defaultCategoryDataset = new DefaultCategoryDataset();
			Iterator iterator = arrayValores.iterator();
			while (iterator.hasNext()) {
				GraficoArquivoVo modelo = (GraficoArquivoVo) iterator.next();
				defaultCategoryDataset.addValue(modelo.getQuantidade(),
				modelo.getTipoArquivo(), modelo.getTipoArquivo());
			}
			JFreeChart chart = ChartFactory.createLineChart(tituloGrafico,
					tituloEixoX,tituloEixoY, defaultCategoryDataset,
					PlotOrientation.VERTICAL,
					true, false, false);
			chart.setBorderVisible(true);
			chart.setBorderPaint(Color.black);
			buf = chart.createBufferedImage(400, 250);
		} catch (Exception e) {
			throw new Exception(e);
		}
		return buf;
	}

	/**
	 * 
	 * Gera um grafico de linhas 3D
	 */
	public BufferedImage gerarGraficoLinha3D(String tituloGrafico,
			String tituloEixoX, String tituloEixoY, ArrayList arrayValores)
			throws Exception {
		BufferedImage buf = null;
		try {
			DefaultCategoryDataset defaultCategoryDataset = new DefaultCategoryDataset();
			Iterator iterator = arrayValores.iterator();
			while (iterator.hasNext()) {
				GraficoArquivoVo modelo = (GraficoArquivoVo) iterator.next();
				defaultCategoryDataset.addValue(modelo.getQuantidade(),
				modelo.getTipoArquivo(), modelo.getTipoArquivo());
			}
			JFreeChart chart = ChartFactory.createLineChart3D(tituloGrafico,
					tituloEixoX,tituloEixoY, defaultCategoryDataset,
					PlotOrientation.VERTICAL,
					true, false, false);
			chart.setBorderVisible(true);
			chart.setBorderPaint(Color.black);
			buf = chart.createBufferedImage(400, 250);
		} catch (Exception e) {
			throw new Exception(e);
		}
		return buf;
	}
	
	public BufferedImage gerarGraficoPizza3D(String tituloGrafico,
			String tituloEixoX, String tituloEixoY, ArrayList arrayValores)
			throws Exception {
		
		BufferedImage buf = null;
		try {
//			DefaultCategoryDataset defaultCategoryDataset = new DefaultCategoryDataset();
			DefaultPieDataset pizza = new DefaultPieDataset();
			
			Iterator iterator = arrayValores.iterator();
			while (iterator.hasNext()) {
				GraficoArquivoVo modelo = (GraficoArquivoVo) iterator.next();
				pizza.setValue(modelo.getTipoArquivo(), new Double(modelo.getQuantidade()));
			}
			JFreeChart chart = ChartFactory.createPieChart3D(tituloGrafico,
					pizza,true,true,true);
			
			Color cor = new java.awt.Color(200, 200, 200);
			chart.setBackgroundPaint(cor);
			
			PiePlot3D plot = (PiePlot3D) chart.getPlot();
			plot.setLabelLinksVisible(true);
			plot.setNoDataMessage("Não existem dados para serem exibidos no gráfico");

			plot.setStartAngle(90);
			plot.setDirection(Rotation.CLOCKWISE);

			plot.setForegroundAlpha(0.5f);
			plot.setInteriorGap(0.20);
			
			buf = chart.createBufferedImage(400, 250);
		} catch (Exception e) {
			throw new Exception(e);
		}
		return buf;
	}
}