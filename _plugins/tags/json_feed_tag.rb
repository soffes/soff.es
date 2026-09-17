require "json"

# Liquid plug-in to generate a JSON Feed
class JsonFeedTag < Liquid::Tag
  def render(context)
    site = context["site"]
    jekyll_site = context.registers[:site]
    feed = {
      version: "https://jsonfeed.org/version/1",
      title: site["title"],
      description: site["description"],
      home_page_url: site["url"],
      feed_url: "#{site["url"]}/blog/feed.json",
      icon: "#{site["url"]}/apple-touch-icon-192x192.png",
      favicon: "#{site["url"]}/apple-touch-icon-192x192.png",
      author: {
        name: "Sam Soffes",
        url: "https://soff.es/",
        avatar: "https://soffes-assets.s3.amazonaws.com/images/Sam-Soffes.jpg"
      }
    }

    posts = site["posts"].reject { |post| post.data["category"] == "draft" }

    feed[:items] = posts.map do |post|
      item = {
        # The old bare slug URL. Kept as-is so subscribers don't see every post
        # as new. `url` below is the real one.
        id: "#{site["url"]}/#{post.data["slug"]}",
        url: "#{site["url"]}#{post.url}",
        title: post["title"],
        content_html: process_content(post.content, jekyll_site),
        date_published: Time.at(post.date).to_datetime.rfc3339
      }

      if (tags = post["tags"]) && !tags.empty?
        item[:tags] = tags
      end

      if (cover_image = post.data["cover_image"])
        item["banner_image"] = ImageProcessor.absolute_url(cover_image, jekyll_site)
      end

      item
    end

    feed.to_json
  end

  def process_content(content, site)
    doc = Nokogiri::HTML::DocumentFragment.parse(content)

    # Feed readers have no base URL to resolve against, so make sources absolute
    doc.css("img").each do |node|
      next unless (src = node["src"])
      next unless src.start_with?("/")

      node["src"] = ImageProcessor.absolute_url(src, site)
    end

    # Change photo-rows to a <div> with <p>s around the images
    doc.css("photo-row").each do |row|
      row.name = "div"
      row.inner_html = row.css("img").map { |i| "<p>#{i.to_html}</p>" }.join("")
    end

    doc.to_html
  end
end

Liquid::Template.register_tag("json_feed", JsonFeedTag)
