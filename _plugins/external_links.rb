require "addressable/uri"
require "nokogiri"

# Jekyll hook to add targets to external links
class ExternalLinksProcessor
  def initialize(page)
    @page = page
    @site = page.site
    @blog_host = Addressable::URI.parse(@site.config["url"]).host
  end

  def process!
    @page.output = process(@page.output)
    @page.data["excerpt"] = process(@page.data["excerpt"]) if @page.data["excerpt"]
  end

  private

  def process(html)
    doc = Nokogiri::HTML(html)
    doc.css("a").each do |node|
      next unless (href = node["href"])
      next unless (uri = Addressable::URI.parse(href))
      next if !uri.host || uri.host == @blog_host

      node["target"] = "_blank"
      node["rel"] = "noopener"
    end

    doc.to_html
  end
end

Jekyll::Hooks.register :documents, :post_render do |page|
  ExternalLinksProcessor.new(page).process!
end
