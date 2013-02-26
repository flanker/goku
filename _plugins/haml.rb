require 'haml'

module Jekyll

  class HamlConverter < Converter

    safe true
    priority :low

    def matches(ext)
      ext =~ /haml/i
    end

    def output_ext(ext)
      ".html"
    end

    def convert(content)
      begin
        puts "Performing Haml Conversion."
        p content
        engine = Haml::Engine.new(content)
        engine.render
      rescue StandardError => e
        puts "!!! Haml Error: " + e.message
      end
    end
  end
end