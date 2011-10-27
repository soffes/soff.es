require 'net/http'
require 'uri'

class Post < ActiveRecord::Base

  has_many :comments, :dependent => :destroy
  has_many :taggings, :dependent => :destroy
  has_many :tags, :through => :taggings

  validates_presence_of :title, :published_at, :content
  attr_writer :tag_names

  before_save do |post|
    rc_options = [:hard_wrap, :autolink, :no_intraemphasis, :fenced_code, :gh_blockcode]
    doc = Nokogiri::HTML(Redcarpet.new(post.content, *rc_options).to_html)
    doc.search("//pre[@lang]").each do |pre|
      # pre.replace Net::HTTP.post_form(URI.parse('http://pygments-1-4.appspot.com/'),
      #                                 {'lang'=>pre[:lang], 'code'=>pre.text.strip}).body
      pre.replace Pygmentize.process(pre.text.strip, pre[:lang].to_sym)
    end
    post.html_content = doc.css('body > *').to_s
  end

  after_save :assign_tags

  scope :published, lambda { where('published_at <= ?', Time.now.utc) }
  scope :unpublished, lambda { where('published_at > ?', Time.now.utc) }
  scope :recent, order('published_at DESC')

  def self.per_page
    3
  end

  def tag_names
    @tag_names || tags.map(&:name).join(' ')
  end

  def to_param
    self.permalink
  end

  def published?
    published_at < Time.now
  end

  def unpublished?
    !published?
  end

  def last_published?
    self == self.class.published.last
  end

  private

  def assign_tags
    if @tag_names
      self.tags = @tag_names.split(/\s+/).map do |name|
        Tag.find_or_create_by_name(name.gsub(',', ''))
      end
    end
  end
end
