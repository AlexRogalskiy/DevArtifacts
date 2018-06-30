# -*- encoding: utf-8 -*-
# stub: shoulda-matchers 2.6.1 ruby lib

Gem::Specification.new do |s|
  s.name = "shoulda-matchers"
  s.version = "2.6.1"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib"]
  s.authors = ["Tammer Saleh", "Joe Ferris", "Ryan McGeary", "Dan Croak", "Matt Jankowski", "Stafford Brunk"]
  s.date = "2014-04-30"
  s.description = "Making tests easy on the fingers and eyes"
  s.email = "support@thoughtbot.com"
  s.homepage = "http://thoughtbot.com/community/"
  s.licenses = ["MIT"]
  s.required_ruby_version = Gem::Requirement.new(">= 1.9.2")
  s.rubygems_version = "2.2.2"
  s.summary = "Making tests easy on the fingers and eyes"

  s.installed_by_version = "2.2.2" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<activesupport>, [">= 3.0.0"])
      s.add_development_dependency(%q<appraisal>, ["~> 1.0.0.beta2"])
      s.add_development_dependency(%q<aruba>, [">= 0"])
      s.add_development_dependency(%q<pry>, [">= 0"])
      s.add_development_dependency(%q<bourne>, ["~> 1.3"])
      s.add_development_dependency(%q<bundler>, ["~> 1.1"])
      s.add_development_dependency(%q<cucumber>, ["~> 1.1"])
      s.add_development_dependency(%q<rails>, ["~> 3.0"])
      s.add_development_dependency(%q<rake>, [">= 0.9.2"])
      s.add_development_dependency(%q<rspec-rails>, ["< 3", ">= 2.13.1"])
    else
      s.add_dependency(%q<activesupport>, [">= 3.0.0"])
      s.add_dependency(%q<appraisal>, ["~> 1.0.0.beta2"])
      s.add_dependency(%q<aruba>, [">= 0"])
      s.add_dependency(%q<pry>, [">= 0"])
      s.add_dependency(%q<bourne>, ["~> 1.3"])
      s.add_dependency(%q<bundler>, ["~> 1.1"])
      s.add_dependency(%q<cucumber>, ["~> 1.1"])
      s.add_dependency(%q<rails>, ["~> 3.0"])
      s.add_dependency(%q<rake>, [">= 0.9.2"])
      s.add_dependency(%q<rspec-rails>, ["< 3", ">= 2.13.1"])
    end
  else
    s.add_dependency(%q<activesupport>, [">= 3.0.0"])
    s.add_dependency(%q<appraisal>, ["~> 1.0.0.beta2"])
    s.add_dependency(%q<aruba>, [">= 0"])
    s.add_dependency(%q<pry>, [">= 0"])
    s.add_dependency(%q<bourne>, ["~> 1.3"])
    s.add_dependency(%q<bundler>, ["~> 1.1"])
    s.add_dependency(%q<cucumber>, ["~> 1.1"])
    s.add_dependency(%q<rails>, ["~> 3.0"])
    s.add_dependency(%q<rake>, [">= 0.9.2"])
    s.add_dependency(%q<rspec-rails>, ["< 3", ">= 2.13.1"])
  end
end
