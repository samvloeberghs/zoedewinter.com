$(document).ready(function(){
    $(document).on('click', '.hamburger', function(e){
        e.preventDefault();
        $('header').toggleClass('active');
        return false;
    });
});