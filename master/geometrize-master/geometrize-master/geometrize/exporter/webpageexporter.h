#pragma once

#include <string>
#include <vector>

namespace geometrize
{
struct ShapeResult;
}

namespace geometrize
{

namespace exporter
{

/**
 * @brief exportCanvasWebpage Exports shape data to a HTML5 canvas-based webpage.
 * @param data The shape data to export.
 * @return A string containing the content of the canvas-based webpage.
 */
std::string exportCanvasWebpage(const std::vector<geometrize::ShapeResult>& data);

/**
 * @brief exportWebGLWebpage Exports shape data to a WebGL-based webpage.
 * @param data The shape data to export.
 * @return A string containing the content of the WebGL-based webpage.
 */
std::string exportWebGLWebpage(const std::vector<geometrize::ShapeResult>& data);

}

}
