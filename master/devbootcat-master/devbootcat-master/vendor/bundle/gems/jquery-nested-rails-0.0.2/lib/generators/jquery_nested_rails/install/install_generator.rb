require 'rails'

# Supply generator for Rails 3.0.x or if asset pipeline is not enabled
if ::Rails.version < "3.1" || !::Rails.application.config.assets.enabled
  module JqueryNestedRails
    module Generators
      class InstallGenerator < ::Rails::Generators::Base

        desc "This generator installs Jquery Nested #{JqueryNestedRails::Rails::JQUERY_NESTED_VERSION}"
        source_root File.expand_path('../../../../../vendor/assets/javascripts', __FILE__)

        def copy_jquery_nested
          say_status("copying", "Jquery Nested (#{JqueryNestedRails::Rails::JQUERY_NESTED_VERSION})", :green)
          copy_file "jquery.nested.min.js", "public/javascripts/jquery.nested.min.js"
        end
      end
    end
  end
else
  module JqueryNestedRails
    module Generators
      class InstallGenerator < ::Rails::Generators::Base
        desc "This generator add Jquery Nested #{JqueryNestedRails::Rails::JQUERY_NESTED_VERSION} to application.js or application.js.coffee"
        source_root File.expand_path('../../../../../vendor/assets/javascripts', __FILE__)
        def add_assets
          if detect_js_format.nil?
            say_status("copying", "Jquery Nested (#{JqueryNestedRails::Rails::JQUERY_NESTED_VERSION})", :green)
            copy_file "jquery.nested.min.js", "app/assets/javascripts/jquery.nested.min.js"
          else
            insert_into_file "app/assets/javascripts/application#{detect_js_format[0]}", "#{detect_js_format[1]} require jquery.nested\n", :after => "jquery_ujs\n"
          end
        end

        def detect_js_format
          return ['.js.coffee', '#='] if File.exist?('app/assets/javascripts/application.js.coffee')
          return ['.js', '//='] if File.exist?('app/assets/javascripts/application.js')
        end
      end
    end
  end
end
