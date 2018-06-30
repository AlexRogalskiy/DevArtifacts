module ApplicationHelper
  def col_span
    [*1..2].sample
  end

  def header_color
    ["primary", "secondary", "tertiary", "quaternary", "last"].sample
  end

end