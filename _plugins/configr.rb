require 'yaml'

class Configr

  class << self

    def site
      settings
    end

    private

    def settings
      YAML.load_file(config_file)
    end

    def config_file
      File.dirname(__FILE__) + '/../_config.yml'
    end

  end

end