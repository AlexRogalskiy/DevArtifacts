# -*- encoding: utf-8 -*-
# stub: imagesLoaded_rails 3.1.7 ruby lib

Gem::Specification.new do |s|
  s.name = "imagesLoaded_rails"
  s.version = "3.1.7"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib"]
  s.authors = ["Guy Israeli"]
  s.date = "2014-06-03"
  s.description = "imagesLoaded.js Wrapper for Rails 3.1+ Asset Pipeline "
  s.homepage = "https://github.com/guyisra/imagesLoaded-rails"
  s.licenses = ["MIT"]
  s.rubygems_version = "2.2.2"
  s.summary = "Asset pipeline is like \"I'll take care of that js for you sir\" and Rails is like \"You know thats right! and what about them images?!\""

  s.installed_by_version = "2.2.2" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_development_dependency(%q<bundler>, ["~> 1.3"])
      s.add_development_dependency(%q<rake>, [">= 0"])
      s.add_runtime_dependency(%q<railties>, [">= 3.1"])
    else
      s.add_dependency(%q<bundler>, ["~> 1.3"])
      s.add_dependency(%q<rake>, [">= 0"])
      s.add_dependency(%q<railties>, [">= 3.1"])
    end
  else
    s.add_dependency(%q<bundler>, ["~> 1.3"])
    s.add_dependency(%q<rake>, [">= 0"])
    s.add_dependency(%q<railties>, [">= 3.1"])
  end
end
