# Jekyll generator to process thanks
class Thanks < Jekyll::Generator
  safe true

  def generate(site)
    @site = site

    puts "        - Thanks"

    site.posts.docs.each do |document|
      next unless (thanks = document.data["thanks"])

      document.data["thanks"] = html_for(thanks)
    end
  end

  private

  def html_for(markdown)
    @_markdown ||= @site.find_converter_instance(Jekyll::Converters::Markdown)
    @_markdown.convert(markdown)
  end
end
