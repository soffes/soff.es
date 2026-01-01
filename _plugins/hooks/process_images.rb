require "addressable/uri"
require "base64"
require "json"
require "marcel"
require "mini_magick"
require "nokogiri"

# Jekyll hook to process images
class ImageProcessor
  # 4.5", 4.0" (2x):            228w, 140w,  91w,  66w
  # 4.7", 5.8" (2x, 3x):        343w, 168w, 109w,  80w
  # 5.5", 6.1", 6.5" (2x, 3x):  382w, 137w, 122w,  90w
  # Deskop (1x, 2x, 3x):       1024w, 508w, 336w, 250w
  IMAGE_SIZES = [
    [
      {width: 1024, scales: [1, 2], max_width: 1024},
      {width: 382, scales: [2, 3], max_width: 414},
      {width: 343, scales: [2, 3], max_width: 375},
      {width: 228, scales: [2], max_width: 320}
    ],
    [
      {width: 508, scales: [1, 2], max_width: 1024},
      {width: 137, scales: [2, 3], max_width: 414},
      {width: 168, scales: [2, 3], max_width: 375},
      {width: 140, scales: [2], max_width: 320}
    ],
    [
      {width: 336, scales: [1, 2], max_width: 1024},
      {width: 122, scales: [2, 3], max_width: 414},
      {width: 109, scales: [2, 3], max_width: 375},
      {width: 91, scales: [2], max_width: 320}
    ],
    [
      {width: 250, scales: [1, 2], max_width: 1024},
      {width: 90, scales: [2, 3], max_width: 414},
      {width: 80, scales: [2, 3], max_width: 375},
      {width: 66, scales: [2], max_width: 320}
    ]
  ].freeze

  CACHE_PATH = "tmp/images.json".freeze

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
      next unless src.end_with?("png", "jpg")

      process_image(node)
    end

    if is_production? && @site.config["cdn_url"]
      doc.css('meta[property="og:image"]').each do |node|
        width = doc.css('meta[property="og:image:width"]').first.try(:[], "content") || 1024

        url = Addressable::URI.parse(@site.config["cdn_url"])
        url.path = Addressable::URI.parse(node["content"]).path
        url.query = "w=#{width}&auto=format,compress"
        node["content"] = url.to_s
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
    url = (is_production? && cdn_url) ? (cdn_url + src) : src

    is_cover = node.parent["class"] == "cover"
    up = 1
    if node.parent.name == "photo-row"
      count = node.parent.css("img").count
      if count > 4
        puts "Error: #{@post.data["slug"]} has invalid photo-row"
      else
        up = count
      end
    end

    if is_production? && cdn_url
      srcset = []
      sizes = []
      IMAGE_SIZES[up - 1].reverse_each do |size|
        # Remove this variant for covers on small phones since it gets pixelated.
        # Ideally, we'd have a separate set of image sizes just for covers, but this is fine for now.
        next if is_cover && size[:max_width] == 320

        size[:scales].reverse_each do |scale|
          srcset += ["#{url}?w=#{size[:width]}&dpr=#{scale}&auto=format #{size[:width] * scale}w"]
        end

        sizes << if size[:max_width] == 1024
          "1024px"
        else
          "(max-width: #{size[:max_width]}px) #{size[:width]}px"
        end
      end

      node["src"] = "#{url}?w=1024&dpr=2&auto=format,compress"
      node["srcset"] = srcset.join(",")
      node["sizes"] = sizes.join(",")
    end

    path = src.sub(/\A\//, "")
    info = image_info(path, is_cover: is_cover)

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

Jekyll::Hooks.register :pages, :post_render do |page|
  next if %w[.json .xml].include?(page.ext)

  ImageProcessor.new(page).process!
end

Jekyll::Hooks.register :posts, :post_render do |page|
  ImageProcessor.new(page).process!
end
