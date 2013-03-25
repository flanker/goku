require 'json'

module Jekyll

  class BlogsJsonTag < Liquid::Tag

    def initialize(tag_name, text, tokens)
      super
      @text = text
    end

    def render(context)
      blogs = context['site']['posts'].inject({}) do |memo, post|
        year = post.date.year
        month = post.date.strftime('%B')
        memo[year] = [] unless memo[year]
        memo[year] << month
        memo
      end
      blogs.to_json
    end

  end

end

Liquid::Template.register_tag('blogs_json', Jekyll::BlogsJsonTag)