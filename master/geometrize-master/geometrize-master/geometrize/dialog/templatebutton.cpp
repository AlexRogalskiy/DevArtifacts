#include "templatebutton.h"
#include "ui_templatebutton.h"

#include <QContextMenuEvent>
#include <QEvent>
#include <QFuture>
#include <QFutureWatcher>
#include <QMenu>
#include <QPixmap>
#include <QString>
#include <QtConcurrent/QtConcurrentRun>

#include "chaiscript/chaiscript.hpp"

#include "common/formatsupport.h"
#include "common/util.h"
#include "manifest/templatemanifest.h"
#include "task/taskutil.h"

namespace geometrize
{

namespace dialog
{

class TemplateButton::TemplateButtonImpl
{
public:
    TemplateButtonImpl(TemplateButton* pQ, chaiscript::ChaiScript* const templateLoader, const QString& templateFolder) :
        ui(std::make_unique<Ui::TemplateButton>()),
        q{pQ},
        m_templateLoader{templateLoader},
        m_templateFolder{templateFolder},
        m_manifest{} // Loaded asynchronously later
    {
        ui->setupUi(q);
        populateUi();

        q->connect(q, &TemplateButton::clicked, [this]() {
            openTemplate();
        });

        q->connect(&m_templateLoaderWatcher, &QFutureWatcher<QImage>::finished, [this]() {
            const QImage thumbnail{m_templateLoaderWatcher.future().result()};

            ui->imageLabel->setPixmap(QPixmap::fromImage(thumbnail));

            setButtonToolTipText();

            emit q->signal_templateLoaded(m_templateFolder, true);
        });

        m_templateFuture = QtConcurrent::run(this, &TemplateButtonImpl::setupTemplate);
        m_templateLoaderWatcher.setFuture(m_templateFuture);
    }

    ~TemplateButtonImpl()
    {
        m_templateFuture.waitForFinished(); // Wait for template to finish loading
    }

    TemplateButtonImpl operator=(const TemplateButtonImpl&) = delete;
    TemplateButtonImpl(const TemplateButtonImpl&) = delete;

    QImage setupTemplate()
    {
        // Note assuming this is threadsafe
        m_manifest = util::getTemplateManifest(m_templateFolder.toStdString());

        // Note assuming this is threadsafe
        const QString imageFilepath{QString::fromStdString(util::getFirstFileWithExtensions(m_templateFolder.toStdString(), format::getReadableImageFileExtensions(false)))};

        const QImage thumbnail(imageFilepath);
        if(!thumbnail.isNull()) {
            const QSize size{180, 180};
            return thumbnail.scaled(size, Qt::KeepAspectRatioByExpanding, Qt::FastTransformation);
        }
        return thumbnail;
    }

    void openTemplate()
    {
        geometrize::util::openTemplate(*m_templateLoader, m_templateFolder.toStdString());
    }

    void revealTemplateInExplorer()
    {
        geometrize::util::openInDefaultApplication(m_templateFolder.toStdString());
    }

    void showContextMenu(QContextMenuEvent* e)
    {
        QMenu itemContextMenu;

        QAction openAction(tr("Open", "Text on a menu item the user presses to open a file/image"));
        itemContextMenu.addAction(&openAction);
        connect(&openAction, &QAction::triggered, [this]() {
            openTemplate();
        });

        if(!m_templateFolder.startsWith(":")) { // Only if it's not an embedded resource
            QAction openInDefaultViewer(tr("Reveal in file explorer", "Text on a menu item the user presses to open an image/piece of media in a file viewer/explorer"));
            itemContextMenu.addAction(&openInDefaultViewer);
            connect(&openInDefaultViewer, &QAction::triggered, [this]() {
                revealTemplateInExplorer();
            });
        }

        itemContextMenu.exec(e->globalPos());
    }

    TemplateManifest getTemplateManifest() const
    {
        return m_manifest;
    }

    void onLanguageChange()
    {
        ui->retranslateUi(q);
        populateUi();
    }

private:
    void populateUi()
    {
        setButtonToolTipText();
    }

    void setButtonToolTipText()
    {
        const QString name{tr("Name: %1", "Text on a label containing the name of an item, usually an image e.g. Name: The Mona Lisa").arg(QString::fromStdString(m_manifest.getName()))};
        const QString license{tr("License: %2", "Text on a label containing the legal license a piece of media is under, usually an image e.g. License: Public Domain").arg(QString::fromStdString(m_manifest.getLicense()))};
        q->setToolTip(name + "<br>" + license);
    }

    std::unique_ptr<Ui::TemplateButton> ui;
    TemplateButton* q;
    chaiscript::ChaiScript* const m_templateLoader;
    const QString m_templateFolder;
    TemplateManifest m_manifest;
    QFutureWatcher<QImage> m_templateLoaderWatcher;
    QFuture<QImage> m_templateFuture;
};

TemplateButton::TemplateButton(chaiscript::ChaiScript* const templateLoader, const QString& templateFolder) :
    QPushButton(nullptr),
    d{std::make_unique<TemplateButton::TemplateButtonImpl>(this, templateLoader, templateFolder)}
{
}

TemplateButton::~TemplateButton()
{
}

void TemplateButton::contextMenuEvent(QContextMenuEvent* e)
{
    d->showContextMenu(e);
}

TemplateManifest TemplateButton::getTemplateManifest() const
{
    return d->getTemplateManifest();
}

void TemplateButton::changeEvent(QEvent* event)
{
    if (event->type() == QEvent::LanguageChange) {
        d->onLanguageChange();
    }
    QPushButton::changeEvent(event);
}

}

}
