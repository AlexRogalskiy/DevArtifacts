#include "scriptutil.h"

#include <chrono>
#include <map>
#include <string>
#include <thread>

#include <QDirIterator>

#include "chaiscript/chaiscript.hpp"
#include "chaiscript/language/chaiscript_engine.hpp"

#include "common/util.h"

namespace geometrize
{

namespace script
{

void sleep(const std::size_t ms)
{
    std::this_thread::sleep_for(std::chrono::milliseconds(ms));
}

std::vector<std::string> getEngineFunctionNames(const chaiscript::ChaiScript& engine)
{
    std::vector<std::string> functions;
    const auto funcs{engine.get_state().engine_state.m_functions};
    for(auto it = funcs.begin(); it != funcs.end(); ++it) {
        functions.push_back(it->first);
    }
    return functions;
}

std::map<std::string, std::string> getDefaultScripts()
{
    const QString scriptResourceFolder{":/scripts/scripts/default_shape_mutators/"}; // Path to the default shape scripts folder in resources.

    std::map<std::string, std::string> m;

    QDirIterator it(scriptResourceFolder);
    while(it.hasNext()) {
        it.next();
        const std::string fileName{it.fileName().toStdString()};
        const std::string functionName{fileName.substr(0, fileName.size() - 5)}; // Remove ".chai"
        m[functionName] = geometrize::util::readFileAsString(it.filePath().toStdString());
    }

    return m;
}

}

}
