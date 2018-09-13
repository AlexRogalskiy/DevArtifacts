package com.allmycode.dummiesframe;

import java.awt.Color;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Base64;

import javax.swing.BorderFactory;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.SwingUtilities;
import javax.swing.UIManager;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;

public class DummiesFrame extends JFrame
    implements ActionListener {

  private static final long serialVersionUID = 1L;

  private final int MAX_ROWS = 10;
  private JLabel result = new JLabel("            ");
  private JTextField[] textField = new JTextField[MAX_ROWS];
  private int numTextFields = 0;
  private JLabel[] iconLabels = new JLabel[MAX_ROWS];
  private JButton button = new JButton("Submit");
  private GridBagConstraints constraints = new GridBagConstraints();
  private int numRows = 0;
  private JPanel newPanel = new JPanel(
      new GridBagLayout());
  private String whoCalledMe;
  private final String ERROR_WRONG_INPUT = "ERROR: Wrong type of input (or missing input) in one or more fields";
  private final String TOO_MANY_ROWS = "ERROR: Maximum of "
      + MAX_ROWS + " rows";
  private final String ERROR_CALCULATE_PARAMETERS = "ERROR: Number of parameters to calculate method must equal number of rows";
  private final String ADD_AFTER_GO = "ERROR: Cannot call addRow after calling the go method";
  private final String NOT_ENOUGH_ROWS = "ERROR: You haven't added enough rows before calling the go method";
  private final String TOO_MANY_PARAMETERS = "ERROR: Too many parameters in the calculate method";
  private final String TOO_FEW_PARAMETERS = "ERROR: Too few parameters in the calculate method";
  private final String NO_CALCULATE_METHOD = "ERROR: Cannot find a calculate method. (Is the method name spelled and capitalized correctly?)";
  private final String ERROR_DURING_CALCULATE = "ERROR: Something went wrong during execution of your calculae method";
  
  private final String checkString = "iVBORw0KGgoAAAANSUhEUgAAABYAAAAXCAIAAACAiijJAAAABnRSTlMAAAAAAABupgeRAAAACXBIWXMAAAsTAAALEwEAmpwYAAACFUlEQVR4nNWTz2sTURDH5+W9za9dE9LQmMZt101pqSgoFj3loIIkFcR/w5MHQRDESi2t4MGD4E0QvHnyIghePARjsUotFRRqfpnU0EZrNiHZTbvvPQ+BTTZNY+NFnNt8Zz7DvJl5AP+rSUG/Xw1bLh6UFwO+wGKcXValT9XGj+rAJbx+KbgQL0ZMnVBvTPWuVhrbtQFKeA6Jw/PxwihtuQ1CxVjUs/KLHJB3i57QXDyvsE6xyg2MTHQQ3uVxj9ydyU3wTtGpczSbaq6XHX/knW5X5E6iixeagOaWmutlAGiXQKhHR4JTkGcT2Sm7uAN4fqn5ZbPlYouXb1wkoktPl61UIhDl9qXMCVunwi7CC++MtZKl4FaByPULGzGJngn5tpiR/QkAmJCjt2bSp2wrIyYi95aNjxudIgaAI9fOfz/nAwAKnJ8N+0rmblFTbybS07Z9EYqE+x+M94WuxyIlcfrbVYVDe1ouhke+svwkdIqEIuHBiv4mt3deuJbdVMbVSqTdMEW8ErQnMeR8uKons3t5AMCc81oqMzYZ1cK9LxUz5Hq0pr9O94xCaxac8XoqJ09FtcPdZ4I5CjzNaC8/78eDtVRGWT2VGzomN0KCFXNwJD/fKj1b7sND509llO6kCoHjo/owAQCMHGMvtvNPkv156PrszKTm20L45Hh9yKG80oqPk4zz/ch+5pa88pXpvyH/pf0G4R67wK5sFPIAAAAASUVORK5CYII=";
  private final String xString = "iVBORw0KGgoAAAANSUhEUgAAABYAAAAXCAIAAACAiijJAAAABnRSTlMAAAAAAABupgeRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB80lEQVR4nM2STWvUUBSGzzk3ydyYSQPTtENpk0IzH2aSkkzLlOKu/8CuSsG6EtSNgiLoRsGNolZwZQU/Ft251I2IrgQX+je66LoVhiZOrovRNnMnqUs93NU97/Nyz3sPwH9X5+p1VVFOEUQTE6fxW66bGsZuo6EwVii4b9sp5xfq9WJ+w3FSwxAAAvGV5zGifJcx9sB1MyIBkHK+MT0t8+tzc0dDfniInnse5Vye+L5QlGNBwvn61NSIxaZp/mTsxAJAED3zPEIkou04HhCNdBXl0fKy/JCrtj2QXBh7sdTdWVsTqirdb4chIhbEccd1sjEXmSd62esV88O6N+8KySV/EHcWQ6RyHgCI6HGzKaTJ//Cvw5BGf6q0Pp5tj1t86/isZF/kuhIEfWl+AAGQadot3/87f31lZWCaZVkMOL+7ulqaJSJeiuPUskqzHL7FMG4udYstNjt+NjkpAR/arTczMwIxf5nq+o1eT+a3ut2kVpP4z61WVdcrmvbWdSWXzLIuR9ExTgAwnybqwUHe9EuzcX5v70e/f5QkF/f33znOyNSHh4uqOhoEwMOgkym/l+prw7MMIy84U6m8n509WdAo0jStIM6nYSCIvi8s1KrV8bAMzj+5rkDcjePSBUPEa+2WbZrFbQBT128HAee8TPBP6xd29sy+9FzSfAAAAABJRU5ErkJggg==";
  
  private boolean goHasBeenCalled = false;

  private Method[] methods = null;
  private Class<?>[] types = null;
  private Method method = null;
  private ImageIcon checkIcon; // = new ImageIcon("checkT20.png");
  private ImageIcon xIcon; // = new ImageIcon("xT20.png");
  private boolean[] hasValidContent = new boolean[MAX_ROWS];

  public DummiesFrame(String title) {
    super(title);
    setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    constraints.anchor = GridBagConstraints.WEST;
    constraints.insets = new Insets(10, 10, 10, 10);
    // button.setEnabled(false);
    button.addActionListener(this);
    
    Base64.Decoder decoder = Base64.getDecoder();
    checkIcon = new ImageIcon(decoder.decode(checkString));
    xIcon = new ImageIcon(decoder.decode(xString));

    StackTraceElement[] stackTraceElements = Thread
        .currentThread().getStackTrace();

    whoCalledMe = stackTraceElements[2].getClassName();

    for (int i = 0; i < MAX_ROWS; i++) {
      hasValidContent[i] = false;
    }
  }

  public void addRow(String labelText) {
    // BARRY - What if there's no calculate method or the method name is spelled
    // incorrectly?
    if (!goHasBeenCalled) {
      constraints.gridx = 0;
      constraints.gridy = numRows;
      newPanel.add(new JLabel(labelText), constraints);
      constraints.gridx = 1;
      if (numRows < MAX_ROWS) {
        textField[numRows] = new JTextField(20);
        numTextFields++;
        textField[numRows].setBorder(
            BorderFactory.createLineBorder(Color.RED));
        newPanel.add(textField[numRows], constraints);
        constraints.gridx = 2;
        iconLabels[numRows] = new JLabel(xIcon);
        newPanel.add(iconLabels[numRows], constraints);
        numRows++;
      } else {
        displayError(TOO_MANY_ROWS);
        return;
      }
    } else {
      button.setEnabled(false);
      JOptionPane.showMessageDialog(null, ADD_AFTER_GO);
      System.exit(-1);
    }
  }

  public void setButtonText(String text) {
    button.setText(text);
  }

  public void go() {
    goHasBeenCalled = true;
    constraints.gridx = 0;
    constraints.gridy = numRows++;
    constraints.gridwidth = 2;
    constraints.anchor = GridBagConstraints.CENTER;
    newPanel.add(button, constraints);

    constraints.gridy = numRows++;
    newPanel.add(result, constraints);

    add(newPanel);

    pack();
    setLocationRelativeTo(null);

    method = null;
    try {

      methods = Class.forName(whoCalledMe).getMethods();
      for (Method m : methods) {
        if (m.getName().equals("calculate")) {
          method = m;
          break;
        }
      }

    } catch (ClassNotFoundException
        | SecurityException e) {
      e.printStackTrace();
    }

    if (method != null) {
      types = method.getParameterTypes();
    } else {
      JOptionPane.showMessageDialog(null, NO_CALCULATE_METHOD, "ERROR", JOptionPane.ERROR_MESSAGE);
    }

    for (int whichRow = 0; whichRow < types.length; whichRow++) {
      if (textField[whichRow] != null) {
        textField[whichRow].getDocument()
            .addDocumentListener(
                new MyDocumentListener(whichRow));
      } else {
        displayFatalError(NOT_ENOUGH_ROWS + " "
            + ERROR_CALCULATE_PARAMETERS);
        //return;
      }
      // .addDocumentListener(new DocumentListener() {
      // @Override
      // public void removeUpdate(DocumentEvent e) {
      // validateInput(whichRow);
      // }
      //
      // @Override
      // public void insertUpdate(DocumentEvent e) {
      // validateInput(whichRow);
      // }
      //
      // @Override
      // public void changedUpdate(DocumentEvent e) {
      // } // Not needed for plain-text fields
      // });
    }

    if (types.length < numTextFields) {

    }
    if (types.length > numTextFields) {
      displayFatalError(TOO_MANY_PARAMETERS + " " + ERROR_CALCULATE_PARAMETERS);
      //JOptionPane.showMessageDialog(null, TOO_MANY_PARAMETERS + " " + ERROR_CALCULATE_PARAMETERS);
      //return;
    }
    if (types.length < numTextFields) {
      displayFatalError(TOO_FEW_PARAMETERS + " " + ERROR_CALCULATE_PARAMETERS);
      //JOptionPane.showMessageDialog(null, TOO_FEW_PARAMETERS + " " + ERROR_CALCULATE_PARAMETERS);
      //return;
    }

    button.setEnabled(types.length == 0);

    try {
      UIManager.setLookAndFeel(
          UIManager.getSystemLookAndFeelClassName());
    } catch (Exception ex) {
      ex.printStackTrace();
    }

    SwingUtilities.invokeLater(new Runnable() {
      @Override
      public void run() {
        setVisible(true);
      }
    });
  }

  class MyDocumentListener implements DocumentListener {
    int whichRow;

    MyDocumentListener(int whichRow) {
      this.whichRow = whichRow;
    }

    @Override
    public void removeUpdate(DocumentEvent e) {
      validateInput(whichRow);
    }

    @Override
    public void insertUpdate(DocumentEvent e) {
      validateInput(whichRow);
    }

    @Override
    public void changedUpdate(DocumentEvent e) {
    } // Not needed for plain-text fields
  }

  void displayError(String message) {
    button.setEnabled(false);
    result.setForeground(Color.RED);
    result.setText(message);
    pack();
  }
  
  void displayFatalError(String message) {
    for (int i = 0; i < numTextFields; i++) {
      textField[i].setEnabled(false);
    }
    displayError(message);
  }

  void validateInput(int whichRow) {
    String text = textField[whichRow].getText();

    try {
      if (types[whichRow] == int.class
          || types[whichRow] == Integer.class) {
        int x = Integer.valueOf(text);
      }
      if (types[whichRow] == double.class
          || types[whichRow] == Double.class) {
        double x = Double.valueOf(text);
      }
      if (types[whichRow] == char.class
          || types[whichRow] == Character.class) {
        if (text.length() != 1) {
          throw new Exception();
        }
      }
      if (types[whichRow] == boolean.class
          || types[whichRow] == Boolean.class) {
        if (!text.equals("true")
            && !text.equals("false")) {
          throw new Exception();
        }
      }
      if (types[whichRow] == short.class
          || types[whichRow] == Short.class) {
        short x = Short.valueOf(text);
      }
      if (types[whichRow] == long.class
          || types[whichRow] == Long.class) {
        long x = Long.valueOf(text);
      }
      if (types[whichRow] == byte.class
          || types[whichRow] == Byte.class) {
        byte x = Byte.valueOf(text);
      }
      if (types[whichRow] == float.class
          || types[whichRow] == Float.class) {
        float x = Float.valueOf(text);
      }

      textField[whichRow].setBorder(
          BorderFactory.createLineBorder(Color.WHITE));
      iconLabels[whichRow].setIcon(checkIcon);
      hasValidContent[whichRow] = true;
      fixSubmitButton();
    } catch (Exception e) {
      textField[whichRow].setBorder(
          BorderFactory.createLineBorder(Color.RED));
      iconLabels[whichRow].setIcon(xIcon);
      hasValidContent[whichRow] = false;
      button.setEnabled(false);
    }

    // Pattern r = Pattern.compile("[0-9]+");
    // Matcher m = r.matcher(text);
    // if (m.matches()) {
    // textField[whichRow].setBorder(
    // BorderFactory.createLineBorder(Color.WHITE));
    // iconLabels[whichRow].setIcon(checkIcon);
    // } else {
    // textField[whichRow].setBorder(
    // BorderFactory.createLineBorder(Color.RED));
    // iconLabels[whichRow].setIcon(xIcon);
    // }
  }

  void fixSubmitButton() {
    button.setEnabled(
        countValidTextFields() == types.length);
  }

  int countValidTextFields() {
    int count = 0;
    for (int i = 0; i < types.length; i++) {
      if (hasValidContent[i]) {
        count++;
      }
    }
    return count;
  }

  @Override
  public void actionPerformed(ActionEvent arg0) {
    Object resultObject = null;
    result.setForeground(Color.BLACK);

    // try {
    //
    // Method[] methods = Class.forName(whoCalledMe)
    // .getMethods();
    // for (Method m : methods) {
    // if (m.getName().equals("calculate")) {
    // method = m;
    // break;
    // }
    // }
    //
    // } catch (ClassNotFoundException
    // | SecurityException e) {
    // e.printStackTrace();
    // }
    //
    // Class<?>[] types = method.getParameterTypes();
    Object[] parameterObjects = new Object[types.length];
    for (int i = 0; i < types.length; i++) {

      if (types[i] == int.class) {
        types[i] = Integer.class;
      }
      if (types[i] == double.class) {
        types[i] = Double.class;
      }
      if (types[i] == char.class) {
        types[i] = Character.class;
      }
      if (types[i] == boolean.class) {
        types[i] = Boolean.class;
      }
      if (types[i] == short.class) {
        types[i] = Short.class;
      }
      if (types[i] == long.class) {
        types[i] = Long.class;
      }
      if (types[i] == byte.class) {
        types[i] = Byte.class;
      }
      if (types[i] == float.class) {
        types[i] = Float.class;
      }

      if (types[i] == String.class) {
        try {
          parameterObjects[i] = textField[i].getText();
        } catch (NullPointerException e) {
          displayError(ERROR_CALCULATE_PARAMETERS);
          return;
        }
      } else {
        Method valueOfMethod = null;
        try {
          if (types[i] != Character.class) {
            valueOfMethod = types[i].getMethod("valueOf",
                new Class<?>[] { String.class });
          }
        } catch (NoSuchMethodException
            | SecurityException e) {
          e.printStackTrace();
        }
        try {
          if (types[i] != Character.class) {
            parameterObjects[i] = valueOfMethod
                .invoke(null, textField[i].getText());
          } else {
            parameterObjects[i] = textField[i].getText()
                .charAt(0);
          }
        } catch (IllegalAccessException
            | IllegalArgumentException
            | InvocationTargetException e) {
          // e.printStackTrace();
          // BARRY- Might be able to use Throwable.getStackTrace and
          // setStackTrace to control what the
          // user sees.
          displayError(ERROR_WRONG_INPUT);
        }
      }
    }

    try {
      resultObject = method.invoke(null,
          parameterObjects);
    } catch (IllegalAccessException
        | IllegalArgumentException
        | InvocationTargetException e) {
      // e.printStackTrace();
      displayError(ERROR_DURING_CALCULATE);
    }
    result.setText(resultObject.toString());
    pack();
  }

}
