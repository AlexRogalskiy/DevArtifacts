#include "imagetaskwindow.h"
#include "ui_imagetaskwindow.h"

#include <algorithm>
#include <cassert>
#include <functional>
#include <vector>

#include <QEvent>
#include <QLocale>
#include <QMessageBox>
#include <QPixmap>
#include <QRectF>
#include <QTimer>

#include "geometrize/bitmap/bitmap.h"
#include "geometrize/runner/imagerunneroptions.h"

#include "common/uiactions.h"
#include "common/util.h"
#include "dialog/imagetaskgraphicsview.h"
#include "dialog/imagetaskpixmapscene.h"
#include "dialog/imagetaskscriptingpanel.h"
#include "dialog/imagetasksvgscene.h"
#include "dialog/imagetaskimagewidget.h"
#include "dialog/scripteditorwidget.h"
#include "image/imageloader.h"
#include "localization/strings.h"
#include "preferences/globalpreferences.h"
#include "script/geometrizerengine.h"
#include "task/imagetask.h"
#include "version/versioninfo.h"

namespace
{

// Utility function for destroying an image task set on a window.
// This is a special case because we may need to defer task deletion until the task is finished working.
void destroyTask(geometrize::task::ImageTask* task)
{
    if(task == nullptr) {
        assert(0 && "Attempted to destroy an image task that was already null");
        return;
    }

    if(task->isStepping()) {
        // Wait until the task finishes stepping before disposing of it
        // Otherwise it will probably crash as the Geometrize library will be working with deleted data
        task->connect(task, &geometrize::task::ImageTask::signal_modelDidStep, [task](std::vector<geometrize::ShapeResult>) {
            task->deleteLater();
        });
    } else {
        delete task;
        task = nullptr;
    }
}

}

namespace geometrize
{

namespace dialog
{

class ImageTaskWindow::ImageTaskWindowImpl
{
public:
    ImageTaskWindowImpl(ImageTaskWindow* pQ) :
        ui{std::make_unique<Ui::ImageTaskWindow>()},
        q{pQ}
    {
        ui->setupUi(q);
        populateUi();
        q->setAttribute(Qt::WA_DeleteOnClose);

        // Create scripting panel used to manipulate the scripts for generating/mutating shapes (dies when the image task window is closed)
        setupScriptingPanel();

        // Set up the dock widgets
        q->tabifyDockWidget(ui->runnerSettingsDock, ui->exporterDock);
        ui->runnerSettingsDock->raise(); // Make sure runner settings dock is selected

        ui->consoleWidget->setVisible(false); // Make sure console widget is hidden by default

        // Set up the image task geometrization views
        m_currentImageView = new geometrize::dialog::ImageTaskGraphicsView(ui->imageViewContainer);
        m_currentImageView->setScene(&m_currentImageScene);
        m_currentImageView->setHorizontalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
        m_currentImageView->setVerticalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
        ui->imageViewContainer->layout()->addWidget(m_currentImageView);

        m_svgImageView = new geometrize::dialog::ImageTaskGraphicsView(ui->imageViewContainer);
        m_svgImageView->setScene(&m_currentSvgScene);
        m_svgImageView->setHorizontalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
        m_svgImageView->setVerticalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
        ui->imageViewContainer->layout()->addWidget(m_svgImageView);

        m_currentImageView->setVisible(false); // Make sure the image view is hidden by default (we prefer the SVG view)
        m_svgImageView->setVisible(true);

        // Handle clicks on checkable title bar items
        connect(ui->actionScript_Console, &QAction::toggled, [this](const bool checked) {
            setConsoleVisibility(checked);
        });
        connect(ui->actionPixmap_Results_View, &QAction::toggled, [this](const bool checked) {
            setPixmapViewVisibility(checked);
        });
        connect(ui->actionVector_Results_View, &QAction::toggled, [this](const bool checked) {
            setVectorViewVisibility(checked);
        });

        // Handle request to set the image task on the task window
        connect(q, &ImageTaskWindow::willSwitchImageTask, [this](task::ImageTask* lastTask, task::ImageTask*) {
            // NOTE we disconnect and destroy the last image task, which will soon be replaced by the next image task
            // This means that any task set on the window is destroyed after it is replaced
            disconnectTask();

            if(lastTask) {
                destroyTask(lastTask);
            }

            m_shapes.clear();
        });
        connect(q, &ImageTaskWindow::didSwitchImageTask, [this](task::ImageTask*, task::ImageTask* currentTask) {
            ui->imageTaskExportWidget->setImageTask(currentTask, &m_shapes);
            ui->imageTaskRunnerWidget->setImageTask(currentTask);

            if(dialog::ImageTaskScriptingPanel* scriptingPanel = getScriptingPanel()) {
                scriptingPanel->setImageTask(currentTask);
            }

            m_taskPreferencesSetConnection = connect(currentTask, &task::ImageTask::signal_preferencesSet, [this]() {
                ui->imageTaskRunnerWidget->syncUserInterface();
            });

            m_taskWillStepConnection = connect(currentTask, &task::ImageTask::signal_modelWillStep, [this]() {
                ui->statsDockContents->setCurrentStatus(geometrize::dialog::ImageTaskStatsWidget::RUNNING);
            });

            m_taskDidStepConnection = connect(currentTask, &task::ImageTask::signal_modelDidStep, [this](std::vector<geometrize::ShapeResult> shapes) {
                processPostStepCbs();

                updateCurrentGraphics(shapes);
                // If the first shape added background rectangle then fit the scenes to it
                if(m_shapes.size() == 0) {
                    fitScenesInViews();
                }
                std::copy(shapes.begin(), shapes.end(), std::back_inserter(m_shapes));

                updateStats();

                if(isRunning()) {
                    stepModel();
                }
            });

            q->setWindowTitle(geometrize::strings::Strings::getApplicationName()
                              .append(" ")
                              .append(geometrize::version::getApplicationVersionString())
                              .append(" ")
                              .append(QString::fromStdString(currentTask->getDisplayName())));

            setupOverlayImages();
            currentTask->drawBackgroundRectangle();

            ui->consoleWidget->setEngine(currentTask->getGeometrizer().getEngine());
            ui->imageTaskRunnerWidget->syncUserInterface();

            ui->imageTaskImageWidget->setTargetImage(image::createImage(currentTask->getTarget()));

            m_timeRunning = 0.0f;
        });

        // Handle requested target image overlay opacity changes
        connect(ui->imageTaskImageWidget, &ImageTaskImageWidget::targetImageOpacityChanged, [this](const unsigned int value) {
            const float opacity{value * (1.0f / 255.0f)};
            m_currentImageScene.setTargetPixmapOpacity(opacity);
            m_currentSvgScene.setTargetPixmapOpacity(opacity);
        });

        // Handle a request to change the target image
        connect(ui->imageTaskImageWidget, &ImageTaskImageWidget::targetImageSelected, [this](const QImage& image) {
            assert(!image.isNull());

            // Validate the target image size
            const geometrize::Bitmap& target{m_task->getTarget()};
            const int targetWidth{static_cast<int>(target.getWidth())};
            const int targetHeight{static_cast<int>(target.getHeight())};
            if(targetWidth != image.width() || targetHeight != image.height()) {
                const QString selectedImageSize(tr("%1x%2", "Dimensions of an image e.g. width-x-height, 1024x800").arg(QLocale().toString(image.width())).arg(QLocale().toString(image.height())));
                const QString targetImageSize(tr("%1x%2", "Dimensions of an image e.g. width-x-height, 1024x800").arg(QLocale().toString(targetWidth)).arg(QLocale().toString(targetHeight)));
                QMessageBox::warning(
                            q,
                            tr("Image has incorrect dimensions", "Title of an error dialog shown when the user selects an image that was the wrong resolution/size"),
                            tr("Selected image must have the same dimensions as the current target image. Size was %1, but should have been %2",
                               "Error message shown when the user selects an image that was the wrong resolution/size").arg(selectedImageSize).arg(targetImageSize));

                return;
            }

            setTargetImage(image);
        });

        // Handle a request to change the target image that has passed size checks and validation
        connect(ui->imageTaskImageWidget, &ImageTaskImageWidget::targetImageSet, [this](const QImage& image) {
            // If the task is running then defer the target image change to the next step, else do it immediately
            if(isRunning()) {
                const QImage imageCopy{image.copy()};
                addPostStepCb([this, imageCopy]() {
                    Bitmap target = geometrize::image::createBitmap(imageCopy);
                    switchTargetImage(target);
                });
            } else {
                Bitmap target = geometrize::image::createBitmap(image);
                switchTargetImage(target);
            }
        });

        // Handle runner button presses
        connect(ui->imageTaskRunnerWidget, &ImageTaskRunnerWidget::runStopButtonClicked, [this]() {
            setRunning(!isRunning());

            // Toggle running button text and request another image task step if running started
            updateStartStopButtonText();
            if(isRunning()) {
                stepModel();
            }
        });
        connect(ui->imageTaskRunnerWidget, &ImageTaskRunnerWidget::stepButtonClicked, [this]() {
            stepModel();
        });
        connect(ui->imageTaskRunnerWidget, &ImageTaskRunnerWidget::clearButtonClicked, [this]() {
            clearModel();
        });

        connect(q, &ImageTaskWindow::didLoadSettingsTemplate, [this]() {
            ui->imageTaskRunnerWidget->syncUserInterface();

            if(dialog::ImageTaskScriptingPanel* scriptingPanel = getScriptingPanel()) {
                 scriptingPanel->syncUserInterface();
            }
        });

        // Track how long the task has been in the running state
        connect(&m_timeRunningTimer, &QTimer::timeout, [this]() {
            if(isRunning()) {
                m_timeRunning += m_timeRunningResolutionMs;
                updateStats();
            }
        });

        // Start the timer used to track how long the image task has been in the running state
        m_timeRunningTimer.start(m_timeRunningResolutionMs);

        // Set initial target image opacity
        const float initialTargetImageOpacity{10};
        ui->imageTaskImageWidget->setTargetImageOpacity(initialTargetImageOpacity);

        // Set initial view visibility
        const geometrize::preferences::GlobalPreferences& prefs{geometrize::preferences::getGlobalPreferences()};
        setConsoleVisibility(prefs.shouldShowImageTaskConsoleByDefault());
        setPixmapViewVisibility(prefs.shouldShowImageTaskPixmapViewByDefault());
        setVectorViewVisibility(prefs.shouldShowImageTaskVectorViewByDefault());
        if(prefs.shouldShowImageTaskScriptEditorByDefault()) {
            revealScriptingPanel();
        }
    }
    ImageTaskWindowImpl operator=(const ImageTaskWindowImpl&) = delete;
    ImageTaskWindowImpl(const ImageTaskWindowImpl&) = delete;
    ~ImageTaskWindowImpl()
    {
        disconnectTask();
        destroyTask(m_task);
    }

    void close()
    {
        q->close();
    }

    void setImageTask(task::ImageTask* task)
    {
        task::ImageTask* lastTask{m_task};
        task::ImageTask* nextTask{task};
        q->willSwitchImageTask(lastTask, nextTask);
        m_task = nextTask;
        q->didSwitchImageTask(lastTask, nextTask);
    }

    void revealLaunchWindow()
    {
        if(common::ui::isLaunchWindowOpen()) {
            common::ui::bringLaunchWindowToFront();
        } else {
            common::ui::openLaunchWindow();
        }
    }

    void setConsoleVisibility(const bool visible)
    {
        if(ui->actionScript_Console->isChecked() != visible) {
            ui->actionScript_Console->setChecked(visible);
        }
        ui->consoleWidget->setVisible(visible);
    }

    void setPixmapViewVisibility(const bool visible)
    {
        if(ui->actionPixmap_Results_View->isChecked() != visible) {
            ui->actionPixmap_Results_View->setChecked(visible);
        }

        m_currentImageView->setVisible(visible);
        if(visible) {
            fitImageSceneInView();
        }
    }

    void setVectorViewVisibility(const bool visible)
    {
        if(ui->actionVector_Results_View->isChecked() != visible) {
            ui->actionVector_Results_View->setChecked(visible);
        }

        m_svgImageView->setVisible(visible);
        if(visible) {
            fitVectorSceneInView();
        }
    }

    void loadSettingsTemplate()
    {
        const QString path{common::ui::openLoadImageTaskSettingsDialog(q)};
        loadSettingsTemplate(path.toStdString());
    }

    void loadSettingsTemplate(const std::string& path)
    {
        if(path.empty()) {
            return;
        }
        m_task->getPreferences().load(path);
        emit q->didLoadSettingsTemplate();
    }

    void saveSettingsTemplate() const
    {
        const QString path{common::ui::openSaveImageTaskSettingsDialog(q)};
        if(path.isEmpty()) {
            return;
        }
        m_task->getPreferences().save(path.toStdString());

        emit q->didSaveSettingsTemplate();
    }

    void onLanguageChange()
    {
        ui->retranslateUi(q);
        populateUi();
    }

    // Utility function used to setup and display the script editor for the given image task window
    void revealScriptingPanel()
    {
        if(dialog::ImageTaskScriptingPanel* scriptingPanel = getScriptingPanel()) {
            scriptingPanel->setWindowState(scriptingPanel->windowState() & ~Qt::WindowMinimized);
            QApplication::setActiveWindow(scriptingPanel);
            scriptingPanel->raise();
            scriptingPanel->show();
        }
    }

private:
    void populateUi()
    {
        updateStartStopButtonText();
        q->setWindowTitle(geometrize::strings::Strings::getApplicationName());
    }

    void setupScriptingPanel()
    {
        new geometrize::dialog::ImageTaskScriptingPanel(q);
    }

    geometrize::dialog::ImageTaskScriptingPanel* getScriptingPanel()
    {
        return q->findChild<geometrize::dialog::ImageTaskScriptingPanel*>();
    }

    void updateStartStopButtonText()
    {
        if(!isRunning()) {
            ui->imageTaskRunnerWidget->setRunStopButtonText(tr("Start", "Text on a button that the user presses to make the app start/begin transforming an image into shapes"));
        } else {
            ui->imageTaskRunnerWidget->setRunStopButtonText(tr("Stop", "Text on a button that the user presses to make the app stop/pause transforming an image into shapes"));
        }
    }

    void updateCurrentGraphics(const std::vector<geometrize::ShapeResult>& shapes)
    {
        const QPixmap pixmap{image::createPixmap(m_task->getCurrent())};
        m_currentImageScene.setWorkingPixmap(pixmap);
        m_currentSvgScene.drawSvg(shapes, pixmap.size().width(), pixmap.size().height());
    }

    bool isRunning() const
    {
        return m_running; // TODO this is buggy, need to synch up whether the task is running or not in a better way
    }

    void setRunning(const bool running)
    {
        m_running = running;
    }

    void stepModel()
    {
        m_task->stepModel();
    }

    void clearModel()
    {
        auto task = new geometrize::task::ImageTask(m_task->getDisplayName(), m_task->getTarget());
        task->setPreferences(m_task->getPreferences());
        setImageTask(task);
    }

    void switchTargetImage(Bitmap& bitmap)
    {
        Bitmap& targetBitmap{m_task->getTarget()};
        targetBitmap = bitmap;
    }

    void switchCurrentImage(Bitmap& bitmap)
    {
        Bitmap& currentBitmap{m_task->getCurrent()};
        currentBitmap = bitmap;
    }

    void updateStats()
    {
        ui->statsDockContents->setTaskId(m_task->getTaskId());
        ui->statsDockContents->setImageDimensions(m_task->getWidth(), m_task->getHeight());

        if(!isRunning()) {
            ui->statsDockContents->setCurrentStatus(geometrize::dialog::ImageTaskStatsWidget::STOPPED);
        }

        ui->statsDockContents->setShapeCount(m_shapes.size());

        if(!m_shapes.empty()) {
            ui->statsDockContents->setSimilarity(m_shapes.back().score * 100.0f);
        }

        ui->statsDockContents->setTimeRunning(static_cast<int>(m_timeRunning / 1000.0f));
    }

    void disconnectTask()
    {
        if(m_taskPreferencesSetConnection) {
            disconnect(m_taskPreferencesSetConnection);
        }
        if(m_taskWillStepConnection) {
            disconnect(m_taskWillStepConnection);
        }
        if(m_taskDidStepConnection) {
            disconnect(m_taskDidStepConnection);
        }
    }

    void setupOverlayImages()
    {
        const QPixmap target{image::createPixmap(m_task->getTarget())};
        m_currentImageScene.setTargetPixmap(target);
        m_currentSvgScene.setTargetPixmap(target);
    }

    void fitImageSceneInView()
    {
        const float margin{m_defaultViewMargins};
        const QRectF imageViewRect{m_currentImageScene.itemsBoundingRect().adjusted(-margin, -margin, margin, margin)};
        m_currentImageView->fitInView(imageViewRect, Qt::KeepAspectRatio);
    }

    void fitVectorSceneInView()
    {
        const float margin{m_defaultViewMargins};
        const QRectF svgRect{m_currentSvgScene.itemsBoundingRect().adjusted(-margin, -margin, margin, margin)};
        m_svgImageView->fitInView(svgRect, Qt::KeepAspectRatio);
    }

    void fitScenesInViews()
    {
        fitImageSceneInView();
        fitVectorSceneInView();
    }

    void setTargetImage(const QImage& image)
    {
        ui->imageTaskImageWidget->setTargetImage(image);
    }

    void addPostStepCb(const std::function<void()>& f)
    {
        m_onPostStepCbs.push_back(f);
    }

    void clearPostStepCbs()
    {
        m_onPostStepCbs.clear();
    }

    void processPostStepCbs()
    {
        for(const auto& f : m_onPostStepCbs) {
            f();
        }
        clearPostStepCbs();
    }

    std::unique_ptr<Ui::ImageTaskWindow> ui{nullptr};

    ImageTaskWindow* q{nullptr};

    task::ImageTask* m_task{nullptr}; ///> The image task currently set and manipulated via this window
    QMetaObject::Connection m_taskPreferencesSetConnection{}; ///> Connection for telling the dialog when the image task preferences are set
    QMetaObject::Connection m_taskWillStepConnection{}; ///> Connection for the window to do work just prior the image task starts a step
    QMetaObject::Connection m_taskDidStepConnection{}; ///> Connection for the window to do work just after the image task finishes a step
    std::vector<std::function<void()>> m_onPostStepCbs; ///> One-shot callbacks triggered when the image task finishes a step

    std::vector<geometrize::ShapeResult> m_shapes; ///> The shapes and score results created by the image task

    ImageTaskPixmapScene m_currentImageScene; ///> The scene containing the raster/pixel-based representation of the shapes
    ImageTaskSvgScene m_currentSvgScene; ///> The scene containing the vector-based representation of the shapes
    const float m_defaultViewMargins{20.0f}; ///> Margins around the graphics shown in the views
    geometrize::dialog::ImageTaskGraphicsView* m_currentImageView{nullptr}; ///> The view that holds the raster/pixel-based scene
    geometrize::dialog::ImageTaskGraphicsView* m_svgImageView{nullptr}; ///> The view that holds the vector-based scene

    bool m_running{false}; ///> Whether the model is running (automatically)
    QTimer m_timeRunningTimer; ///> Timer used to keep track of how long the image task has been in the "running" state
    float m_timeRunning{0.0f}; ///> Total time that the image task has been in the "running" state
    const float m_timeRunningResolutionMs{100.0f}; ///> Resolution of the time running timer
};

ImageTaskWindow::ImageTaskWindow() :
    QMainWindow{nullptr},
    d{std::make_unique<ImageTaskWindow::ImageTaskWindowImpl>(this)}
{
}

ImageTaskWindow::~ImageTaskWindow()
{
}

void ImageTaskWindow::setImageTask(task::ImageTask* task)
{
    d->setImageTask(task);
}

void ImageTaskWindow::on_actionExit_triggered()
{
    d->close();
}

void ImageTaskWindow::on_actionLoad_Settings_Template_triggered()
{
    d->loadSettingsTemplate();
}

void ImageTaskWindow::on_actionSave_Settings_Template_triggered()
{
    d->saveSettingsTemplate();
}

void ImageTaskWindow::on_actionReveal_Launch_Window_triggered()
{
    d->revealLaunchWindow();
}

void ImageTaskWindow::on_actionReveal_Script_Editor_triggered()
{
    d->revealScriptingPanel();
}

void ImageTaskWindow::changeEvent(QEvent* event)
{
    if (event->type() == QEvent::LanguageChange) {
        d->onLanguageChange();
    }
    QMainWindow::changeEvent(event);
}

}

}
