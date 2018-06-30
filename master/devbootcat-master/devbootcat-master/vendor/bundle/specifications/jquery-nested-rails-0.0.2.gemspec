# -*- encoding: utf-8 -*-
# stub: jquery-nested-rails 0.0.2 ruby lib

Gem::Specification.new do |s|
  s.name = "jquery-nested-rails"
  s.version = "0.0.2"

  s.required_rubygems_version = Gem::Requirement.new(">= 1.3.6") if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib"]
  s.authors = ["Anup Pareek"]
  s.date = "2013-10-09"
  s.description = "Nested is a jQuery plugin which allows you to create multi-column, dynamic grid layouts. "
  s.email = ["anup.p@cisinlabs.com"]
  s.homepage = "http://rubygems.org/gems/jquery-nested-rails"
  s.licenses = ["MIT"]
  s.rubyforge_project = "jquery-rails"
  s.rubygems_version = "2.2.2"
  s.summary = "For a complete gap free, multi column grid layout experience on rails application."

  s.installed_by_version = "2.2.2" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 3

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<railties>, [">= 3.0"])
    else
      s.add_dependency(%q<railties>, [">= 3.0"])
    end
  else
    s.add_dependency(%q<railties>, [">= 3.0"])
  end
end
