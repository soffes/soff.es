require "nokogiri"

# Liquid filter to make image sources absolute for feeds
module AbsoluteImagesFilter
  def absolute_images(html)
    return html if html.to_s.empty?

    site = @context.registers[:site]
    doc = Nokogiri::HTML::DocumentFragment.parse(html)

    doc.css("img").each do |node|
      next unless (src = node["src"])
      next unless src.start_with?("/")

      node["src"] = ImageProcessor.absolute_url(src, site)
    end

    doc.to_html
  end
end

Liquid::Template.register_filter(AbsoluteImagesFilter)
