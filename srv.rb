# coding: utf-8
require 'sinatra'
require 'haml'
require "sinatra/reloader"
require 'redcarpet'
require 'json'

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
             .sort
end

def render_content(path)
  sani_path = File.join(DIR_PATH, path)
  if File.exist?(sani_path) && sani_path.match("^#{DIR_PATH}")
    File.open(sani_path).read
  else
    "filepathが不正か、迷子です。 => #{path}"
  end
end

update_cache

# API
# TODO: 今はすべて出力してるので、paging処理したりする。
get '/api/v1/index' do
  $cache.to_json
end

# TODO: Add error process.
get '/api/v1/content/*' do |path|
  content = render_content(path)
  result = {}
  result['content'] = content
  result.to_json
end

# Normal

get '/' do
  @links = $cache
  haml :index
end

get '/path/*' do |path|
  @content = MARKDOWN.render(render_content(path))
  haml :md
end
