# Jekyll generator to automatically set gallery metadata
class GalleryGenerator < Jekyll::Generator
  safe true

  def generate(site)
    puts "        - Gallery"

    site.documents.each do |page|
      # If it was explicitly set, leave it alone.
      next unless page.data["is_gallery"].nil?

      # Automatically set it to true if a `<photo-row>` element exists
      if page.content.include?("<photo-row>")
        page.data["is_gallery"] = true
      end
    end
  end
end
