module LegislationsHelper
  require 'will_paginate/array'
  def fresh_legislations
    Legislation.where.not("status = ?", "Voted")
  end

  def voted_legislations
      Legislation.where("status = ?", "Voted")
  end

  def user_voice(legislation)
    LegislationVoice.find_by(user_id: current_user.id, legislation_id: legislation.id)
  end


end
