require 'rake'

namespace :assets do
  task :precompile do
    puts `bundle exec jekyll build`
  end
end

desc 'sync static files'
task :sync do
  system "s3cmd sync -P --exclude=.DS_Store --delete-removed ./_site/images/ s3://static.fengzhichao.me/images/"
  system "s3cmd sync -P --exclude=.DS_Store --delete-removed ./_site/assets/ s3://static.fengzhichao.me/assets/"
end
