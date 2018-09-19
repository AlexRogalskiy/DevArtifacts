module UrlDictionary
  class Config
    @use_local_dictionary = false

    class << self
      def use_local_dictionary!
        @use_local_dictionary = true
        UrlDictionary::Loader.clear_caches
      end

      def use_local_dictionary?
        @use_local_dictionary
      end

      def use_remote_dictionary!
        @use_local_dictionary = false
        UrlDictionary::Loader.clear_caches
      end
    end
  end
end
