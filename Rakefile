require 'rake'
require 'rake/packagetask'

ROOT     = File.expand_path(File.dirname(__FILE__))
SRC_DIR  = File.join(ROOT, 'src')
DIST_DIR = File.join(ROOT, 'dist')
TEST_DIR = File.join(ROOT, 'test')

task :default => [:dist]

desc "Builds the distribution."
task :dist do
  $:.unshift File.join(ROOT, 'lib')
  require 'protodoc'
  
  Dir.chdir(SRC_DIR) do
    File.open(File.join(DIST_DIR, 'popup_handler.js'), 'w+') do |dist|
      dist << Protodoc::Preprocessor.new('popup_handler.js')
    end
  end
end