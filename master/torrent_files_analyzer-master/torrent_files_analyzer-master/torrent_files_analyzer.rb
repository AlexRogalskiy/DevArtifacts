# encoding: utf-8

require 'sinatra'
require 'sinatra/flash'
require 'time'
require 'net/http'
require 'tempfile'
require 'slim'
require 'bencode'

require_relative './lib/sinatra/flash/style'

Slim::Engine.set_default_options :pretty => true

def generate_hash(files)
  array = files.inject([]) {|h, i| h << i['path'].join('/')}
  tree = array.inject({}) {|h, i| t = h; i.split("/").each {|n| t[n] ||= {}; t = t[n]}; h}

  return tree
end

def get_torrent_from_url(url)
  file = nil
  uri = URI(url)

  begin
    resp = Net::HTTP.start(uri.host, uri.port,
      :use_ssl => uri.scheme == 'https') {|http|
      http.head(uri.request_uri)
    }
  rescue
    return nil
  end

  if resp['content-type'] == 'application/x-bittorrent' && resp['content-length'].to_i < 200 * 1024 # 200 kB
    resp = Net::HTTP.start(uri.host, uri.port,
      :use_ssl => uri.scheme == 'https') {|http|
      http.get(uri.request_uri)
    }

    tempfile = Tempfile.new('torrent')
    File.open(tempfile.path, 'w'){|f| f.write(resp.body)}
    file = tempfile.path
  end

  return file
end

class TorrentFilesAnalyzer < Sinatra::Base
  set :sessions, true
  register Sinatra::Flash

  get '/' do
    slim :index
  end

  post '/upload' do
    if params[:file]
      tempfile = params[:file][:tempfile]
    elsif params[:url] && !params[:url].empty?
      tempfile = get_torrent_from_url(params[:url])
      if tempfile.nil?
        flash[:error] = 'Incorrect URL'
        redirect '/'
      end
    else
      flash[:error] = 'Torrent file not specified'
      redirect '/'
    end

    @data = BEncode.load_file(tempfile)

    @info = @data['info']
    @data = @data.delete_if{|k, v| k == 'info'}

    @files_tree = generate_hash(@info['files']) if @info['files']

    slim :upload
  end

  run! if app_file == $0
end
