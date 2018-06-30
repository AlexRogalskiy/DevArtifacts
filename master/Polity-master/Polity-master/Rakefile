
require "fileutils"

begin
  require "bundler/setup"
rescue LoadError
  puts "You must `gem install bundler` and `bundle install` to run rake tasks"
end

###########################################
# I don't know what the line below does		#
# Bundler::GemHelper.install_tasks				#
###########################################

# RSpec
# -----------------------------------------------------------------------------
load "rspec/rails/tasks/rspec.rake"
namespace :spec do
  desc "Run the code examples in spec/features"
  RSpec::Core::RakeTask.new("features") do |t|
    t.pattern = "./spec/features/**/*_spec.rb"
  end
end

# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)

Rails.application.load_tasks

