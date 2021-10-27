// Vars
var boolUtil = true; // TEMP SOLUTION, UGLY NAME TO RETHINK

$(function() {
    // Set the height of the image sections to the remaining space left by the navbar 
    $("[id$='-section']").css("height", $(window).height() - parseInt($("nav").css("height")) + "px");
    
    // Event Listeners for delete and edit client data buttons
    $(".bi-x-circle").on("click", deleteRecord);
    $("#editData").on("click", editRecordInfo);
});

function editRecordInfo() {
  var el = this;

  if (boolUtil) {
    $(el).siblings("input").attr("readonly", false);
    // IF TIME LEFT, SAVE A COPY OF THE DATA, CONFRONT IT WITH THE EDITED ONE BEFORE SUBMITTING, IF EQUAL NO QUERY (OPTIMIZATION)
    $(el).html("Save Edited Data");
    boolUtil = false;

  } else {
    // HARD CODED FIELDS, REMEMBER TO MAKE IT DYNAMIC (MAYBE)
    var fields = $(el).siblings("input");
    var editUser = $(el).data("id");
    
    // JavaScript object to pass as data to edit in the POST request
    var toEditObject = { 
      'username' : fields[0].value,
      'email' : fields[1].value,
      'address' : fields[2].value
    }

    // AJAX Request
    $.ajax({
      url: "../modules/db-edit.php",
      type: "POST",
      data: {colName: 'clients', userId: editUser, toEditData: toEditObject },
      success: function (response) {
        if (response == 1) {
          // Put everything back to read-only
          $(el).html("Edit Data");
          $(el).siblings("input").attr("readonly", true);
          boolUtil = true;
        } else {
          alert("There was an error.");
        }
      },
    });
  }
}

function deleteRecord() {
  var el = this;

  // Delete user ID
  var deleteUser = $(el).data("id");

  var confirmalert = confirm("Are you sure?");
  if (confirmalert == true) {
    // AJAX Request
    $.ajax({
      url: "../modules/db-remove.php",
      type: "POST",
      data: {colName: 'clients', userId : deleteUser },
      success: function (response) {
        if (response == 1) {
          // Remove row from HTML Table
          $(el).closest("tr").css("--bs-table-bg", "red");
          $(el)
            .closest("tr")
            .fadeOut(800, function () {
              $(this).remove();
            });
        } else {
          alert("Invalid ID.");
        }
      },
    });
  }
}