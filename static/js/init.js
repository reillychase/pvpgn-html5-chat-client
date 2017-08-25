(function($){
  $(function(){
	$('select').material_select();
    $('.dropdown-button').dropdown();
	$("[data-activates=nav-mobile]").sideNav({
	closeOnClick: true
	});
	$("[data-activates=chatroom-mobile]").sideNav({
	closeOnClick: true,
	edge: 'right'
	});

  $('.collapsible').collapsible();
  }); // end of document ready
})(jQuery); // end of jQuery name space
