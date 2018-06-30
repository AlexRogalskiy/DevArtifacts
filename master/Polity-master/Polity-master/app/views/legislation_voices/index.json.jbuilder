json.array!(@legislation_voices) do |legislation_voice|
  json.extract! legislation_voice, :id, :user_id, :legislation_id, :support, :feedback
  json.url legislation_voice_url(legislation_voice, format: :json)
end