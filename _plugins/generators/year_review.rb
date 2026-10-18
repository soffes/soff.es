# Jekyll generator to flag year in review posts, which are the ones named
# after a year, like `/blog/2025`
class YearReviewGenerator < Jekyll::Generator
  safe true

  def generate(site)
    puts "        - Year Review"

    site.posts.docs.each do |document|
      document.data["is_year_review"] = document.data["slug"].to_s.match?(/\A\d{4}\z/)
    end
  end
end
