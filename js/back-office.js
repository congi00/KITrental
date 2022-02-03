// Vars
var boolUtil = true; // TEMP SOLUTION, UGLY NAME TO RETHINK
var previousValue = "";
var typingTimer;
var loggedIn = false;

$(function() {
    // Set the height of the image sections to the remaining space left by the navbar
    if(window.location.href.indexOf("back-office.html") > -1)
      $(".navbar #navbarSupportedContent").addClass("d-none");
    $("[id$='-section']").css("height", $(window).height() - parseInt($("nav").css("height")) + "px");

    // Event Listeners for delete and update client data buttons
    $(".bi-x-circle").on("click", deleteRecord);
    $("#updateData").on("click", updateRecordInfo);
    $("#createRecord").on("click", createRecord);
    $("#searchObjects").on("keyup", typingLogic);
    $("#searchClients").on("keyup", typingLogic);

    // Library Components
    dateRangePicker();
});

function createRecord() {
  var el = this;
  var fields = $($(el).closest("form")).find("input, select, textarea");
  var createRecordCollection = $(el).data("collection");

  // JavaScript object to pass as data to update in the POST request
  var toCreateObject = {};
  fields.each(function() {
    toCreateObject[$(this).data('db-field')] = $(this).val();
  });

  if (createRecordCollection === 'operations') {
    toCreateObject['linkedTo_id'] = $(this).data('rental');

    if (toCreateObject['type'] === 'rent_confirm') {
      // don't know if it's gonna be used, WE ALREADY HAVE A "Create new rental" feature
    } else if (toCreateObject['type'] === 'rent_close') {

      /* ANOTHER AJAX REQUEST FOR EDITING PRODUCT AVAILABILITY AND STATE WHEN AN EMPLOYEE CONFIRMS THE RENT CLOSING */
      var objectID = toCreateObject['object_id'].substring(toCreateObject['object_id'].indexOf("id=") + 3);
      var toUpdateObject = {};
      toUpdateObject['avaiability'] = toCreateObject['avaiability'];
      toUpdateObject['state'] = toCreateObject['state'];
      delete toCreateObject.avaiability;
      delete toCreateObject.state;
      delete toCreateObject.object_id;

       // Update AJAX Request
       $.ajax({
        url: "../modules/db-update.php",
        type: "POST",
        data: {colName: 'inventory', recordId: objectID, toUpdateData: toUpdateObject },
        success: function (response) {
          console.log(response)
          if (response == 1) {
          } else {
            alert("There was an error.");
          }
        },
      });
    }
  }

  // Create AJAX Request
  $.ajax({
    url: "../modules/db-create.php",
    type: "POST",
    data: {colName: createRecordCollection, toCreateData: toCreateObject},
    success: function (response) {
      if (response == 1) {
        alert("New rental was added");
        location.reload();
      } else {
        alert("There was an error.");
      }
    },
  });
}

function updateRecordInfo() {
  var el = this;

  var updateRecordCollection = $(el).data("collection");

  var startDate = $(el).siblings("input[data-db-field='starting_date']").val();
  if (updateRecordCollection === 'clients' || ( updateRecordCollection === 'rental' && new Date(startDate) > new Date() ) || updateRecordCollection === 'inventory' ) {
    if (boolUtil) {
      $(el).siblings("input").attr("readonly", false);
      $(el).siblings("select").attr("disabled", false);
      // IF TIME LEFT, SAVE A COPY OF THE DATA, CONFRONT IT WITH THE EDITED ONE BEFORE SUBMITTING, IF EQUAL NO QUERY (OPTIMIZATION)
      $(el).html("Save Updated Data");
      boolUtil = false;

    } else {
      // Get input elements and ID of the record to update
      var fields = $($(this).closest("form")).find("input");
      var selections = $($(this).closest("form")).find("select");
      var updateRecord = $(el).data("id");

      // JavaScript object to pass as data to update in the POST request
      var toUpdateObject = {};
      fields.each(function() {
        toUpdateObject[$(this).data('db-field')] = $(this).val();
      });
      selections.each(function() {
        toUpdateObject[$(this).data('db-field')] = $(this).val();
      });

      // Update AJAX Request
      $.ajax({
        url: "../modules/db-update.php",
        type: "POST",
        data: {colName: updateRecordCollection, recordId: updateRecord, toUpdateData: toUpdateObject },
        success: function (response) {
          console.log(response)
          if (response == 1) {

            // Put everything back to read-only

            //$(el).html("Update Data");
            //$(el).siblings("input").attr("readonly", true);
            boolUtil = true;
            location.reload(); // !!!!! TO CHECK ACCESSIBILITY !!!!!!
          } else {
            alert("There was an error.");
          }
        },
      });
    }
  } else  {
    alert("You can't modify past/active rental.");
  }
}

function deleteRecord() {
  var el = this;

  // Delete user ID
  var deleteRecordCollection = $(el).data("collection");
  var deleteRecord = $(el).data("id");

  // Delete operation validation (client only if got no rentals, rental only active or future)
  var errMsg = "";
  var toDelete = true;
  if (deleteRecordCollection === 'rental') {
    var startDate = $($(el).closest("tr")).find("td[data-id='start_date']").html();
    if (new Date(startDate) > new Date()) {
      toDelete = false;
      errMsg = "You can't delete past/active rental.";
    }
  }
  if (deleteRecordCollection === 'clients') {
    $.ajax({
      async: false,
      url: "../modules/db-read.php",
      type: "GET",
      data: {colName: 'rental', searchTerm : deleteRecord, singleResult: false, fieldName: 'client_id'},
      success: function (response) {
        if (jQuery.parseJSON(response).length) {
          toDelete = false;
          errMsg = "You can't delete clients with active/booked rental.";
        }
      },
    });
  }


  var startDate = $($(el).closest("tr")).find("td[data-id='start_date']").html();
  if (toDelete) {
    var confirmalert = confirm("Are you sure?");
    if (confirmalert == true) {
      // AJAX Request
      $.ajax({
        url: "../modules/db-delete.php",
        type: "POST",
        data: {colName: deleteRecordCollection, userId : deleteRecord},
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
  } else  {
    alert(errMsg);
  }
}

function typingLogic() {
  // if we are not clicking any non-modifying keys (e.g. arrows)
  if ($(this).val() != previousValue) {
      clearTimeout(typingTimer); // resets the timer
      // if we are writing
      if ($(this).val()) {
        typingTimer = setTimeout(getResults, 750, $(this).val(), $(this).data('collection'), false, $(this).data('field-search'), $(this).attr("list")); // start the timeout
      // if we are erasing the field
      } else {
          // empty the results div
          $("#" + $(this).attr("list")).html("");
      }
      previousValue = $(this).val();
  }
}

function getResults(val, collection, single, field, dataList) {
  $.ajax({
    url: "../modules/db-read.php",
    type: "GET",
    data: {colName: collection, searchTerm : val, singleResult: single, fieldName: field},
    success: function (response) {
      // Conversion from String to JSON object
      var obj = jQuery.parseJSON(response);
      $("#" + dataList).html("");
      $.each(obj, function() {
        $("#" + dataList).append("<option value='" + this[field] + " id=" + this["_id"]["$oid"] + "'>"); // Matching title Object from the inventory, displayed with title and ID
      })
    },
  });
}

function displayEdits(sel) {
  if (sel.value == "rent_confirm") {
    $("#rentClose").hide();
    $("#rentConfirm").show();
  } else if(sel.value == "rent_close") {
    $("#rentConfirm").hide();
    $("#rentClose").show();
  }
}

function dateRangePicker() {
  $(function() {
    $('input[id="dateRange"]').daterangepicker({
      timePicker : true,
      opens: 'left',
      locale: {
        format: 'M/DD hh:mm A'
      }
    }, function(start, end, label) {
      console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
    });
  });
}

function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

function showResult(str) {
  if (str.length==0)
    $(".prods").each(function(){
      $(this).show();
    });
  else
    $(".prods").each(function(){
      if($(".card h2",this).text().toLowerCase().search(str)!=-1)
        $(this).show();
      else
        $(this).hide();
    });
}



$(document).ready(function(){
  if(window.location.href.indexOf("backoffice") > -1){
    if(loggedIn){
      $("body").append('\
        <div class="container-fluid h-100">\
            <div class="row h-100">\
                <div id="clients-section" class="col-12 col-lg-4 bg-primary sectionsBack">\
                    <a href="page-templates\back-office\clients.php" class="w-100 h-100">\
                        <h1 class="text-white text-uppercase">Clients</h1>\
                    </a>\
                </div>\
                <div id="inventory-section" class="col-12 col-lg-4 bg-secondary sectionsBack">\
                    <a href="page-templates\back-office\inventory.php" class="w-100 h-100">\
                        <h1 class="text-white text-uppercase">Inventory</h1>\
                    </a>\
                </div>\
                <div id="rental-section" class="col-12 col-lg-4 bg-success sectionsBack">\
                    <a href="page-templates\back-office\rental.php" class="w-100 h-100">\
                        <h1 class="text-white text-uppercase">Rental</h1>\
                    </a>\
                </div>\
            </div>\
        </div>');
    }else{
      $("body").append('\
      <div class="container-fluid h-100">\
          <div class="row h-100" id="backendLogin">\
              <div class="col-12 col-lg-7">\
                <div id="titleCF">\
                  <h2 class="text-white display-3 text-center ">Welcome in the</h2>\
                </div>\
                <div id="titleCS">\
                  <h2 class="text-white display-3 text-center ">Back Office</h2>\
                </div>\
                <button class="btn btn-dark btn-lg" id="noLogIn">Guest access</button>\
              </div>\
              <div class="col-12 col-lg-5">\
                <form id="formEmployees" action="page-templates/back-office/authentication.php">\
                  <div class="text-center">\
                    <img src="/img/logos/KITrental-logos_black.png" alt="logo">\
                  </div>\
                  <h3 class="fw-normal mb-2 pb-3 mt-4 pt-4 text-center" style="letter-spacing: 1px;">Log in</h3>\
                  <div class="form-outline mb-3">\
                    <label class="form-label" for="emplId">Email address</label>\
                    <input type="email" name="emplId" id="emplUsername" class="form-control form-control-md" required>\
                  </div>\
                  <div class="form-outline mb-4">\
                    <label class="form-label" for="emplPw">Password</label>\
                    <input type="password" name="emplPw" id="emplPassword" class="form-control form-control-md" required>\
                  </div>\
                  <div class="pt-1 mb-4">\
                    <button class="btn btn-info btn-lg btn-block btn-dark" type="button">Login</button>\
                  </div>\
                  <p class="small mb-5 pb-lg-2 text-center"><a class="text-muted" href="#!">Forgot password?</a></p>\
                </form>\
              </div>\
          </div>\
        </div>');
    }



    $( ".sectionsBack" ).each(function(){
      $(this).hover(function(){
        $(this).css("background-size","300%");
        $("a h1",this).css("fontSize","4.5rem");
      },function(){
        $(this).css("background-size","250%");
        $("a h1",this).css("fontSize","4rem");
      });
    });

    $("#formEmployees .btn").click(function(e) {
      var form = $("#formEmployees");
      var actionUrl = form.attr('action');

      if(!isEmail($("input[type='email']").val())){
        $("#formEmployees h3").text("Log in - Insert valid email !");
        $("#formEmployees h3").addClass("text-danger");
      }else if($("input[type='password']").val() == ""){
        $("#formEmployees h3").text("Log in - Insert password !");
        $("#formEmployees h3").addClass("text-danger");
      }else{
        $.ajax({
            type: "POST",
            url: actionUrl,
            data: form.serialize(), // serializes the form's elements.
            success: function(data){
              if(data==false){
                $("#formEmployees h3").text("Log in - Wrong data inserted !");
                $("#formEmployees h3").addClass("text-danger");
              }else
                location.reload();// show response from the php script.
            },
            error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
            }
        });
      }
    });
  }
});
