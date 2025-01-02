require "json"

# Liquid plug-in to generate a JSON Feed
class JsonFeedTag < Liquid::Tag
  def render(context)
    site = context["site"]
    feed = {
      version: "https://jsonfeed.org/version/1",
      title: site["title"],
      description: site["description"],
      home_page_url: site["url"],
      feed_url: "#{site["url"]}/feed.json",
      icon: "#{site["url"]}/icon.png",
      favicon: "#{site["url"]}/favicon.png",
      author: {
        name: "Sam Soffes",
        url: "https://soff.es/",
        avatar: "https://soffes-assets.s3.amazonaws.com/images/Sam-Soffes.jpg"
      }
    }

    feed[:items] = site["posts"].map do |post|
      url = "#{site["url"]}/#{post.data["slug"]}"
      item = {
        id: url,
        url: url,
        title: post["title"],
        content_html: process_content(post.content),
        date_published: Time.at(post.date).to_datetime.rfc3339
      }

      if (tags = post["tags"]) && !tags.empty?
        item[:tags] = tags
      end

      if (cover_image = post.data["cover_image"])
        item["banner_image"] = site["url"] + cover_image
      end

      item
    end

    feed.to_json
  end

  def process_content(content)
    doc = Nokogiri::HTML::DocumentFragment.parse(content)

    # Change photo-rows to a <div> with <p>s around the images
    doc.css("photo-row").each do |row|
      row.name = "div"
      row.inner_html = row.css("img").map { |i| "<p>#{i.to_html}</p>" }.join("")
    end

    doc.to_html
  end
end

Liquid::Template.register_tag("json_feed", JsonFeedTag)
