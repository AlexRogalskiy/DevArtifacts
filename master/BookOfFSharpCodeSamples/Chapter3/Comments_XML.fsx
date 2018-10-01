open System

/// <summary>
/// Given a radius, calculate the diameter, area, and circumference
/// of a circle
/// </summary>
/// <param name="radius">The circle's radius</param>
/// <returns>
/// A triple containing the diameter, area, and circumference
/// </returns>
let measureCircle radius =
  let diameter = radius * 2.0
  let area = Math.PI * (radius ** 2.0)
  let circumference = 2.0 * Math.PI * radius
  (diameter, area, circumference)
