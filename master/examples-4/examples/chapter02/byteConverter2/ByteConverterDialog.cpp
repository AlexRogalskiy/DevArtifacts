#include "ByteConverterDialog.h"
#include "ByteConverter.h"
#include <QLabel>
#include <QLineEdit>
#include <QPushButton>
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QGridLayout>
#include <QIntValidator>
#include <QRegExpValidator>

ByteConverterDialog::ByteConverterDialog()
{
    // Create the layouts needed.
    QVBoxLayout* mainLayout = new QVBoxLayout(this);
    QGridLayout* editLayout = new QGridLayout;
    QHBoxLayout* buttonLayout = new QHBoxLayout;

    mainLayout->addLayout(editLayout);
    mainLayout->addStretch();
    mainLayout->addLayout(buttonLayout);

    // Create labels and line edits and add them to
    // editLayout
    QLabel* decLabel = new QLabel(tr("Decimal"));
    QLabel* hexLabel = new QLabel(tr("Hex"));
    QLabel* binLabel = new QLabel(tr("Binary"));
    QLineEdit* decEdit = new QLineEdit;
    QLineEdit* hexEdit = new QLineEdit;
    QLineEdit* binEdit = new QLineEdit;

    editLayout->addWidget(decLabel, 0, 0);
    editLayout->addWidget(decEdit, 0, 1);
    editLayout->addWidget(hexLabel, 1, 0);
    editLayout->addWidget(hexEdit, 1, 1);
    editLayout->addWidget(binLabel, 2, 0);
    editLayout->addWidget(binEdit, 2, 1);

    // Create "Quit" button and add it to buttonLayout
    QPushButton* exitButton = new QPushButton(tr("Quit"));

    buttonLayout->addStretch();
    buttonLayout->addWidget(exitButton);

    // Set window title and default button
    setWindowTitle(tr("Byte Converter"));
    exitButton->setDefault(true);

    // Limit input to valid values
    QIntValidator* decValidator =
        new QIntValidator(0, 255, decEdit);
    decEdit->setValidator(decValidator);

    QRegExpValidator* hexValidator =
        new QRegExpValidator(QRegExp("[0-9A-Fa-f]{1,2}"), hexEdit);
    hexEdit->setValidator(hexValidator);

    QRegExpValidator* binValidator =
        new QRegExpValidator(QRegExp("[01]{1,8}"), binEdit);
    binEdit->setValidator(binValidator);

    // Signal/slot connections
    connect(exitButton, SIGNAL(clicked()),
            this, SLOT(accept()));

    ByteConverter* bc = new ByteConverter(this);

    connect(decEdit, SIGNAL(textChanged(const QString&)),
            bc, SLOT(setDec(const QString&)));
    connect(hexEdit, SIGNAL(textChanged(const QString&)),
            bc, SLOT(setHex(const QString&)));
    connect(binEdit, SIGNAL(textChanged(const QString&)),
            bc, SLOT(setBin(const QString&)));

    connect(bc, SIGNAL(decChanged(const QString&)),
            decEdit, SLOT(setText(const QString&)));
    connect(bc, SIGNAL(hexChanged(const QString&)),
            hexEdit, SLOT(setText(const QString&)));
    connect(bc, SIGNAL(binChanged(const QString&)),
            binEdit, SLOT(setText(const QString&)));
}
