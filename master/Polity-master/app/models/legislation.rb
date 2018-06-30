class Legislation < ActiveRecord::Base
  has_many :legislation_voices
  has_many :legislation_votes
  # attr_accssible :title

  def voices_by_ward(ward_id)
    ward = Ward.find(ward_id)
    potential_supporters = ward.citizens.pluck(:id)
    LegislationVoice.where(user_id: potential_supporters, legislation_id: self.id)
  end

  def ward_legislation_voices(ward_id)
    voices_by_ward(ward_id).length
  end

  #TODOS: could use merge?
  def ward_legislation_support(ward_id)
    support = voices_by_ward(ward_id).each_with_object([]) do |voice, supporters|
      supporters << voice if voice.support == true
    end
    support.length
  end

  def overall_legislation_voices(user)
    total = LegislationVoice.where(legislation_id: self.id).count
    support = LegislationVoice.where(legislation_id: self.id, support: true).count
    oppose = LegislationVoice.where(legislation_id: self.id, support: false).count

    user_voice = LegislationVoice.where(legislation_id: self.id, user_id: user.id).pluck(:support)

    unless user_voice.empty?
      if user_voice.last == true
        return "#{((support/total.to_f)*100).round(2)}%"
      else
        return "#{((oppose/total.to_f)*100).round(2)}%"
      end
    end
  end

  def self.search(search)
      if search
        where('title LIKE ?', "%#{search}%")
      else
        Legislation.none
      end
  end
end
