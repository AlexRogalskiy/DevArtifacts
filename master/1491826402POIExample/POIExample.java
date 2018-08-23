import java.util.*;
import java.io.*;
import java.nio.charset.*;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.util.CellRangeAddress;

public class POIExample {

    private int n;
    private StringTokenizer st;
    // вспомогательные переменные
    // для строки текстового файла
    private String line = null;
    // для строки и ячейки Excel
    private short rownum;
    private short cellnum;

  // Конструктор класса 
  
  POIExample(String fileName) throws Exception {

    // выходной поток - новый файл .xls
    FileOutputStream out = new FileOutputStream("example.xls");
    // создаем новую книгу
    HSSFWorkbook wb = new HSSFWorkbook();
    // создаем новый лист
    HSSFSheet s = wb.createSheet();
    // объявляем объект строки
    HSSFRow r = null;
    // объявляем объект ячейки
    HSSFCell c = null;
    // создаем 3 объекта стилей
    HSSFCellStyle cs = wb.createCellStyle();
    HSSFCellStyle cs2 = wb.createCellStyle();
    HSSFCellStyle cs3 = wb.createCellStyle();
    
    // создаем 2 объекта шрифта
    HSSFFont f = wb.createFont();
    HSSFFont f2 = wb.createFont();

    // устанавливаем размер первого шрифта 14 пунктов
    f.setFontHeightInPoints((short)14);
    // тип шрифта
    f.setFontName("TimesNewRoman");
    // делаем шрифт полужирным
    f.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);

    // Устанавливаем размер второго шрифта 10 пунктов
    f2.setFontHeightInPoints((short) 10);
    f2.setFontName("TimesNewRoman");

    // для первого стиля устанавливаем шрифт f2
    cs.setFont(f2);
    // выравнивание
    cs.setAlignment(cs.ALIGN_LEFT);
    // обрамление
    cs.setBorderBottom(cs2.BORDER_THIN);
    cs.setBorderTop(cs2.BORDER_THIN);
    cs.setBorderLeft(cs2.BORDER_THIN);
    cs.setBorderRight(cs2.BORDER_THIN);
    // в этом стиле формат ячейки - по умолчанию

    // стиль cs2
    // задаем обрамление
    cs2.setBorderBottom(cs2.BORDER_THIN);
    cs2.setBorderTop(cs2.BORDER_THIN);
    cs2.setBorderLeft(cs2.BORDER_THIN);
    cs2.setBorderRight(cs2.BORDER_THIN);
    // для примера - зададим формат ячейки "text"
    cs2.setDataFormat(HSSFDataFormat.getBuiltinFormat("text"));
    //выравнивание - по центру
    cs2.setAlignment(cs.ALIGN_CENTER);
    // для стиля cs2 установим шрифт
    cs2.setFont(f2);
    
    // стиль cs3
    // формат ячейки
    cs3.setDataFormat(HSSFDataFormat.getBuiltinFormat("text"));
    // установим шрифт
    cs3.setFont(f);

    // задаем имя листа
    wb.setSheetName(0, "Отчет за V квартал" );

    // Открываем файл в кодировке Windows 1251
    BufferedReader in = new BufferedReader(new InputStreamReader(
             new FileInputStream(fileName), Charset.forName("CP1251")));

    rownum = (short) 0;
    
    // создаем ячейку для заголовка
    r = s.createRow(rownum);
    cellnum = (short) 0;
    c = r.createCell(cellnum);
    // устанавливаем высоту ячейки заголовка
    r.setHeight((short) 450);
    // устанавливаем стиль для ячейки
    c.setCellStyle(cs3);
    // текст для заголовка
    c.setCellValue("Заголовок отчета за V квартал");
    
    rownum++;
    
    // идем по строкам текстового файла
    while( (line = in.readLine()) != null) {
      if(line.trim().length()==0) break;
      
      // создаем новую строку
      r = s.createRow(rownum);
      //уст. высоту
      r.setHeight((short) 400);
      
      // разбиваем строку на токены, в качестве разделителей использован символ "#"
      st = new StringTokenizer(line, "#");
      
      n = st.countTokens();
      String[] a = new String[n];
      
      for (int j = 0; j < n; j++) {
        
        a[j] = st.nextToken();
        cellnum = (short) j;
        // создаем ячейку
        c = r.createCell(cellnum);
        // первая ячейка пошире и выравниваем шрифт по центру
        if (j == 0) {
                c.setCellStyle(cs);
                s.setColumnWidth((short) cellnum, (short) 14000);
        }
        //остальные используют стиль cs2
        else {
                c.setCellStyle(cs2);
                s.setColumnWidth((short) cellnum, (short) 3500);
        }
        // устанавливаем значение ячейки
        c.setCellValue(a[j]);
        
      }
      // переходим к следующей строке
      rownum++;
     
    }
    
    // Закрываем поток чтения файла
    in.close();
    
    // записываем информацию и закрываем выходной поток
    wb.write(out);
    out.close();
        
    return;
  }

  public static void main (String args[]) throws Exception {
        String file = "";
                
        for(int n = 0; n < args.length; n++) {
            if (args[n].equals("-f")) file = args[++n];
            else throw new IllegalArgumentException("Неверный аргумент!");
        }
        new POIExample (file);
        
  }

}
