# -*- encoding: utf-8 -*-
require File.expand_path('../lib/jquery-nested-rails/rails/version', __FILE__)

Gem::Specification.new do |s|
  s.name        = "jquery-nested-rails"
  s.date        = '2013-10-09' 
  s.version     = JqueryNestedRails::Rails::VERSION
  s.authors     = ["Anup Pareek"]
  s.email       = ["anup.p@cisinlabs.com"]
  s.homepage    = "http://rubygems.org/gems/jquery-nested-rails"
  s.summary     = %q{For a complete gap free, multi column grid layout experience on rails application.}
  s.description = %q{Nested is a jQuery plugin which allows you to create multi-column, dynamic grid layouts. }
  s.license     = "MIT"

  s.required_rubygems_version = ">= 1.3.6"
  s.rubyforge_project         = "jquery-rails"

  s.add_dependency "railties", ">= 3.0"

  s.files         = `git ls-files`.split("\n")
  s.test_files    = `git ls-files -- {test,spec,features}/*`.split("\n")
  s.executables   = `git ls-files -- bin/*`.split("\n").map{ |f| File.basename(f) }
  s.require_paths = ["lib"]
end