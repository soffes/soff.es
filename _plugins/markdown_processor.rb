require "rouge"
require "redcarpet"

# Custom markdown processor
class CustomMarkdownRenderer < Redcarpet::Render::HTML
  def block_code(code, language)
    language = nil if %w[text txt].include?(language)
    language = "objective_c" if %w[objective-c objc].include?(language)

    if language
      %(<div class="highlight"><pre>#{Rouge.highlight(code, language, "html")}</pre></div>)
    else
      "<pre>#{code}</pre>"
    end
  end

  def paragraph(text)
    # For some custom tags, it thinks they are paragraphs. Fix that.
    return text if text.start_with?('<photo-')

    "<p>#{text}</p>"
  end
end

module Jekyll
  module Converters
    class Markdown
      # Custom markdown processor plug-in
      class Custom
        OPTIONS = {
          no_intra_emphasis: true,
          tables: true,
          fenced_code_blocks: true,
          autolink: true,
          strikethrough: true,
          space_after_headers: true,
          superscript: true,
          with_toc_data: true,
          underline: true,
          highlight: true
        }.freeze

        def initialize(_config)
          @processor = Redcarpet::Markdown.new(CustomMarkdownRenderer, OPTIONS)
        end

        def convert(content)
          @processor.render(content)
        end
      end
    end
  end
end
