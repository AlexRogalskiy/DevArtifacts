require 'url_dictionary/version'
require 'url_dictionary/bad_value_error'
require 'url_dictionary/missing_key_error'
require 'url_dictionary/config'
require 'url_dictionary/loader'
require 'url_dictionary/dictionary'

module UrlDictionary
  def self.root_path
    File.join(File.dirname(__FILE__), 'url_dictionary')
  end

  def self.load(site_key)
    UrlDictionary::Loader.load(site_key)
  end
end
