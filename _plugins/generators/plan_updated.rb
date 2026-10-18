require "open3"
require "time"

# Jekyll generator to stamp the plan with when it last changed, so the
# homepage can show it's up to date
class PlanUpdatedGenerator < Jekyll::Generator
  PATH = "_data/plan.yml".freeze

  safe true

  def generate(site)
    puts "        - Plan Updated"

    return unless (plan = site.data["plan"])

    # An `updated` in the file wins, then the last commit that touched it.
    plan["updated"] ||= last_commit_time(site) || site.time
  end

  private

  def last_commit_time(site)
    output, status = Open3.capture2("git", "log", "-1", "--format=%cI", "--", PATH, chdir: site.source)
    return unless status.success?
    return if output.strip.empty?

    Time.iso8601(output.strip)
  rescue SystemCallError, ArgumentError
    nil
  end
end
