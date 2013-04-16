require 'rake'

desc 'sync static files'
task :sync do
  system "s3cmd sync -P --exclude=.DS_Store --delete-removed --delete-after ./_site/images/ s3://static.fengzhichao.me/images/"
  system "s3cmd sync -P --exclude=.DS_Store --delete-removed --delete-after ./_site/assets/ s3://static.fengzhichao.me/assets/"
end
