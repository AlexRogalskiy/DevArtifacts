#!/usr/bin/env ruby
# use_cli.rb

=begin rdoc
Please refer to the SimpleCLI Class for documentation.
=end

require 'simple_cli'

cli = SimpleCLI.new()
cli.parse_opts(ARGV)
