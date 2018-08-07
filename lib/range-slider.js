$.fn.RangeSlider = function(cfg){
  this.sliderCfg = {
    min: cfg && !isNaN(parseFloat(cfg.min)) ? Number(cfg.min) : null,
    max: cfg && !isNaN(parseFloat(cfg.max)) ? Number(cfg.max) : null,
    step: cfg && Number(cfg.step) ? cfg.step : 1,
    callback: cfg && cfg.callback ? cfg.callback : null
  };

  var $input = $(this);
  var min = this.sliderCfg.min;
  var max = this.sliderCfg.max;
  var step = this.sliderCfg.step;
  var callback = this.sliderCfg.callback;

  $input.attr('min', min)
    .attr('max', max)
    .attr('step', step);

  $input.bind("input", function(e){
    $input.attr('value', this.value);
    if(e.currentTarget.dataset.type=='shine'){
        $input.css( 'background', 'linear-gradient(to right, #EF7F5D, #f5f5f5 ' + this.value + '%, #ccc)' );
    }else if(e.currentTarget.dataset.type=='color'){
        $input.css( 'background', 'linear-gradient(to right, #98afce, #EF7F5D, #f5f5f5 ' + this.value + '%, #ccc)' );
    }else if(e.currentTarget.dataset.type=='saturation'){
	    $input.css( 'background', 'linear-gradient(to right, #EF7F5D, #f5f5f5 ' + this.value + '%, #ccc)' );
    }

    if ($.isFunction(callback)) {
      callback(this);
    }
  });
}
