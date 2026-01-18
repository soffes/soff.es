require "base64"
require "json"
require "marcel"
require "mini_magick"
require "nokogiri"
require "uri"

# Jekyll hook to process images
class ImageProcessor
  IMAGE_WIDTHS = [1024, 512, 256].freeze
  CACHE_PATH = "tmp/images.json".freeze
  CDN_PREFIX = "/assets/blog/".freeze

  def initialize(page, should_process = true)
    @page = page
    @site = page.site
    @should_process = should_process
    @cache = {}

    # Load cache
    if File.exist?(CACHE_PATH)
      begin
        cache = JSON.parse(File.read(CACHE_PATH))
        @cache = cache if cache.is_a?(Hash)
      rescue
        puts "Failed to load image cache"
      end
    end
  end

  def process!
    return unless @should_process

    doc = Nokogiri::HTML(@page.output)
    doc.css("img").each do |node|
      next unless (src = node["src"])
      next if src.start_with?("http")
      next unless src.end_with?("jpg")

      process_image(node)
    end

    if is_production? && (cdn_url = @site.config["cdn_url"])
      doc.css('meta[property="og:image"]').each do |node|
        next unless node["content"].start_with?(CDN_PREFIX)
        width = doc.css('meta[property="og:image:width"]').first.try(:[], "content") || 1024
        node["content"] = URI.join(cdn_url, node["content"].delete_prefix(CDN_PREFIX)).with_width(width).to_s
      end
    end

    @page.output = doc.to_html

    save_cache!
  end

  private

  def is_production?
    ENV["JEKYLL_ENV"] == "production"
  end

  def process_image(node)
    cdn_url = @site.config["cdn_url"]
    src = node["src"]

    is_cover = node.parent["class"] == "cover"

    path = src.sub(/\A\//, "")
    info = image_info(path, is_cover: is_cover)
    image_width = info["width"].to_i

    if is_production? && cdn_url && src.start_with?(CDN_PREFIX)
      url = URI.join(cdn_url, src.delete_prefix(CDN_PREFIX))

      srcset = []
      IMAGE_WIDTHS.reverse_each do |width|
        next unless width < image_width
        srcset << %(#{url.with_width(width)} #{width}w)
      end

      node["src"] = url.to_s
      node["srcset"] = srcset.join(", ")
    end

    node["width"] = info["width"]
    node["height"] = info["height"]

    node["fetchpriority"] = "high" if is_cover

    node["style"] =
      "background-image:url(#{info["thumbnail"]});" \
      "background-repeat:no-repeat;background-size:cover"
  end

  def image_info(path, is_cover:)
    info = @cache[path]
    return info if info

    image = MiniMagick::Image.open(path)

    size = image.dimensions
    info = {
      "width" => size[0],
      "height" => size[1]
    }

    image.resize(is_cover ? "32x32" : "8x8")
    mime_type = Marcel::MimeType.for(Pathname.new(path))
    info["thumbnail"] = "data:#{mime_type};base64,#{Base64.strict_encode64(image.to_blob)}"

    @cache[path] = info
    info
  end

  def save_cache!
    json = JSON.pretty_generate(@cache)

    FileUtils.mkdir_p(File.dirname(CACHE_PATH))

    File.open(CACHE_PATH, "w") do |file|
      file << json
    end
  end
end

module URI
  class Generic
    def with_filename_suffix(suffix)
      return self unless path

      dir = ::File.dirname(path)
      basename = ::File.basename(path, ".*")
      ext = ::File.extname(path)

      new_basename = "#{basename}#{suffix}#{ext}"
      new_path = (dir == ".") ? new_basename : ::File.join(dir, new_basename)

      self.class.build(
        scheme: scheme,
        userinfo: userinfo,
        host: host,
        port: port,
        path: new_path,
        query: query,
        fragment: fragment
      )
    end
  end

  def with_width(width)
    with_filename_suffix("-#{width}")
  end
end

Jekyll::Hooks.register :pages, :post_render do |page|
  next if %w[.json .xml].include?(page.ext)

  ImageProcessor.new(page).process!
end

Jekyll::Hooks.register :posts, :post_render do |page|
  ImageProcessor.new(page).process!
end
