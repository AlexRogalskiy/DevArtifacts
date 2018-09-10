#pragma once

#include <cstdint>
#include <string>
#include <utility>

#include "cereal/cereal.hpp"
#include "cereal/types/utility.hpp"

namespace geometrize
{

namespace serialization
{

/**
 * @brief The GlobalPreferencesData struct represents the data for the global application preferences.
 */
class GlobalPreferencesData
{
public:
    template<class Archive>
    void archive(Archive& ar,
                 bool& shouldShowWelcomeScreenOnLaunch,

                 bool& shouldGeometrizeAppLogoOnLaunch,
                 bool& shouldPopulateRecentItemsOnLaunch,
                 bool& shouldPopulateTemplatesOnLaunch,

                 bool& shouldShowLaunchConsoleByDefault,
                 bool& shouldShowImageTaskVectorViewByDefault,
                 bool& shouldShowImageTaskConsoleByDefault,
                 bool& shouldShowImageTaskScriptEditorByDefault,
                 bool& shouldShowImageTaskPixmapViewByDefault,

                 bool& imageTaskImageResizeEnabled,
                 std::pair<std::uint32_t, std::uint32_t>& imageTaskImageResizeThreshold,
                 std::uint32_t& imageTaskMaxThreads,

                 std::string& isoLanguageCode,
                 std::string& isoScriptCode,
                 std::string& isoCountryCode)
    {
        ar(cereal::make_nvp(shouldShowWelcomeScreenOnLaunchKey, shouldShowWelcomeScreenOnLaunch));

        ar(cereal::make_nvp(shouldGeometrizeAppLogoOnLaunchKey, shouldGeometrizeAppLogoOnLaunch));
        ar(cereal::make_nvp(shouldPopulateRecentItemsOnLaunchKey, shouldPopulateRecentItemsOnLaunch));
        ar(cereal::make_nvp(shouldPopulateTemplatesOnLaunchKey, shouldPopulateTemplatesOnLaunch));

        ar(cereal::make_nvp(shouldShowLaunchConsoleByDefaultKey, shouldShowLaunchConsoleByDefault));
        ar(cereal::make_nvp(shouldShowImageTaskVectorViewByDefaultKey, shouldShowImageTaskVectorViewByDefault));
        ar(cereal::make_nvp(shouldShowImageTaskConsoleByDefaultKey, shouldShowImageTaskConsoleByDefault));
        ar(cereal::make_nvp(shouldShowImageTaskScriptEditorByDefaultKey, shouldShowImageTaskScriptEditorByDefault));
        ar(cereal::make_nvp(shouldShowImageTaskPixmapViewByDefaultKey, shouldShowImageTaskPixmapViewByDefault));

        ar(cereal::make_nvp(imageTaskImageResizeEnabledKey, imageTaskImageResizeEnabled));
        ar(cereal::make_nvp(imageTaskImageResizeThresholdKey, imageTaskImageResizeThreshold));
        ar(cereal::make_nvp(imageTaskMaxThreadsKey, imageTaskMaxThreads));

        ar(cereal::make_nvp(isoLanguageCodeKey, isoLanguageCode));
        ar(cereal::make_nvp(isoScriptCodeKey, isoScriptCode));
        ar(cereal::make_nvp(isoCountryCodeKey, isoCountryCode));
    }

private:
    const std::string shouldShowWelcomeScreenOnLaunchKey{"shouldShowWelcomeScreenOnLaunch"};

    const std::string shouldGeometrizeAppLogoOnLaunchKey{"shouldGeometrizeAppLogoOnLaunch"};
    const std::string shouldPopulateRecentItemsOnLaunchKey{"shouldPopulateRecentItemsOnLaunch"};
    const std::string shouldPopulateTemplatesOnLaunchKey{"shouldPopulateTemplatesOnLaunch"};

    const std::string shouldShowLaunchConsoleByDefaultKey{"shouldShowLaunchConsoleByDefault"};
    const std::string shouldShowImageTaskVectorViewByDefaultKey{"shouldShowImageTaskVectorViewByDefault"};
    const std::string shouldShowImageTaskConsoleByDefaultKey{"shouldShowImageTaskConsoleByDefault"};
    const std::string shouldShowImageTaskScriptEditorByDefaultKey{"shouldShowImageTaskScriptEditorByDefault"};
    const std::string shouldShowImageTaskPixmapViewByDefaultKey{"shouldShowImageTaskPixmapViewByDefault"};

    const std::string imageTaskImageResizeEnabledKey{"imageTaskImageResizeEnabled"};
    const std::string imageTaskImageResizeThresholdKey{"imageTaskImageResizeThreshold"};
    const std::string imageTaskMaxThreadsKey{"imageTaskMaxThreadsKey"};

    const std::string isoLanguageCodeKey{"isoLanguageCode"};
    const std::string isoScriptCodeKey{"isoScriptCode"};
    const std::string isoCountryCodeKey{"isoCountryCode"};
};

}

}
