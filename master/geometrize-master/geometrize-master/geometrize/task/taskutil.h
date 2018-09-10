#pragma once

#include <string>

#include "manifest/templatemanifest.h"

class QImage;
class QString;
class QStringList;

namespace chaiscript
{
class ChaiScript;
}

namespace geometrize
{

namespace util
{

void openTask(const QString& urlStr, bool addToRecents);

void openTasks(const QStringList& urls, bool addToRecents);

bool openTemplate(chaiscript::ChaiScript& engine, const std::string& templateFolder);

TemplateManifest getTemplateManifest(const std::string& templateFolder);

}

}
