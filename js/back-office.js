$(function() {
    // Set the height of the image sections to the remaining space left by the navbar 
    $("[id$='-section']").css("height", $(window).height() - parseInt($("nav").css("height")) + "px");
    $(".bi-pencil-square").on("click", editClientInfo);
    $(".bi-x-circle").on("click", deleteClient);
});

function editClientInfo() {
    console.log(this);
}

function deleteClient() {
    var el = this;
  
   // Delete user
   var deleteUser = $(this).data('user');
 
   var confirmalert = confirm("Are you sure?");
   if (confirmalert == true) {
      // AJAX Request
      $.ajax({
        url: '../modules/db-remove.php',
        type: 'POST',
        data: { username:deleteUser },
        success: function(response){

          if(response == 1){
	    // Remove row from HTML Table
	    $(el).closest('tr').css('background','red');
	    $(el).closest('tr').fadeOut(800,function(){
	       $(this).remove();
	    });
          }else{
	    alert('Invalid ID.');
          }

        }
      });
   }
}