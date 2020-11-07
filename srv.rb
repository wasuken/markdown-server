# coding: utf-8
require 'sinatra'
require 'haml'
require "sinatra/reloader"

DIR_PATH = File.realpath('./markdown')
BASE_URL = 'http://localhost:4567'

get '/' do
  @links = Dir.glob('./markdown/**/*.*')
             .map{|fp| fp.gsub(/^\.\/markdown/, 'http://localhost:4567/path') }
  haml :index
end

get '/path/*' do |path|
  sani_path = File.join(DIR_PATH, path)
  if File.exist?(sani_path) && sani_path.match("^#{DIR_PATH}")
    File.open(sani_path).read
  else
    "filepathが不正か、迷子です。 => #{path}"
  end
end
