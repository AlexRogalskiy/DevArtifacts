module ActionDispatch
  module Assertions
    module SelectorAssertions

      PATTERN_HTML = %Q{"((\\\\\"|[^\"])*)"}
      PATTERN_UNICODE_ESCAPED_CHAR = /\\u([0-9a-zA-Z]{4})/

      private

      # Unescapes a JS string.
      def unescape_js(js_string)
        # js encodes double quotes and line breaks.
        unescaped= js_string.gsub('\"', '"')
        unescaped.gsub!('\\\'', "'")
        unescaped.gsub!(/\\\//, '/')
        unescaped.gsub!('\n', "\n")
        unescaped.gsub!('\076', '>')
        unescaped.gsub!('\074', '<')
        # js encodes non-ascii characters.
        unescaped.gsub!(PATTERN_UNICODE_ESCAPED_CHAR) {|u| [$1.hex].pack('U*')}
        unescaped
      end
    end
  end
end