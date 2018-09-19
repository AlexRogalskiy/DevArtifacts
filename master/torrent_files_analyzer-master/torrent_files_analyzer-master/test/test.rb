# encoding: utf-8

require 'bencode'
require 'pp'

file = 'test1.torrent'

dict = BEncode.load_file(file)
puts dict.keys
files = dict['info']['files']

def generate_hash(files)
=begin 1)
  tree = Hash.new{|h,k| h[k] = Hash.new(&h.default_proc)}
  files.each do |file|
    arrays = ""
    file['path'].each do |part|
      arrays << "[\"#{part}\"]"
      eval "tree#{arrays}"
    end
  end
=end

  ## 2
  #array = []
  #files.each {|file| array << file['path'].join('/')}
  #tree = array.inject({}) {|h, i| t = h; i.split("/").each {|n| t[n] ||= {}; t = t[n]}; h}

  ## 3
  array = files.inject([]) {|h, i| h << i['path'].join('/')}
  tree = array.inject({}) {|h, i| t = h; i.split("/").each {|n| t[n] ||= {}; t = t[n]}; h}

  return tree
end

def read_node(hash, level = 0)
  hash.each do |parent, children|
    if children.empty?
      puts "#{'  ' * level} #{parent.encoding}"
    else
      puts "#{'  ' * level} #{parent}"
      read_node(children, level + 1)
    end
  end
end

tree = generate_hash(files)
#read_node(tree)
