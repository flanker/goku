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

  class Pipeline
    class << self
      def hash(source, manifest, options = {})
        Digest::MD5.hexdigest(manifest.to_s)
      end
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

  class CssCompressor < JekyllAssetPipeline::Compressor
    require 'yui/compressor'

    def self.filetype
      '.css'
    end

    def compress
      YUI::CssCompressor.new.compress(@content)
    end
  end

  class JavaScriptCompressor < JekyllAssetPipeline::Compressor
    require 'yui/compressor'

    def self.filetype
      '.js'
    end

    def compress
      YUI::JavaScriptCompressor.new(:munge => true).compress(@content)
    end
  end
end
