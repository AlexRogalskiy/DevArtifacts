module UrlDictionary
  class Dictionary
    def initialize(hash, site_key)
      @hash = hash
      @site_key = site_key
    end

    def translate(full_key)
      search(@hash, full_key, full_key.split('.'))
    end

    alias_method :t, :translate

    private

    def search(hash, full_key, remaining_segments)
      current_level = remaining_segments.shift
      current_value = hash[current_level]

      if current_value.nil?
        fail MissingKeyError, "#{full_key} is not defined for #{@site_key}"
      end

      if remaining_segments.any?
        search(current_value, full_key, remaining_segments)
      else
        if current_value.is_a? String
          current_value
        else
          fail BadValueError, "#{full_key} resolves to a #{current_value.class}, but should return a string."
        end
      end
    end
  end
end
