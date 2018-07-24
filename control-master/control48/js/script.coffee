do ( $ = jQuery ) ->

  # pattern based on https://gist.github.com/chikamichi/5417680
  $.fn.floatLabels = ( method ) ->
    
    if methods[method]
      methods[method].apply( this, Array::slice.call( arguments, 1) )

    # floatLabels.make is the default method
    else if $.isPlainObject( method ) or not methods[method]
      methods.make.apply( this, arguments )

    else
      $.error( "Method #{method} does not exist on jQuery.floatLabels" )

  settings = {}

  methods =

    make : ( options ) ->

      defaults =
        floatOn     : "entry"
        activeClass : "float-label-active"
        filledClass : "float-label-filled"
        inputClass  : "float-label-input"

      settings = $.extend {}, defaults, ( options or {} )
      
      hasVal = ( el ) ->
        return el.value.length isnt 0
      
      getLabel = ( el ) ->
        return if el.id then $( "[for='#{ el.id }']" ) else $( "[for='#{ el.name }']" )

      this.addClass( settings.inputClass )

      this.each ( i, input ) ->
        $input = $( input )
        $label = getLabel( input )

        switch settings.floatOn

          when "focus"
            $input
            .bind "focus.floatLabel", ->
              $label.addClass( settings.activeClass )
            .bind "blur.floatLabel", ->
              $label.removeClass( settings.activeClass )
              if hasVal( this )
                $label.addClass( settings.filledClass )
              else
                $label.removeClass( settings.filledClass )
            .trigger( "blur.floatLabel" )
        
          when "entry"
            $input
            .bind "focus.floatLabel", ->
              if hasVal( this )
                $label.addClass( settings.activeClass )
            .bind "blur.floatLabel", ->
              if hasVal( this )
                $label.addClass( settings.filledClass ).removeClass( settings.activeClass )
            .bind "keyup.floatLabel", ->
              if hasVal( this )
                $label.addClass( settings.activeClass )
              else
                $label.removeClass( "#{settings.activeClass} #{settings.filledClass}" )
            .trigger( "blur.floatLabel" )

          else
            console.warn "Invalid floatOn option: #{ settings.floatOn }"
        
        return this

    destroy : ->

      if settings.inputClass
        this.removeClass( settings.inputClass )

      this.each ( i, input ) ->

        $input = $( input )
        $label = getLabel( input )

        $label.removeClass( "#{settings.activeClass} #{settings.filledClass}" )

        $input
        .unbind( "focus.floatLabel" )
        .unbind( "blur.floatLabel" )
        .unbind( "keydown.floatLabel" )

      return this

$( ".float-label-input-focus" ).floatLabels
  floatOn: "focus"

$( ".float-label-input-entry" ).floatLabels()

$( ".float-label-inner, .float-label-outer" ).each ( i ) ->
  console.log "each #{ i }"
  $( this ).attr "style", "-webkit-animation-delay : #{ -i * .5 }s"