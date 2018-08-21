package langusta3.gui;

import java.awt.Color;
import java.awt.Component;
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.JLabel;
import javax.swing.JTable;
import javax.swing.ListModel;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;
import javax.swing.event.ListDataListener;
import javax.swing.event.TableModelListener;
import javax.swing.table.AbstractTableModel;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.TableModel;
import langusta3.core.Alphabet;
import langusta3.core.SpelledWord;
import langusta3.core.Vowel;
import langusta3.corpus.FrequencyCorpus;
import langusta3.corpus.iCorpus;
import langusta3.cz.ChSpeller;
import langusta3.cz.CzechXMLGenerator;
import langusta3.pattern.ExtendedFormInfoTO;
import langusta3.pattern.FormInfoTO;
import langusta3.pattern.Generator;
import langusta3.pattern.Pattern;
import langusta3.pattern.PatternFinder;
import langusta3.spelling.NaiveSpeller;
import langusta3.spelling.iSpeller;
import langusta3.xml.XMLAlphabet;
import langusta3.xml.XMLException;
import langusta3.xml.XMLGenerator;

public class ApplicationGUI extends javax.swing.JFrame {

    private String wordsFilename;
    private String annoFilename;
    private List<String> newWords;
    private List<List<String>> newPatterns;
    private iSpeller naiveSpeller;
    private iSpeller desambSpeller;
    private iCorpus corpus;
    private Alphabet alphabet;
    private XMLGenerator generator;
    private PatternFinder pf;
    private int currentWordIndex;
    
    public ApplicationGUI(String wordsFilename, String patternFilename, String corpusFilename) throws FileNotFoundException, UnsupportedEncodingException, IOException, XMLException {
        initComponents();

        /**
         ** Initialisations
         *
         */
        newWords = new ArrayList<String>();
        newPatterns = new ArrayList<List<String>>();
        alphabet = new XMLAlphabet("cz");
        naiveSpeller = new NaiveSpeller(alphabet);
        desambSpeller = new ChSpeller(new XMLAlphabet("cz"));

        this.wordsFilename = wordsFilename;
        this.annoFilename = wordsFilename;
        this.generator = new CzechXMLGenerator(desambSpeller, new FileInputStream(patternFilename));
        this.generator.load();
        this.corpus = new FrequencyCorpus(corpusFilename);
        pf = new PatternFinder(this.generator);

        /**
         ** Load new words to GUI
         *
         */
        BufferedReader in = new BufferedReader(new InputStreamReader(new FileInputStream(wordsFilename), "utf-8"));
        String readWord;
        String actualLine;
        
        while ((actualLine = in.readLine()) != null) {
            List<String> patts = new ArrayList<String>();

            int count = 0;

            actualLine = actualLine.trim();

            if (actualLine.indexOf(":") != -1) {
                readWord = actualLine.substring(0, actualLine.indexOf(":"));

                // @todo:load data str.split(";") add to newPatt
                String p = actualLine.substring(actualLine.indexOf(":") + 1);
                String px[] = p.split(";");
                for (String pname : px) {
                    if (! pname.isEmpty()) {
                        patts.add(pname);
                    }
                }
                
                /**
                 * Do not show words with with no candidate patterns *
                 */
                try {
                    int x = naiveSpeller.wordSpelling(readWord).size();

                    if (x == 0) {
                        continue;
                    } else {
                        boolean pass = false;

                        for (int i = 0; i < x; i++) {
                            if (generator.getPossiblePatterns(naiveSpeller.wordSpelling(readWord).get(i)).size() > 0) {
                                pass = true;
                            }
                        }

                        if (pass == false) {
                            continue;
                        }
                    }
                } catch (Exception e) {
                    continue;
                }
            } else {
                continue;
            }

            newWords.add(readWord);
            // @todo: load from file
            newPatterns.add(patts);
        }

        class wordsLModel implements ListModel {

            public wordsLModel() {
            }

            public int getSize() {
                return newWords.size();
            }

            public Object getElementAt(int index) {
                return newWords.get(index);
            }

            public void addListDataListener(ListDataListener l) {
                return;
            }

            public void removeListDataListener(ListDataListener l) {
                return;
            }
        }

        jList1.removeAll();// Listen for changes in the text

        jFilter.getDocument().addDocumentListener(new DocumentListener() {
            public void insertUpdate(DocumentEvent e) {
                setPatternParts();
            }

            public void removeUpdate(DocumentEvent e) {
                setPatternParts();
            }

            public void changedUpdate(DocumentEvent e) {
                setPatternParts();
            }
        });

        jList1.setModel(new wordsLModel());       
        this.currentWordIndex = -1;
        if (newWords.size() > 0) {
            jList1.setSelectedIndex(0);
            this.currentWordIndex = 0;
        }
    }

    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jScrollPane1 = new javax.swing.JScrollPane();
        jList1 = new javax.swing.JList();
        jComboBox1 = new javax.swing.JComboBox();
        jLabel3 = new javax.swing.JLabel();
        jScrollPane2 = new javax.swing.JScrollPane();
        jTable1 = new javax.swing.JTable();
        jButton1 = new javax.swing.JButton();
        jButton2 = new javax.swing.JButton();
        jFilter = new javax.swing.JTextField();
        jLabel1 = new javax.swing.JLabel();
        jButton3 = new javax.swing.JButton();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setTitle("Patassi");

        jList1.setModel(new javax.swing.AbstractListModel() {
            String[] strings = { "Item 1", "Item 2", "Item 3", "Item 4", "Item 5" };
            public int getSize() { return strings.length; }
            public Object getElementAt(int i) { return strings[i]; }
        });
        jList1.addListSelectionListener(new javax.swing.event.ListSelectionListener() {
            public void valueChanged(javax.swing.event.ListSelectionEvent evt) {
                jList1ValueChanged(evt);
            }
        });
        jScrollPane1.setViewportView(jList1);

        jComboBox1.setFont(new java.awt.Font("Lucida Grande", 0, 24)); // NOI18N
        jComboBox1.setEnabled(false);
        jComboBox1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jComboBox1ActionPerformed(evt);
            }
        });

        jLabel3.setText("At least one unique for: []");

        jTable1.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {

            }
        ));
        jTable1.setColumnSelectionAllowed(true);
        jTable1.setEnabled(false);
        jTable1.setRowSelectionAllowed(false);
        jTable1.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                jTable1MouseClicked(evt);
            }
        });
        jScrollPane2.setViewportView(jTable1);

        jButton1.setText("Previous");
        jButton1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton1ActionPerformed(evt);
            }
        });

        jButton2.setText("Next");
        jButton2.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton2ActionPerformed(evt);
            }
        });

        jLabel1.setText("Filter:");

        jButton3.setText("Save");
        jButton3.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton3ActionPerformed(evt);
            }
        });

        org.jdesktop.layout.GroupLayout layout = new org.jdesktop.layout.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
            .add(layout.createSequentialGroup()
                .addContainerGap()
                .add(layout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
                    .add(jScrollPane2, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, 660, Short.MAX_VALUE)
                    .add(org.jdesktop.layout.GroupLayout.TRAILING, jComboBox1, 0, 660, Short.MAX_VALUE)
                    .add(org.jdesktop.layout.GroupLayout.TRAILING, jScrollPane1, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, 660, Short.MAX_VALUE)
                    .add(jLabel3, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, 660, Short.MAX_VALUE)
                    .add(layout.createSequentialGroup()
                        .add(jButton1)
                        .add(65, 65, 65)
                        .add(jLabel1)
                        .add(18, 18, 18)
                        .add(jFilter, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, 195, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(org.jdesktop.layout.LayoutStyle.RELATED)
                        .add(jButton3)
                        .addPreferredGap(org.jdesktop.layout.LayoutStyle.RELATED, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .add(jButton2)))
                .addContainerGap())
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
            .add(layout.createSequentialGroup()
                .addContainerGap()
                .add(jScrollPane1, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(org.jdesktop.layout.LayoutStyle.RELATED)
                .add(jComboBox1, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, 39, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(org.jdesktop.layout.LayoutStyle.RELATED)
                .add(layout.createParallelGroup(org.jdesktop.layout.GroupLayout.BASELINE)
                    .add(jButton1)
                    .add(jButton2)
                    .add(jFilter, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE)
                    .add(jLabel1)
                    .add(jButton3))
                .addPreferredGap(org.jdesktop.layout.LayoutStyle.UNRELATED)
                .add(jLabel3, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, 20, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(org.jdesktop.layout.LayoutStyle.RELATED)
                .add(jScrollPane2, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE)
                .addContainerGap())
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void jComboBox1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jComboBox1ActionPerformed
        this.setPatternParts();
    }//GEN-LAST:event_jComboBox1ActionPerformed

    private void jList1ValueChanged(javax.swing.event.ListSelectionEvent evt) {//GEN-FIRST:event_jList1ValueChanged

        if (this.currentWordIndex == jList1.getSelectedIndex()) {
            return;
        } else {
            if (this.currentWordIndex != -1) {
                this.saveRecord(this.currentWordIndex, jTable1.getSelectedColumns());
            }
        }
        
        jComboBox1.removeAllItems();

        if (jList1.getSelectedIndex() == -1) {
            // Word is not selected
            jComboBox1.setEnabled(false);
            jLabel3.setText("");
            jTable1.setModel(new EmptyModel());
            return;
        } else {
            jComboBox1.setEnabled(true);
        }

        // Spelling of the word
        List<SpelledWord> spellings = naiveSpeller.wordSpelling((String) jList1.getSelectedValue());
        List<SpelledWord> selectedSpelling = desambSpeller.wordSpelling((String) jList1.getSelectedValue());
        for (SpelledWord lv : spellings) {
            jComboBox1.addItem(lv.getStringAsList());
            if (lv.getStringAsList().equals(selectedSpelling.get(0).getStringAsList())) {
                jComboBox1.setSelectedItem(lv.getStringAsList());
            }
        }

        if (jComboBox1.getItemCount() == 1) {
            jComboBox1.setEnabled(false);
        }
        if (jComboBox1.getItemCount() == 0) {
            jTable1.setModel(new EmptyModel());
            return;
        }
        
        this.currentWordIndex = jList1.getSelectedIndex();
    }//GEN-LAST:event_jList1ValueChanged

    private void jButton1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButton1ActionPerformed
        this.saveRecord(jList1.getSelectedIndex(), jTable1.getSelectedColumns());

        int selected = jList1.getSelectedIndex();
        if (selected >= 1) {
            jList1.setSelectedIndex(jList1.getSelectedIndex() - 1);
        }
    }//GEN-LAST:event_jButton1ActionPerformed

    private void jButton2ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButton2ActionPerformed
        this.saveRecord(jList1.getSelectedIndex(), jTable1.getSelectedColumns());
        int selected = jList1.getSelectedIndex();
        if (selected < newWords.size()) {
            jList1.setSelectedIndex(jList1.getSelectedIndex() + 1);
        }
    }//GEN-LAST:event_jButton2ActionPerformed

    private void jButton3ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButton3ActionPerformed
        this.saveAnno();
    }//GEN-LAST:event_jButton3ActionPerformed

    private void jTable1MouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_jTable1MouseClicked
        // columns are selected when this action is enabled
        this.saveRecord(jList1.getSelectedIndex(), jTable1.getSelectedColumns());
        this.setPatternParts();
        // TODO add your handling code here:
    }//GEN-LAST:event_jTable1MouseClicked

    public static void main(final String args[]) {
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                try {
                    // new ApplicationGUI("/home/xgrac/tmp/lang/korpus-cz.freq.all", "src/data/cz/patterns-all.xml", "/home/xgrac/tmp/lang/fall.freqq").setVisible(true);
                    new ApplicationGUI(args[0], args[1], args[2]).setVisible(true);
                    // SK: new ApplicationGUI("/home/xgrac/tmp/korpus.freq", "src/data/sk/patterns-verb.xml", "/home/xgrac/tmp/korpus.freq").setVisible(true);
                } catch (Exception e) {
                    System.out.println(e);
                    System.exit(11);
                }
            }
        });
    }

    private void setPatternParts() {
        if (((jComboBox1 != null) && (jComboBox1.getSelectedIndex() != -1)) == false) {
            jLabel3.setText("At least one unique for: []");
            jTable1.setEnabled(false);
            jTable1.setModel(new EmptyModel());

            return;
        }

        SpelledWord spellingOfWord = naiveSpeller.wordSpelling(jList1.getSelectedValue().toString()).get(jComboBox1.getSelectedIndex());
        List<Pattern> candidatePatterns = generator.getPossiblePatterns(spellingOfWord);

        Set<String> corporaPatterns = new HashSet<String>();
        List<FormInfoTO> uniqWForms = pf.getUniqueWForms(spellingOfWord, jFilter.getText());
        List<FormInfoTO> discWForms = pf.getDiscriminativeWForms(spellingOfWord, jFilter.getText());
        for (FormInfoTO f : uniqWForms) {
            if (corpus.getTokenFrequency(f.getWord().toString()) != null) {
                corporaPatterns.add(f.getPattern());
            }
        }
        jLabel3.setText("At least one unique for: " + corporaPatterns.toString());

        // Fill eFormInfoTO with generatated forms
        Map<String, List<ExtendedFormInfoTO>> forms = new HashMap<String, List<ExtendedFormInfoTO>>();

        for (Pattern p : candidatePatterns) {
            List<ExtendedFormInfoTO> pforms = new ArrayList<ExtendedFormInfoTO>();
            forms.put(p.toString(), pforms);
            for (FormInfoTO f : p.getWordForms(p.getBases(spellingOfWord))) {
                if ((!jFilter.getText().isEmpty()) && (!f.getTag().contains(jFilter.getText()))) {
                    continue;
                }

                ExtendedFormInfoTO eto = new ExtendedFormInfoTO();
                pforms.add(eto);

                eto.setLemma(f.getLemma());
                eto.setPattern(f.getPattern());
                eto.setWord(f.getWord());
                eto.setTag(f.getTag());
                eto.setFreq(corpus.getTokenFrequency(f.getWord().toString()));
                for (FormInfoTO fx : uniqWForms) {
                    if (fx.getWord().toString().equals(eto.getWord().toString()) == true) {
                        eto.setUnique(true);
                    }
                }
                for (FormInfoTO fx : discWForms) {
                    if (fx.getWord().toString().equals(eto.getWord().toString()) == true) {
                        eto.setDiscriminative(true);
                    }
                }
            }
        }

        // Fill those information to the table
        class Mongo implements TableModel {

            private Map<String, List<ExtendedFormInfoTO>> map;
            private List<String> patterns;
            private List<String> gtags;

            public Mongo(Generator generator, Map<String, List<ExtendedFormInfoTO>> m, List<String> selectedPatterns) {
                map = m;
                List<String> allPatterns = new ArrayList<String>(m.keySet());
                gtags = new ArrayList<String>();

                /* remove patterns that do not match constraints */
                patterns = new ArrayList<String>();
                for (String p : allPatterns) {
                    if (generator.getPattern(p).getLimitPattern().isEmpty()) {
                        patterns.add(p);
                    } else {
                        boolean accept = false;
                        for (String px : generator.getPattern(p).getLimitPattern()) {
                            if (selectedPatterns.contains(px)) {
                                accept = true;
                            }
                        }
                        if (accept) {
                            patterns.add(p);
                        }
                    }
                }
                
                for (String p : patterns) {
                    for (FormInfoTO f : map.get(p)) {
                        if (gtags.contains(f.getTag()) == false) {
                            gtags.add(f.getTag());
                        }
                    }
                }
            }

            public int getRowCount() {
                return gtags.size();
            }

            public int getColumnCount() {
                return patterns.size() + 1;
            }

            public String getColumnName(int columnIndex) {
                if (columnIndex != 0) {
                    return patterns.get(columnIndex - 1);
                } else {
                    return "";
                }
            }

            public Class<?> getColumnClass(int columnIndex) {
                return Mongo.class;
            }

            public boolean isCellEditable(int rowIndex, int columnIndex) {
                return false;
            }

            public Object getValueAt(int rowIndex, int columnIndex) {
                String result = new String();

                // In the 1st column we have info about tags
                if (columnIndex == 0) {
                    return gtags.get(rowIndex);
                }
                columnIndex = columnIndex - 1;

                for (ExtendedFormInfoTO f : map.get(patterns.get(columnIndex))) {
                    if (f.getTag().equals(gtags.get(rowIndex))) {
                        return f;
                    }
                }

                return null;
            }

            public void setValueAt(Object aValue, int rowIndex, int columnIndex) {
                return;
            }

            public void addTableModelListener(TableModelListener l) {
                return;
            }

            public void removeTableModelListener(TableModelListener l) {
                return;
            }
        }

        jTable1.setModel(new Mongo(this.generator, forms, this.newPatterns.get(jList1.getSelectedIndex())));
        jTable1.setDefaultRenderer(Object.class, new MyTableCellRenderer());
        jTable1.clearSelection();

        for (String patternName : this.newPatterns.get(jList1.getSelectedIndex())) {
            if (patternName.isEmpty()) {
                continue;
            }

            for (int i = 0; i < jTable1.getColumnCount(); i++) {
                if (jTable1.getColumnName(i).equals(patternName)) {
                    jTable1.addColumnSelectionInterval(i, i);
                }
            }
        }
        
        jTable1.setEnabled(true);
    }

    private void saveRecord(int idxWord, int[] selectedColumns) {
        this.newPatterns.set(idxWord, new ArrayList<String>());
        for (int c = 0; c < selectedColumns.length; c++) {
            this.newPatterns.get(idxWord).add(jTable1.getColumnName(selectedColumns[c]));
//            System.out.println(jTable1.getColumnName(selectedColumns[c]));
        }
        // throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    private class MyTableCellRenderer extends DefaultTableCellRenderer {

        public Component getTableCellRendererComponent(JTable table, Object value, boolean isSelected, boolean hasFocus, int row, int column) {
            JLabel c = (JLabel) super.getTableCellRendererComponent(table, value, isSelected, hasFocus, row, column);

            c.setBackground(new Color(255, 255, 255));
            c.setForeground(new Color(0, 0, 0));
            if (column == 0) {
                return c;
            }

            if (value == null) {
                return c;
            }

            ExtendedFormInfoTO f = (ExtendedFormInfoTO) value;

            if ((f.getWord().toString() == null) || (f.getWord().toString().length() == 0)) {
                c.setText("");
                return c;
            }

            c.setText(f.getWord().toString());
            if (f.getUnique() == true) {
                if (f.getFreq() != null) {
                    c.setBackground(new Color(200, 20, 20));
                } else {
                    c.setBackground(new Color(240, 150, 150));
                }
            } else if (f.getDiscriminative() == true) {
                if (f.getFreq() != null) {
                    c.setBackground(new Color(20, 200, 20));
                } else {
                    c.setBackground(new Color(150, 240, 150));
                }
            } else if (f.getFreq() != null) {
                c.setBackground(new Color(230, 230, 230));
            }

            if (isSelected == true) {
                if ((f.getDiscriminative() == true) || (f.getUnique() == true)) {
                    c.setBackground(new Color(80, 80, 80));
                    c.setForeground(new Color(250, 250, 250));
                } else {
                    c.setBackground(new Color(10, 10, 10));
                    c.setForeground(new Color(250, 250, 250));
                }
            }
            return c;
        }
    }

    private class EmptyModel extends AbstractTableModel {

        public int getColumnCount() {
            return 0;
        }

        public int getRowCount() {
            return 0;
        }

        public Object getValueAt(int row, int col) {
            return null;
        }
    };


    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton jButton1;
    private javax.swing.JButton jButton2;
    private javax.swing.JButton jButton3;
    private javax.swing.JComboBox jComboBox1;
    private javax.swing.JTextField jFilter;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JList jList1;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JScrollPane jScrollPane2;
    private javax.swing.JTable jTable1;
    // End of variables declaration//GEN-END:variables

    private void saveAnno() {
        this.saveRecord(jList1.getSelectedIndex(), jTable1.getSelectedColumns());
        
        OutputStreamWriter osw = null;
        try {
            osw = new OutputStreamWriter(new FileOutputStream(this.annoFilename), "UTF-8");

            for (int i = 0; i < this.newWords.size(); i++) {
                osw.write(this.newWords.get(i) + ":");
                for (int x = 0; x < this.newPatterns.get(i).size(); x++) {
                    osw.write(newPatterns.get(i).get(x) + ";");
                }
                osw.write("\n");
            }

            System.out.println("Saved");

        } catch (Exception ex) {
            Logger.getLogger(ApplicationGUI.class
                    .getName()).log(Level.SEVERE, null, ex);
        } finally {
            try {
                osw.close();

            } catch (IOException ex) {
                Logger.getLogger(ApplicationGUI.class
                        .getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
}
