# frozen_string_literal: true

$LOAD_PATH.push File.expand_path('../lib', __FILE__)
require 'vkontakte/version'

Gem::Specification.new do |gem|
  gem.authors       = ['Anton Maminov']
  gem.email         = ['anton.linux@gmail.com']
  gem.description   = 'Unofficial VKontakte'
  gem.summary       = 'Unofficial VKontakte'
  gem.homepage      = 'https://github.com/mamantoha/vkontakte'

  gem.executables   = `git ls-files -- bin/*`.split("\n").map { |f| File.basename(f) }
  gem.files         = `git ls-files`.split("\n")
  gem.test_files    = `git ls-files -- {test,spec,features}/*`.split("\n")
  gem.name          = 'vkontakte'
  gem.require_paths = ['lib']
  gem.version       = Vkontakte::VERSION
  gem.add_runtime_dependency('mechanize')
  gem.add_runtime_dependency('socksify')
  gem.add_development_dependency('pry')
end
