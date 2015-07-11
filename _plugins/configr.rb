require 'yaml'

class Configr

  class << self

    def site
      settings
    end

    private

    def settings
      YAML.load(ERB.new(File.read(config_file)).result)
    end

    def config_file
      File.dirname(__FILE__) + '/../_config.yml'
    end

  end

end
