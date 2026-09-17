# Jekyll generator to automatically extract the title
class TitleGenerator < Jekyll::Generator
  safe true

  # Regular expression to find `# Some title` at the beginning of the document
  # after optional front matter.
  #
  # Since the document isn't converted to HTML yet, we need to use this
  # approach. I never use the underline heading style, so this is fine
  # for my needs. This could defintiely be more robust.
  REGEX = /\A(?:---\n[\s\w]*\n---\n)?(# (.*)\n\n)/

  def generate(site)
    puts "        - Rewrite Title"

    site.posts.docs.each do |document|
      next unless (match = document.content.match(REGEX))

      document.content.sub!(REGEX, "")

      # Jekyll always fills in a title from the filename, so the only way to
      # tell whether the front matter set one is to compare against that.
      # Front matter wins, per the blog repo's README.
      next unless document.data["title"] == Jekyll::Utils.titleize_slug(document.data["slug"])

      document.data["title"] = match[2].to_s
    end
  end
end
