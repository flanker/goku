require 'jekyll_asset_pipeline'

module JekyllAssetPipeline

  class CssTagTemplate < JekyllAssetPipeline::Template
    def html
      "<link href='#{Configr.site['static_url']}/#{@path}/#{@filename}' rel='stylesheet' type='text/css' />\n"
    end
  end

  class JavaScriptTagTemplate < JekyllAssetPipeline::Template
    def html
      "<script src='#{Configr.site['static_url']}/#{@path}/#{@filename}' type='text/javascript'></script>\n"
    end
  end
end

module JekyllAssetPipeline
  class SassConverter < JekyllAssetPipeline::Converter
    require 'sass'

    def self.filetype
      '.scss'
    end

    def convert
      static_url = Configr.site['static_url']
      content = @content.gsub('{{ site.static_url }}', static_url)
      return Sass::Engine.new(content, :syntax => :scss).render
    end
  end
end