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
    @page.output = process(@page.output, fragment: false)
    @page.data["excerpt"] = process(@page.data["excerpt"], fragment: true) if @page.data["excerpt"]
  end

  private

  def process(html, fragment:)
    doc = fragment ? Nokogiri::HTML.fragment(html) : Nokogiri::HTML(html)
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

Jekyll::Hooks.register :pages, :post_render do |page|
  next if %w[.json .xml].include?(page.ext)

  ExternalLinksProcessor.new(page).process!
end

Jekyll::Hooks.register :posts, :post_render do |page|
  ExternalLinksProcessor.new(page).process!
end
