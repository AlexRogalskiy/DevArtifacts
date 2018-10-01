class Photo < ActiveRecord::Base

=begin explain
Closely follows Object-Relational Model, each instance is 
also a record in the table called 'photos'.
=end
  def next_id()
    return Photo.minimum(:id) if last_id?
    next_id = @attributes['id'].to_i.succ
    next_id.succ! until Photo.find(next_id)
    next_id.to_s
  end

  def prev_id()
    return Photo.maximum(:id) if first_id?
    prev_id = (@attributes['id'].to_i - 1)
    prev_id = (prev_id - 1) until Photo.find(prev_id)
    prev_id.to_s
  end

  private
  
  def last_id?()
    @attributes['id'] == Photo.maximum(:id).to_s
  end

  def first_id?()
    @attributes['id'] == Photo.minimum(:id).to_s
  end


end
