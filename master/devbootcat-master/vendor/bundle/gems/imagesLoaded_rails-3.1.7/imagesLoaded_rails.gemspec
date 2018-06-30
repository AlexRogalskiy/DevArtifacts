# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'imagesLoaded_rails/version'

Gem::Specification.new do |spec|
  spec.name          = "imagesLoaded_rails"
  spec.version       = ImagesLoadedRails::VERSION
  spec.authors       = ["Guy Israeli"]
  spec.description   = %q{imagesLoaded.js Wrapper for Rails 3.1+ Asset Pipeline }
  spec.summary       = %q{Asset pipeline is like "I'll take care of that js for you sir" and Rails is like "You know thats right! and what about them images?!"}
  spec.homepage      = "https://github.com/guyisra/imagesLoaded-rails"
  spec.license       = "MIT"

  spec.files         = `git ls-files`.split($/)
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_development_dependency "bundler", "~> 1.3"
  spec.add_development_dependency "rake"
  spec.add_dependency "railties", ">=3.1"

end
