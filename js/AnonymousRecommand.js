(function ($) {	
	var elem = document.getElementById('Rslider');
	$('#Rslider').css( "width", $('#wrapper').width()*0.89 );	
	/* height will be set at index.js after Rslider.remove("dom_hidden") */
	window.RecommandSwipe = Swipe(elem, {
		// startSlide: 4,
		// auto: 3000,
		// continuous: true,
		// disableScroll: true,
		// stopPropagation: true,
		// callback: function(index, element) {},
		// transitionEnd: function(index, element) {}
	});
	
	$(document).on('click', '#swipe_left', function(event){
		RecommandSwipe.prev();
	});
	$(document).on('click', '#swipe_right', function(event){
		RecommandSwipe.next();
	});
	$(document).on('click', '#recommand_user_icon', function(event){
		alertify.alert('已寄送邀請給該群組管理員');
		/*
		$('#recommand_title').html('Groupack推薦您可能與您有相同興趣的資料蒐集者');
		$('#Rslider').addClass('dom_hidden');
		$('#swipe_left').addClass('dom_hidden');
		$('#swipe_right').addClass('dom_hidden');
		$('#recommand_user_area').removeClass('dom_hidden');		
		*/
	});
})(jQuery);