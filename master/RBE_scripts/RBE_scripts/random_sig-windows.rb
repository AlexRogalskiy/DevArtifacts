#!/usr/bin/env ruby
# random_sig-windows.rb

home = "#{ENV['HOMEDRIVE']}" + "#{ENV['HOMEPATH']}"
filename = ARGV[0] || (home + '\\scripts\\sig_quotes.txt')
quotations_file = File.new(filename, 'r')
file_lines = quotations_file.readlines()
quotations_file.close()
quotations      = file_lines.to_s.split("\n\n")
random_index    = rand(quotations.size)
quotation       = quotations[random_index]
sig_file_name   = home + '\.signature'
signature_file  = File.new(sig_file_name, 'w')
signature_file.puts 'Kevin Baird |   kcbaird@world.oberlin.edu |   http://kevinbaird.net/'
signature_file.puts quotation
signature_file.close()
