# coding: utf-8
require 'sinatra'
require 'haml'
require "sinatra/reloader"
require 'redcarpet'

DIR_PATH = File.realpath('./markdown')
BASE_URL = 'http://localhost:4567'
MARKDOWN = Redcarpet::Markdown.new(Redcarpet::Render::HTML, autolink: true, tables: true)
# cacheの更新処理思い付かない。
$cache = nil

def update_cache
  puts "updated"
  # 現時点ではmarkdownしかSupportしない。
  $cache = Dir.glob('./markdown/**/*.md')
             .map{|fp| fp.gsub(/^\.\/markdown/, 'http://localhost:4567/path') }
end

update_cache

get '/' do
  @links = $cache
  haml :index
end

get '/path/*' do |path|
  sani_path = File.join(DIR_PATH, path)
  if File.exist?(sani_path) && sani_path.match("^#{DIR_PATH}")
    @content = MARKDOWN.render(File.open(sani_path).read)
    haml :md
  else
    "filepathが不正か、迷子です。 => #{path}"
  end
end
