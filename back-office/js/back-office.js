
// Vars
var boolUtil = true; // TEMP SOLUTION, UGLY NAME TO RETHINK
var previousValue = "";
var typingTimer;
let loggedin;
//var bcrypt = dcodeIO.bcrypt;

$(function() {
    (sessionStorage.getItem("usr_id")== null)?loggedIn=false:loggedIn=true;
    // Set the height of the image sections to the remaining space left by the navbar
    if(window.location.href.indexOf("back-office.html") > -1)
      $(".navbar #navbarSupportedContent").addClass("d-none");
    $("[id$='-section']").css("height", $(window).height() - parseInt($("nav").css("height")) + "px");

    // Event Listeners for delete and update client data buttons
    // $(".bi-x-circle").on("click", deleteRecord);
    // $("#updateData").on("click", updateRecordInfo);
    // $("#createRecord").on("click", createRecord);
    // $("#searchObjects").on("keyup", typingLogic);
    // $("#searchClients").on("keyup", typingLogic);

    // Functions
    showHome();

    // Library Components
    dateRangePicker();
});

function showHome() {
  if(window.location.href.indexOf("backoffice") > -1){
    $('nav').hide();
    document.getElementById("content").innerHTML = "";

    if(loggedIn){
      $("#content").append('\
        <div class="container-fluid">\
            <div class="row">\
                <div id="clients-section" class="col-12 col-lg-4 bg-primary">\
                    <a onclick="$(\'nav\').show(); showClients(); return false;" class="w-100 h-100">\
                        <h1 class="text-white text-uppercase">Clients</h1>\
                    </a>\
                </div>\
                <div id="inventory-section" class="col-12 col-lg-4 bg-secondary">\
                    <a onclick="$(\'nav\').show(); showInventory(); return false;" class="w-100 h-100">\
                        <h1 class="text-white text-uppercase">Inventory</h1>\
                    </a>\
                </div>\
                <div id="rental-section" class="col-12 col-lg-4 bg-success">\
                    <a onclick="$(\'nav\').show(); showRental(); return false;" class="w-100 h-100">\
                        <h1 class="text-white text-uppercase">Rental</h1>\
                    </a>\
                </div>\
            </div>\
        </div>');
    }else{
      $("#content").append('\
      <div class="container-fluid">\
          <div class="row" style="height:100vh;" id="backendLogin">\
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
                <form id="formEmployees" action="http://localhost:8000/API/login">\
                  <div class="text-center">\
                    <img src="/img/logos/KITrental-logos_black.png" alt="logo">\
                  </div>\
                  <h3 class="fw-normal mb-2 pb-3 mt-4 pt-4 text-center" style="letter-spacing: 1px;">Log in</h3>\
                  <div class="form-outline mb-3">\
                    <label class="form-label" for="emplUsername">Email address</label>\
                    <input type="email" name="emplUsername" id="emplUsername" class="form-control form-control-md" required>\
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
        var formdata = {
            'emplUsername': $("input[type='email']").val(),
            'emplPassword': $("input[type='password']").val()
        };
        $.ajax({
            type: "POST",
            url: actionUrl,
            data: JSON.stringify(formdata),
            dataType: "json",
            contentType: "application/json",
            success: function(data){
              if(data.password==false){
                $("#formEmployees h3").text("Log in - Wrong data inserted !");
                $("#formEmployees h3").addClass("text-danger");
              }else{
                sessionStorage.setItem('usr_id', data.id);
                location.reload();// show response from the php script.
              }
            },
            error: function (xhr, ajaxOptions, thrownError) {
              console.log(xhr);
              console.log(thrownError);
            }
        });
      }
    });
  }
}

function authentication(employees,formData){
  for(var i = 0; i < employees.length; i++)
    if(employees[i].username == formData[0].value && employees[i].password == bcrypt.hashSync(formData[0].value, 14)){
      console.log(employees[i].password == bcrypt.hashSync(formData[0].value, 14));
      //return true;
    }else{
      console.log(employees[i].password == bcrypt.hashSync(formData[0].value, 14));
    }
  //return false;
}

// Retrieve and display all the clients
function showClients() {
  $.ajax({
    url: "API/clients/",
    type: "GET",
    success: res => {
      var content = document.getElementById("content");
      content.innerHTML = "";
      var container = document.createElement('div');
      container.className = "container table-wrapper pt-5";
      var tbl = document.createElement('table');
      tbl.className = "table table-light table-hover";
      var thd = document.createElement('thead');
      $(thd).append(`
        <tr class="table-light">
          <th>Username</th>
          <th>Address</th>
          <th>Archive</th>
          <th>Delete</th>
        </tr>`)
      var tbdy = document.createElement('tbody');
      $.each(res.clients, (i, client) => {
        $(tbdy).append(`
          <tr class="table-light">
            <td>${client.username}</td>
            <td>${client.address}</td>
            <td><a onclick="singleClient('${client._id}'); return false;"><i class="bi bi-box-arrow-up-right" style="color: brown; cursor: pointer;"></i></a></td>
            <td><i onclick="deleteRecord('clients', '${client._id}', this);" class="bi bi-x-circle" style="color: red; cursor: pointer;"></i></td>
          </tr>`);
      })
      tbl.appendChild(thd);
      tbl.appendChild(tbdy);
      content.appendChild(container).appendChild(tbl);
    },
  });
}

// Retrieve and display one single client
function singleClient(id) {
  $.ajax({
    url: "API/clients/" + id,
    type: "GET",
    success: res => {
      var client = res.client;
      var content = document.getElementById("content");
      content.innerHTML = "";
      $(content).append(`
        <div class="row">
          <div class="col-md-4 p-5 d-flex align-items-center">
              <img class="img-fluid img-thumbnail" src="${client.avatar ? client.avatar : 'img/profile-placeholder.png'}" alt="Client profile photo">
          </div>
          <div class="col-md-8 p-5">
              <form action="">
                  <label for="clientUsername" class="form-label">Client's Username</label>
                  <input type="text" data-db-field="username" class="form-control mb-3" id="clientUsername" value="${client.username ? client.username : ''}" readonly>

                  <label for="clientEmailAddress" class="form-label">Client's Email Address</label>
                  <input type="email" data-db-field="email" class="form-control mb-3" id="clientEmailAddress" value="${client.email ? client.email : ''}" readonly>

                  <label for="clientAddress" class="form-label">Client's Address</label>
                  <input type="text" data-db-field="address" class="form-control mb-4" id="clientAddress" value="${client.address ? client.address : ''}" readonly>

                  <label for="clientNotes" class="form-label">Client's Notes</label>
                  <textarea type="text" data-db-field="notes" class="form-control mb-4" id="clientNotes" readonly>${client.notes ? client.notes : ''}</textarea>

                  <button id="updateData" onclick="updateRecordInfo('clients', '${client._id}', this)" type="button" class="btn btn-primary">Update Data</button>
              </form>
          </div>
        </div>`)

      var q = {'client_id' : id}
      $.ajax({
        url: "API/rental/",
        type: "GET",
        data: {query: q},
        success: res => {
          if (res.rental.length) {
            var divRow = document.createElement('div');
            divRow.className = "row rental-cards-group px-5 pb-5";
            var rented_product = {};
            $.each(res.rental, (i, rental) => {
              $.ajax({
                async: false,
                url: "API/inventory/" + rental.product_id,
                type: "GET",
                success: res => {
                  rented_product = res.products
                }
              });
              $(divRow).append(`
                <div class="card" style="width: 18rem; cursor:pointer;" onclick="singleRental('${rental._id}');">
                  <img src="/img/products/${rented_product.image}" class="card-img-top" alt="Product Image">
                  <div class="card-body">
                    <h5 class="card-title">Card title</h5>
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                  </div>
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item">Start: ${rental.start_date ? new Date(rental.start_date).toLocaleString() : ''}</li>
                    <li class="list-group-item">End: ${rental.end_date ? new Date(rental.end_date).toLocaleString() : ''}</li>
                  </ul>
                </div>`);
            });
            content.appendChild(divRow);
          }
        },
      });
    },
  });
}

// Retrieve and display all the rental
function showRental() {
  $.ajax({
    url: "API/rental/",
    type: "GET",
    success: res => {
      var content = document.getElementById("content");
      content.innerHTML = "";
      var container = document.createElement('div');
      container.className = "container table-wrapper pt-5";
      var contentHTML = `
        <ul class="nav nav-tabs" id="myTab" role="tablist">
          <li class="nav-item" role="presentation">
              <button class="nav-link active" id="cur-fut-tab" data-bs-toggle="tab" data-bs-target="#cur-fut" type="button" role="tab" aria-controls="cur-fut" aria-selected="false">Current/Future</button>
          </li>
          <li class="nav-item" role="presentation">
              <button class="nav-link" id="past-tab" data-bs-toggle="tab" data-bs-target="#past" type="button" role="tab" aria-controls="past" aria-selected="true">Past</button>
          </li>
        </ul>
        <div class="tab-content" id="myTabContent">
          <div class="tab-pane fade show active" id="cur-fut" role="tabpanel" aria-labelledby="cur-fut-tab">`
      var tbl = document.createElement('table');
      var past_tbl = document.createElement('table');
      tbl.className = "table table-light table-hover";
      past_tbl.className = "table table-light table-hover";
      var thd = document.createElement('thead');
      var past_thd = document.createElement('thead');
      $(thd).append(`
        <tr class="table-light">
          <th>Start Date</th>
          <th>End Date</th>
          <th>Archive</th>
          <th>Client</th>
          <th>Delete</th>
        </tr>`)
      $(past_thd).append(`
        <tr class="table-light">
          <th>Start Date</th>
          <th>End Date</th>
          <th>Archive</th>
          <th>Client</th>
        </tr>`)
      var tbdy = document.createElement('tbody');
      var past_tbdy = document.createElement('tbody');
      var curr_date = new Date();
      $.each(res.rental, (i, rental) => {
        if (curr_date > new Date(rental.end_date)) {
          $(past_tbdy).append(`
            <tr class="table-light">
              <td>${new Date(rental.start_date).toLocaleString()}</td>
              <td>${new Date(rental.end_date).toLocaleString()}</td>
              <td><a onclick="singleRental('${rental._id}'); return false;"><i class="bi bi-box-arrow-up-right" style="color: brown; cursor: pointer;"></i></a></td>
              <td><a onclick="singleClient('${rental.client_id}'); return false;"><i class="bi bi-person-square" style="color: brown; cursor: pointer;"></i></a></td>
            </tr>`);
        } else {
          $(tbdy).append(`
            <tr class="table-light">
              <td>${new Date(rental.start_date).toLocaleString()}</td>
              <td>${new Date(rental.end_date).toLocaleString()}</td>
              <td><a onclick="singleRental('${rental._id}'); return false;"><i class="bi bi-box-arrow-up-right" style="color: brown; cursor: pointer;"></i></a></td>
              <td><a onclick="singleClient('${rental.client_id}'); return false;"><i class="bi bi-person-square" style="color: brown; cursor: pointer;"></i></a></td>
              <td><i onclick="deleteRecord('rental', '${rental._id}', this);" class="bi bi-x-circle" style="color: red; cursor: pointer;" data-collection="rental" data-id="${rental._id}"></i></td>
            </tr>`);
        }

      })
      tbl.appendChild(thd);
      tbl.appendChild(tbdy);
      past_tbl.appendChild(past_thd);
      past_tbl.appendChild(past_tbdy);
      contentHTML += tbl.outerHTML + '</div><div class="tab-pane fade" id="past" role="tabpanel" aria-labelledby="past-tab">' + past_tbl.outerHTML + '</div></div>';
      $(container).append(contentHTML);
      content.appendChild(container);

      var body = `
        <div class="mb-3">
          <label for="searchObjects" class="form-label">Object Rented</label>
          <input required class="form-control" list="objectsList" id="searchObjects" onkeyup="typingLogic(this)" data-collection="inventory" data-field-search="name" data-db-field="product_id" placeholder="Type to search...">
          <datalist id="objectsList"></datalist>
        </div>
        <div class="mb-3">
            <label for="searchClients" class="form-label">Client Renting</label>
            <input required class="form-control" list="clientsList" id="searchClients" onkeyup="typingLogic(this)" data-collection="clients" data-field-search="username" data-db-field="client_id" placeholder="Type to search...">
            <datalist id="clientsList"></datalist>
        </div>
        <div class="mb-3">
            <label for="rentalStartDate" class="form-label">Rental Starting Date</label>
            <input required type="datetime-local" data-db-field="start_date" class="form-control mb-3" id="rentalStartDate">

            <label for="rentalEndDate" class="form-label">Rental Ending Date</label>
            <input required type="datetime-local" data-db-field="end_date" class="form-control mb-3" id="rentalEndDate">
        </div>`
      $(content).append(createModal(body))

      // Event listeners
      $(document).off("click", "#createRecord")
      $(document).on("click", "#createRecord", function createRental(){
        createRecord('rental', '', this)
      });
      var myModalEl = document.getElementById('staticBackdrop')
      myModalEl.addEventListener('hidden.bs.modal', function (event) {
        showRental();
      })
    },
  });
}

// Retrieve and display one single rental
function singleRental(id) {
  $.ajax({
    url: "API/rental/" + id,
    type: "GET",
    success: res => {
      var rental = res.rental;
      var content = document.getElementById("content");
      content.innerHTML = "";
      var rented_product = {};
      $.ajax({
        async: false,
        url: "API/inventory/" + rental.product_id,
        type: "GET",
        success: res => rented_product = res.products
      });

      var renting_client = {};
      $.ajax({
        async: false,
        url: "API/clients/" + rental.client_id,
        type: "GET",
        success: res => renting_client = res.client
      });

      $(content).append(`
        <div class="row">
          <div class="col-md-6 p-5">
              <!-- Display Rented Object -->
              <div class="row mb-4">
                <div class="col-md-6 d-flex colsRental">
                  <h2>Rented Product</h2>
                  <div class="thumbnail-wrapper">
                    <img class="img-fluid img-thumbnail" src="${rented_product.image ? '/img/products/' + rented_product.image : ''}" alt="Rented Product photo">
                  </div>
                  <h2>${rented_product.name ? rented_product.name : ''}</h2>
                </div>
                <div class="col-md-6 d-flex colsRental">
                  <h2>Renting Client</h2>
                  <div class="thumbnail-wrapper">
                    <img class="img-fluid img-thumbnail" src="/img/${renting_client.image ? renting_client.image : 'profile-placeholder.png'}" alt="Rented Product photo">
                  </div>
                  <h2>${renting_client.username ? renting_client.username : ''}</h2>
                </div>
              </div>
          </div>

          <!-- Display Rental Data -->
          <div class="col-md-6 p-5" style="width: 50%;">
              <form action="">
                  <label for="rentalStartDate" class="form-label">Starting Date</label>
                  <input type="datetime-local" data-db-field="start_date" class="form-control mb-3" id="rentalStartDate" value="${new Date(rental.start_date).toISOString().slice(0,16)}" readonly>

                  <label for="rentalEndDate" class="form-label">Ending Date</label>
                  <input type="datetime-local" data-db-field="end_date" class="form-control mb-3" id="rentalEndDate" value="${new Date(rental.end_date).toISOString().slice(0,16)}" readonly>

                  <!-- If the end date is in the future, add a button to modify and update the rental data -->
                  ${(new Date() < new Date(rental.end_date)) ? '<button id="updateData" onclick="updateRecordInfo(\'rental\', \'' + rental._id + '\', this)" type="button" class="btn btn-primary" data-collection="rental">Update Data</button>' : ''}
              </form>
          </div>
        </div>`)

      var q = {'rental_id' : id}
      $.ajax({
        url: "API/operations/",
        type: "GET",
        data: {query: q},
        success: res => {
          if (res.operations.length) {
            var divRow = document.createElement('div');
            divRow.className = "row rental-cards-group px-5 pb-5";
            $.each(res.operations, (i, op) => {
            $(divRow).append(`
              <div class="card" style="width: 18rem;">
                <div class="card-body">
                  <h5 class="card-title">${op.type ? op.type : ''}</h5>
                  <p class="card-text">${op.notes ? op.notes : ''}</p>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">Employee ${op.employee_id ? op.employee_id : ''}</li>
                </ul>
              </div>`);
            });
            content.appendChild(divRow);
          }
        },
      });

      var rented_product = {};
      $.ajax({
        async: false,
        url: "API/inventory/" + rental.product_id,
        type: "GET",
        success: res => rented_product = res.products
      });

      var body = `
        <div class="mb-3">
          <label for="operationType" class="form-label">Type of Operation</label>
          <select required class="form-select" id="operationType" data-db-field="type" onchange="displayEdits(this);">
              <!-- <option value="rent_create">Create Rent</option>
              <option value="rent_update">Update Rent</option> -->
              <option value="rent_confirm">Rent Confirmation</option>
              <option value="rent_close">Close Rent Confirmation</option> <!-- THIS SEEMS TO BE THE ONLY NEEDED ONE -->
          </select>
        </div>

        <!-- Possible fields to edit in case of a rental confirmation operation -->
        <div class="mb-3" id="rentConfirm">
          <label for="searchObjects" class="form-label">Object Rented</label>
          <input required class="form-control" list="objectsList" id="searchObjects" onkeyup="typingLogic(this)" value="${rented_product.name} id=${rented_product._id}" data-collection="inventory" data-field-search="name" data-db-field="product_id" placeholder="Type to search...">
          <datalist id="objectsList"></datalist>
        </div>

        <!-- Possible fields to edit in case of a rental closing operation -->
        <div class="mb-3" id="rentClose" style="display: none;">
          <div class="mb-3">
              <label for="productAvaiability" class="form-label">Avaiability</label>
              <select id="productAvaiable" class="form-select" name="avaiability" data-db-field="avaiability">
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
              </select>
          </div>
          <div class="mb-3">
              <label for="productState" class="form-label">State</label>
              <input id="productState" class="form-control" type="text" name="state" data-db-field="state" value="${rented_product.state}">
          </div>
        </div>
        <div class="mb-3">
            <label for="operationNotes" class="form-label">Notes</label>
            <textarea class="form-control" list="clientsList" id="operationNotes" data-db-field="notes" placeholder="Type to search...">
            </textarea>
        </div>`
      $(content).append(createModal(body))
      $(document).off("click", "#createRecord")
      $(document).on("click", "#createRecord", function(){
        createRecord('operations', id, this)
      });

      var myModalEl = document.getElementById('staticBackdrop')
      myModalEl.addEventListener('hidden.bs.modal', function (event) {
        singleRental(id);
      })
    },
  });
}

// Retrieve and display all the products
function showInventory() {
  $.ajax({
    url: "API/inventory/",
    type: "GET",
    success: res => {
      var content = document.getElementById("content");
      content.innerHTML = "";
      var container = document.createElement('div');
      container.className = "container table-wrapper pt-5";
      var tbl = document.createElement('table');
      tbl.className = "table table-light table-hover";
      var thd = document.createElement('thead');
      $(thd).append(`
        <tr class="table-light">
          <th>Name</th>
          <th>Image</th>
          <th>Avaiability</th>
          <th>State</th>
          <th>Price</th>
          <th>Archive</th>
          <th>Delete</th>
        </tr>`)
      var tbdy = document.createElement('tbody');
      $.each(res.products, (i, product) => {
        $(tbdy).append(`
          <tr class="table-light">
            <td>${product.name}</td>
            <td><img src="../img/products/${product.image}" width="30vw"></td>
            <td>${product.avaiability}</td>
            <td>${product.state}</td>
            <td>${product.price}</td>
            <td><a onclick="singleInventory('${product._id}'); return false;"><i class="bi bi-box-arrow-up-right" style="color: brown; cursor: pointer;"></i></a></td>
            <td><i onclick="deleteRecord('inventory', '${product._id}', this);" class="bi bi-x-circle" style="color: red; cursor: pointer;"></i></td>
          </tr>`);
      })
      tbl.appendChild(thd);
      tbl.appendChild(tbdy);
      content.appendChild(container).appendChild(tbl);

      var body = `
        <div class="mb-3">
          <label for="productName" class="form-label">Name</label>
          <input required class="form-control" id="productName" placeholder="Barbeque" data-db-field="name">
        </div>
        <div class="mb-3">
          <label for="productImage" class="form-label">Image</label>
          <input required class="form-control" id="productImage" placeholder="[image].[format]" data-db-field="image">
        </div>
        <div class="mb-3">
          <label for="productAval" class="form-label">Availability</label>
          <select class="form-select" id="productAval" aria-label="Select Availability" data-db-field="avaiability">
            <option selected>Open this select menu</option>
            <option value="available">Available</option>
            <option value="unavaiable">Unavailable</option>
          </select>
        </div>
        <div class="mb-3">
          <label for="productState" class="form-label">State</label>
          <select class="form-select" id="productState" aria-label="Select State" data-db-field="state">
            <option selected>Open this select menu</option>
            <option value="new">New</option>
            <option value="perfect">Perfect</option>
            <option value="good">Good</option>
            <option value="broken">Broken</option>
          </select>
        </div>
        <div class="mb-3">
          <label for="productDesc" class="form-label">Description</label>
          <textarea class="form-control" id="productDesc" rows="3" data-db-field="description"></textarea>
        </div>
        <div class="mb-3">
          <label for="productCat" class="form-label">Category</label>
          <select class="form-select" id="productCat" aria-label="Select Category" data-db-field="category">
            <option selected>Open this select menu</option>
            <option value="Professional">Professional</option>
            <option value="Household">Household</option>
          </select>
        </div>
        <div class="mb-3">
          <label for="productPrice" class="form-label">Price</label>
          <div class="input-group">
          <span class="input-group-text">$</span>
          <input type="text" class="form-control" id="productPrice" aria-label="Price in dollars" data-db-field="price">
          </div>
        </div>`
      $(content).append(createModal(body))

      // Event listeners
      $(document).off("click", "#createRecord")
      $(document).on("click", "#createRecord", function(){
        createRecord('inventory', '', this)
      });
      var myModalEl = document.getElementById('staticBackdrop')
      myModalEl.addEventListener('hidden.bs.modal', function (event) {
        showInventory();
      })
    },
  });
}

// Retrieve and display one single product
function singleInventory(id) {
  var stateEnum = {
         new: "new",
         perfect: "perfect",
         good: "good",
         broken: "broken"
  };
  $.ajax({
    url: "API/inventory/" + id,
    type: "GET",
    success: res => {
      var product = res.products;
      var content = document.getElementById("content");
      content.innerHTML = "";
      $(content).append(`
        <div class="row">
          <div class="col-md-4 p-5">
              <img class="img-fluid img-thumbnail" src="../img/products/${product.image ? product.image : 'img/profile-placeholder.png'}" alt="Product profile photo">
          </div>
          <div class="col-md-8 p-5">
              <form action="">
                  <label for="productName" class="form-label">Product's name</label>
                  <input type="text" data-db-field="name" class="form-control mb-3" id="productName" value="${product.name ? product.name : ''}" readonly>

                  <label for="productAvaiability" class="form-label">Product's avaiability</label><br>
                  <select id="productAvaiability" name="avaiability" data-db-field="avaiability" disabled>
                    <option value="${product.avaiability ? product.avaiability : ''}">${product.avaiability ? product.avaiability : ''}</option>
                    <option value="${product.avaiability=='avaiable' ? 'unavaiable' : 'avaiable'}">${product.avaiability=='avaiable' ? 'unavaiable' : 'avaiable'}</option>
                  </select><br>

                  <label for="productPrice" class="form-label">Price</label>
                  <input type="number" data-db-field="price" class="form-control mb-3" id="productPrice" value="${product.price ? product.price : ''}" readonly>

                  <button id="updateData" onclick="updateRecordInfo('inventory', '${product._id}', this)" type="button" class="btn btn-primary">Update Data</button>
              </form>
          </div>
        </div>`)

      /*var q = {'product_id' : id}
      $.ajax({
        url: "API/rental/",
        type: "GET",
        data: {query: q},
        success: res => {
          if (res.rental.length) {
            var divRow = document.createElement('div');
            divRow.className = "row rental-cards-group px-5";
            $.each(res.rental, (i, rental) => {
            $(divRow).append(`
              <div class="card" style="width: 18rem;">
                <img src="..." class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title">Card title</h5>
                  <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">${rental.start_date ? rental.start_date : ''}</li>
                  <li class="list-group-item">${rental.end_date ? rental.end_date : ''}</li>
                  <li class="list-group-item">A third item</li>
                </ul>
                <div class="card-body">
                  <a href="#" class="card-link">Card link</a>
                  <a href="#" onclick="singleRental(${rental._id}); return false;"><i class="bi bi-box-arrow-up-right" style="color: brown; cursor: pointer;"></i></a>
                </div>
              </div>`);
            });
            content.appendChild(divRow);
          }
        },
      });*/
    },
  });
}

// Retrieve and display all the promotions
function showPromotions() {
  $.ajax({
    url: "API/promotions/",
    type: "GET",
    success: res => {
      var content = document.getElementById("content");
      content.innerHTML = "";
      var container = document.createElement('div');
      container.className = "container table-wrapper pt-5";
      var tbl = document.createElement('table');
      tbl.className = "table table-light table-hover";
      var thd = document.createElement('thead');
      $(thd).append(`
        <tr class="table-light">
          <th>Name</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Percentage</th>
          <th>Delete</th>
        </tr>`)
      var tbdy = document.createElement('tbody');
      console.log(res.promotions)
      $.each(res.promotions, (i, prom) => {
        $(tbdy).append(`
          <tr class="table-light">
            <td>${prom.name}</td>
            <td>${new Date(prom.start_date).toLocaleString()}</td>
            <td>${new Date(prom.end_date).toLocaleString()}</td>
            <td>${prom.percentage}</td>
            <td><i onclick="deleteRecord('promotions', '${prom._id}', this);" class="bi bi-x-circle" style="color: red; cursor: pointer;"></i></td>
          </tr>`);
      })
      tbl.appendChild(thd);
      tbl.appendChild(tbdy);
      content.appendChild(container).appendChild(tbl);

      var body = `
      <div class="mb-3">
        <label for="promotionName" class="form-label">Name</label>
        <input required class="form-control" id="promotionName" placeholder="Christmas" data-db-field="name">
      </div>
      <div class="mb-3">
          <label for="promotionStartDate" class="form-label">Promotion Start Date</label>
          <input required type="datetime-local" data-db-field="start_date" class="form-control mb-3" id="promotionStartDate">
  
          <label for="promotionEndDate" class="form-label">Promotion End Date</label>
          <input required type="datetime-local" data-db-field="end_date" class="form-control mb-3" id="promotionEndDate">
      </div>
      <div class="mb-3">
        <label for="salePercentage" class="form-label">Sale Percentage</label>
        <div class="input-group">
        <span class="input-group-text">%</span>
        <input type="text" class="form-control" id="salePercentage" aria-label="Sale Percentage" data-db-field="percentage">
        </div>
      </div>`
    $(content).append(createModal(body))
  
    // Event listeners
    $(document).off("click", "#createRecord")
    $(document).on("click", "#createRecord", function(){
      createRecord('promotions', '', this)
    });
    var myModalEl = document.getElementById('staticBackdrop')
    myModalEl.addEventListener('hidden.bs.modal', function (event) {
      showPromotions();
    })
    },
  });
}
function createModal(body) {
  return `
    <!-- Button trigger modal -->
    <button type="button" class="btn btn-primary btn-add-rental" data-bs-toggle="modal" data-bs-target="#staticBackdrop"><i class="bi bi-plus"></i></button>

    <!-- Modal -->
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">Add a Record</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form action="" autocomplete="off">
                    <div class="modal-body">
                        <div class="container-fluid">
                          ${body}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" id="createRecord" data-bs-dismiss="modal" class="btn btn-primary">Save Operation</button>
                    </div>
                </form>
            </div>
        </div>
    </div>`
}

function createRecord(col, id, el) {
  var fields = $($(el).closest("form")).find("input, select, textarea");

  // JavaScript object to pass as data to update in the POST request
  var toCreateObject = {};
  fields.each(function() {
    // Turns an ID string in the BSON Object
    var val = $(this).val()
    if (val.includes('id=')) {
      var index = val.indexOf("id=") + 3
      val = val.substring(index)
    }
    toCreateObject[$(this).data('db-field')] = val;
  });

  if (col === 'operations') {
    //creation of operetion closed etc.
    toCreateObject['rental_id'] = id;
    toCreateObject['employee_id'] = sessionStorage.getItem("usr_id");


    if (toCreateObject['type'] === 'rent_confirm') {
      // don't know if it's gonna be used, WE ALREADY HAVE A "Create new rental" feature
    } else if (toCreateObject['type'] === 'rent_close') {

      /* ANOTHER AJAX REQUEST FOR EDITING PRODUCT AVAILABILITY AND STATE WHEN AN EMPLOYEE CONFIRMS THE RENT CLOSING */
      var productID = toCreateObject['product_id'].substring(toCreateObject['product_id'].indexOf("id=") + 3);
      var toUpdateObject = {};
      toUpdateObject['avaiability'] = toCreateObject['avaiability'];
      toUpdateObject['state'] = toCreateObject['state'];
      delete toCreateObject.avaiability;
      delete toCreateObject.state;
      delete toCreateObject.product_id;

       // Update AJAX Request
       $.ajax({
        url: "API/inventory/" + productID,
        type: "PATCH",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(toUpdateObject),
        success: function (response) {
          console.log(response)
          if (response) {
          } else {
            alert("There was an error.");
          }
        },
      });
      //create invoice
      
      /*$.ajax({
        url: "API/rental/" + toCreateObject['rental_id'],
        type: "GET",
        contentType: "application/json",
        success: function (response) {
          console.log(response)
          if (response) {
            
          } else {
            alert("There was an error.");
          }
        },
      });*/
      

    }
  }
  if (col === 'rental') {
    toCreateObject['state'] = 'Accepted';

    $.ajax({
      url: "API/invoice/",
      type: "POST",
      contentType: "application/json",
      dataType: "json",      
      data: JSON.stringify({ 
        rentals_id: [],
        client_id: " ",
        product_id: " ",
        end_date: new Date(),
        client_name:" ",
        client_surname:" ",
        client_address:" ",
        client_payment:"Cash",
        total: 0
      }),
      success: function (response) {
        if (response) {     
          toCreateObject['invoice_id'] = response.invoice._id;
          $.ajax({
            url: "API/" + col + "/",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(toCreateObject),
            success: function (response) {
              if (response) {
              } else {
                alert("There was an error.");
              }
            },
          });
        } else {
          alert("There was an error.");
        }
      },
      error: function(err){
        console.log(err);
      }
    });
    return;
  }
  
  // Create AJAX Request
  $.ajax({
    url: "API/" + col + "/",
    type: "POST",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(toCreateObject),
    success: function (response) {
      if (response) {
      } else {
        alert("There was an error.");
      }
    },
  });
}

function updateRecordInfo(col, id, el) {
  var startDate = $(el).siblings("input[data-db-field='start_date']").val();
  if (col === 'clients' || ( col === 'rental' && new Date(startDate) > new Date() ) || col === 'inventory' ) {
    if (boolUtil) {
      $(el).siblings("input, textarea").attr("readonly", false);
      $(el).siblings("select").attr("disabled", false);
      // IF TIME LEFT, SAVE A COPY OF THE DATA, CONFRONT IT WITH THE EDITED ONE BEFORE SUBMITTING, IF EQUAL NO QUERY (OPTIMIZATION)
      $(el).html("Save Updated Data");
      boolUtil = false;

    } else {
      // Get input elements and ID of the record to update
      var fields = $($(el).closest("form")).find("input, textarea, select");

      // JavaScript object to pass as data to update in the POST request
      var toUpdateObject = {};
      fields.each(function() {
        toUpdateObject[$(this).data('db-field')] = $(this).val();
      });

      // Update AJAX Request
      $.ajax({
        url: "API/" + col + "/" + id,
        type: "PATCH",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(toUpdateObject),
        success: function (response) {
          if (response) {
            console.log(response);
            // Put everything back to read-only
            $(el).html("Update Data");
            $(el).siblings("input, textarea").attr("readonly", true);
            $(el).siblings("select").attr("disabled", true);
            boolUtil = true;
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

function deleteRecord(col, id, el) {

  // Delete operation validation (client only if got no rentals, rental only active or future)
  var errMsg = "";
  var toDelete = true;
  if (col === 'rental') {
    var startDate = $($(el).closest("tr")).find("td[data-id='start_date']").html();
    if (new Date(startDate) > new Date()) {
      toDelete = false;
      errMsg = "You can't delete past/active rental.";
    }
  }

  if (col === 'clients') {
    var q = {'client_id' : id}
    $.ajax({
      async: false,
      url: "API/rental/",
      type: "GET",
      data: {query: q},
      success: function (response) {
        if (response) {
          toDelete = false;
          errMsg = "You can't delete clients with active/booked rental.";
        }
      },
    });
  }

  if (toDelete) {
    var confirmalert = confirm("Are you sure?");
    if (confirmalert == true) {
      // AJAX Request
      $.ajax({
        url: "API/" + col + "/" + id,
        type: "DELETE",
        success: function (response) {
          if (response) {
            // Remove row from HTML Table
            $(el).closest("tr").css("--bs-table-bg", "red");
            $(el)
              .closest("tr")
              .fadeOut(800, function () {
                $(this).remove();
              });
          }else{
            alert("Invalid ID.");
          }
        },
      });
    }
  } else  {
    alert(errMsg);
  }
}

function typingLogic(el) {
  // if we are not clicking any non-modifying keys (e.g. arrows)
  if ($(el).val() != previousValue) {
      clearTimeout(typingTimer); // resets the timer
      // if we are writing
      if ($(el).val()) {
        typingTimer = setTimeout(getResults, 300, $(el).val(), $(el).data('collection'), $(el).data('field-search'), $(el).attr("list")); // start the timeout
      // if we are erasing the field
      } else {
          // empty the results div
          $("#" + $(el).attr("list")).html("");
      }
      previousValue = $(el).val();
  }
}

function getResults(val, col, field, dataList) {
  var q = {field : val};
  $.ajax({
    url: "API/" + col + "/",
    type: "GET",
    data: {query: q},
    success: res => {
      // Conversion from String to JSON object
      $("#" + dataList).html("");
      $.each(res[Object.keys(res)[0]], function() {
        $("#" + dataList).append("<option value='" + this[field] + " id=" + this["_id"] + "'>"); // Matching title Object from the inventory, displayed with title and ID
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
