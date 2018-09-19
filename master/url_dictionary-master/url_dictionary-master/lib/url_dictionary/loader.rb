require 'yaml'
require 'open-uri'

module UrlDictionary
  class Loader
    @@site_cache = {}
    @@data_cache = nil

    class << self
      def load(site_key)
        @@site_cache[site_key.to_s.downcase] ||= load_dictionary(site_key)
      end

      def clear_caches
        @@site_cache = {}
        @@data_cache = nil
      end

      private

      def load_dictionary(site_key)
        site_key = site_key.to_s.downcase
        if site_data = data[site_key]
          UrlDictionary::Dictionary.new(site_data, site_key)
        else
          fail ArgumentError, "No dictionary for site_key #{site_key}"
        end
      end

      def data
        @@data_cache ||= load_data_structure
      end

      def load_data_structure
        YAML.load(load_from_data_source)
      end

      def load_from_data_source
        if UrlDictionary::Config.use_local_dictionary?
          load_from_file
        else
          load_from_github
        end
      end

      def load_from_github
        yaml_string = open(remote_dictionary_url).read
        YAML.load(yaml_string) # Triggers exception if response is bad
        yaml_string
      rescue Exception => e
        raise RuntimeError, "UrlDictionary couldn't read dictionary from #{remote_dictionary_url} : #{e.message}"
      end

      def load_from_file
        File.read(path_to_file)
      end

      def path_to_file
        File.join(UrlDictionary.root_path, 'data_v2.yml')
      end

      def remote_dictionary_url
        'https://raw.githubusercontent.com/lokalebasen/url_dictionary/master/lib/url_dictionary/data_v2.yml'
      end
    end
  end
end
