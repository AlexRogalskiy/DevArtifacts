#include "searchpaths.h"

#include <QCoreApplication>

namespace geometrize
{

namespace searchpaths
{

std::string getApplicationDirectoryPath()
{
    return QCoreApplication::applicationDirPath().toStdString();
}

std::vector<std::string> getScriptSearchPaths()
{
    return { "/../../scripts", "/scripts" };
}

std::vector<std::string> getTemplateSearchPaths()
{
    return { ":/templates/templates", "/../../templates", "/templates" };
}

std::string getTaskSettingsFilename()
{
    return "settings.json";
}

}

}
