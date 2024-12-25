require "mini_magick"

# Jekyll generator to rewrite image URLs
class RewriteImages < Jekyll::Generator
  def generate(site)
    puts "        - Rewrite Images"

    (site.pages + site.posts.docs).each do |page|
      assets_url = assets_url(page)
      page.content.gsub!(/(<img.*src=")(?!http|\/)([^"]+\.(?:jpg|png|svg))(".*>)/, "\\1#{assets_url}\\2\\3")
      page.content.gsub!(/(<a.*href=")(?!http|\/)([^"]+\.(?:jpg|png|svg))(".*>)/, "\\1#{assets_url}\\2\\3")
      page.content.gsub!(/\[!\[(.*)\]\((?!http|\/)(.*)\)\]\(/, %([<img src="#{assets_url}\\2" alt="\\1">]\())
      page.content.gsub!(/!\[(.*)\]\((?!http|\/)(.*)\)/, %(<img src="#{assets_url}\\2" alt="\\1">))

      next unless page.data["cover_image"]

      path = assets_path(page) + page.data["cover_image"]
      page.data["cover_image"] = assets_url + page.data["cover_image"]

      size = MiniMagick::Image.open(path).dimensions
      page.data["cover_image_width"] = size[0]
      page.data["cover_image_height"] = size[1]
    end
  end

  # Relative to site root with trailing `/`
  def assets_path(page)
    if (date = page.data["date"])
      File.join("assets", "blog", "#{date.strftime("%Y-%m-%d")}-#{page.data["slug"]}", "/")
    else
      page.dir.sub(/^\//, "")
    end
  end

  # Path with leading `/` for use in HTML
  def assets_url(page)
    File.join("/", assets_path(page))
  end
end
