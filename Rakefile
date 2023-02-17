desc "Update blog repo and import published posts"
task :import do
  if File.directory?("tmp/blog")
    system "cd tmp/blog && git pull origin main && cd .."
  else
    system "mkdir -p tmp"
    system "git clone https://github.com/soffes/blog.git tmp/blog"
  end

  import_directory("tmp/blog/published", "blog/_posts")
  import_directory("tmp/blog/drafts", "blog/_drafts")
end

namespace :import do
  desc "Import all local drafts"
  task :local do
    abort "Expected blog directory at `../blog/`" unless File.directory?("../blog")
    import_directory("../blog/drafts")
  end
end

desc "Build"
task :build do
  Rake::Task["import"].invoke unless File.directory?("blog/_posts")

  sh "npm run build && bundle exec jekyll build --drafts --config _config.yml --trace"
end

task default: :build

desc "Clean generated code"
task :clean do
  system "rm -rf blog/_posts blog/_drafts _site assets/blog .jekyll-cache _assets/js"
end

desc "Local server"
task :server do
  sh "npm run build && bundle exec jekyll serve --drafts --trace --watch"
end

namespace :lint do
  desc "Lint Ruby"
  task :ruby do
    sh "bundle exec standardrb"
  end

  desc "Lint YAML"
  task :yaml do
    if `which yamllint`.chomp.empty?
      abort "yamllint is not installed. Install it with `pip3 install yamllint`."
    end

    sh "yamllint -c .yamllint.yml ."
  end
end

desc "Run all linters"
task lint: %i[lint:ruby lint:yaml]

private

def import_directory(source, destination = "blog/_posts")
  unless File.directory?(source)
    puts "Missing directory `#{source}`"
    return
  end

  splat = "#{source}/*"
  return if Dir[splat].empty?

  system %(rm -rf #{destination})
  system %(mkdir -p #{destination})
  system %(mkdir -p assets/blog)
  system %(cp -r #{splat} #{destination})

  limit = ENV["LIMIT"]
  Dir["#{destination}/*"].reverse.each_with_index do |dir, i|
    if limit && i >= limit.to_i
      system %(rm -rf "#{dir}")
      next
    end

    # Move post
    md = Dir["#{dir}/*.{md,markdown}"].first
    system %(mv "#{md}" "#{dir}.md")

    # Copy assets
    if Dir.empty?(dir)
      system %(rm -rf #{dir})
    else
      system %(mv #{dir} assets/blog)
    end
  end
end
