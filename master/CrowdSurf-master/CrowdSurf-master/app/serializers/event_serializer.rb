class EventSerializer < ActiveModel::Serializer
  attributes :id, :title, :location_name, :street, :zip,
             :longitude, :latitude, :youtube_id, :flyer_uid, :flyer_name,
             :details, :start, :end, :created_at

end