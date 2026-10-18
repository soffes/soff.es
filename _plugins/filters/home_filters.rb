require "json"
require "nokogiri"

# Liquid filters for the homepage
module HomeFilters
  # Plan types that count as an adventure. Only these show their title on the
  # homepage, since the rest can have other people's names in them.
  ADVENTURE_TYPES = %w[scuba hiking travel van].freeze

  # Every photo in a post, in order, as paths under `/assets/blog/`.
  def post_photos(post)
    doc = Nokogiri::HTML::DocumentFragment.parse(post["content"].to_s)
    doc.css("img").map { |node| node["src"] }.compact.select { |src| src.end_with?(".jpg") }.uniq
  end

  # `count` items spread evenly through `array`, skipping `except`, so a
  # preview isn't just the first few photos from the same moment.
  def spread(array, count, except = nil)
    items = Array(array) - [except]
    count = count.to_i
    return items if items.count <= count

    step = items.count.to_f / count
    Array.new(count) { |i| items[(i * step).floor] }
  end

  # The events from plan.yml as JSON for the homepage's Now / Next script,
  # with only what it's allowed to show.
  def plan_json(plan)
    events = Array(plan && plan["sections"]).flat_map { |section| Array(section["events"]) }

    json = events.map do |event|
      type = event["type"].to_s
      adventure = ADVENTURE_TYPES.include?(type)

      {
        "start" => event["date"].to_s,
        "end" => event["end"]&.to_s,
        "type" => type,
        "place" => public_place(event["location"]),
        "to" => event["to"] && public_place(event["to"]),
        "status" => event["status"],
        "title" => (event["title"] if adventure),
        "when" => (event["when"] if adventure),
        "progress" => event["progress"]
      }.compact
    end

    # Safe to drop straight into a <script> tag.
    JSON.generate(json).gsub("</", "<\\/")
  end

  # A location without the venue. "Regency Ballroom, San Francisco, CA"
  # becomes "San Francisco, CA". A list of places is left alone.
  def public_place(location)
    parts = location.to_s.split(",").map(&:strip)
    return parts.join(", ") unless parts.count > 2 && parts.last.match?(/\A[A-Z]{2}\z/)

    parts.last(2).join(", ")
  end
end

Liquid::Template.register_filter(HomeFilters)
