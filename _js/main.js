/* ----------------------------------------------------------------------------------
	Global javascript
	
	Encoding:	UTF-8
	Author:		Juan G. Hurtado
	e-Mail:		juan.g.hurtado@gmail.com

---------------------------------------------------------------------------------- */

if (typeof jQuery != "undefined") {
	
	jQuery(function() {
		var $current = jQuery('ul#nav li.current'),
			initialleft = $current[0].offsetLeft,
			initialwidth = $current[0].offsetWidth;
		
		var $marker = jQuery('<span class="current-mark" />');
		
		$current.append($marker.css({
			left : initialleft,
			width : initialwidth
		}));
		
		jQuery('ul#nav li a').bind('mouseenter', function() {
			var $element = jQuery(this);
			
			var t = setTimeout(function() {
				var $actual = $element.parent(),
					actualleft = $actual[0].offsetLeft,
					actualwidth = $actual[0].offsetWidth;

				$marker.animate({
					left : actualleft,
					width : actualwidth
				}, 400);
			},150);
			
			$element.data('timer', t);
		})
		.bind('mouseout', function() {
			clearInterval(jQuery(this).data('timer'));
		})
		.parents('ul#nav').bind('mouseleave', function() {
			$marker.animate({
				left : initialleft,
				width : initialwidth
			});
		});
		
	});
	
}