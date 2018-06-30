require 'rails'
require 'jquery-nested-rails/rails/assert_select' if ::Rails.env.test?
require 'jquery-nested-rails/rails/engine' if ::Rails.version >= '3.1'
require 'jquery-nested-rails/rails/railtie'
require 'jquery-nested-rails/rails/version'

module JqueryNestedRails
  module Rails
  end
end