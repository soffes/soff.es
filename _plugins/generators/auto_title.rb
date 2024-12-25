# Jekyll generator to automatically extract the title
class AutoTitle < Jekyll::Generator
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
      next unless (title = document.content.match(REGEX)[2])

      document.content.sub!(REGEX, "")
      document.data["title"] = title.to_s
    end
  end
end
