
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
    
    if(sessionStorage.getItem("usr_id")){
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
                <button class="btn btn-dark btn-lg" id="noLogIn" onclick="$(\'nav\').show(); showInventory(); return false;">Guest access</button>\
              </div>\
              <div class="col-12 col-lg-5">\
                <form id="formEmployees" action="/API/login">\
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
                sessionStorage.setItem('auth', data.auth);
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
    beforeSend: xhr => {
      xhr.setRequestHeader('auth', sessionStorage.getItem('auth'))
    },
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
      var body = `
        <div class="mb-3">
          <label for="clientUsername" class="form-label">Client's Username</label>
          <input required id="clientUsername" class="form-control" data-db-field="username" placeholder="mariorossi">
        </div>
        <div class="mb-3">
          <label for="clientPassword" class="form-label">Client's Password</label>
          <input required id="clientPassword" class="form-control" data-db-field="password" placeholder="password">
        </div>
        <div class="mb-3">
            <label for="clientName" class="form-label">Client's Name</label>
            <input required id="clientName" class="form-control" data-db-field="name" placeholder="Mario">
        </div>
        <div class="mb-3">
            <label for="clientSurname" class="form-label">Client's Surname</label>
            <input required id="clientSurname" class="form-control" data-db-field="surname" placeholder="Rossi">
        </div>
        <div class="mb-3">
            <label for="clientAddress" class="form-label">Client's Address</label>
            <input required id="clientAddress" class="form-control" data-db-field="address" placeholder="Piazza Roma">
        </div>
        <div class="mb-3">
            <label for="clientMail" class="form-label">Client's Mail</label>
            <input required id="clientMail" class="form-control" data-db-field="email" placeholder="mariorossi@gmail.com">
        </div>
        <div class="mb-3">
          <label for="clientInterests" class="form-label">Client's Interests</label>
          <select class="form-select" id="clientInterests" aria-label="Select State" data-db-field="interests">
            <option selected>Open this select menu</option>
            <option value="Professional">Professional</option>
            <option value="Household">Household</option>
          </select>
        </div>
        <div class="mb-3">
          <label for="clientPayment" class="form-label">Client's Payment</label>
          <select class="form-select" id="clientPayment" aria-label="Select State" data-db-field="payment">
            <option selected>Open this select menu</option>
            <option value="Cash">Cash</option>
            <option value="Credit">Credit</option>
          </select>
        </div>
        <div class="mb-3">
            <label for="clientNotes" class="form-label">Client's Notes</label>
            <textarea required id="clientNotes" class="form-control" data-db-field="notes" placeholder="Insert notes here..."></textarea>
        </div>`
      $(content).append(createModal(body))
    
      // Event listeners
      $(document).off("click", "#createRecord")
      $(document).on("click", "#createRecord", function createClient(){
        createRecord('clients', '', this)
      });
    },
  });
}

// Retrieve and display one single client
function singleClient(id) {
  var authToken = sessionStorage.getItem('auth')
  $.ajax({
    url: "API/clients/" + id,
    type: "GET",
    beforeSend: xhr => {
      xhr.setRequestHeader('auth', authToken)
    },
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
        data: q,
        beforeSend: xhr => {
          xhr.setRequestHeader('auth', authToken)
        },
        success: res => {
          if (res.rental.length) {
            var divRow = document.createElement('div');
            divRow.className = "row rental-cards-group px-5 pb-5";
            var rented_products = {};
            $.each(res.rental, (i, rental) => {
              $.ajax({
                async: false,
                url: "API/inventory/many/" + rental.products_id.toString(),
                type: "GET",
                beforeSend: xhr => {
                  xhr.setRequestHeader('auth', authToken)
                },
                success: res => {
                  rented_products = res.products
                  var rented_products_names = rented_products.map(prod => prod.name)
                  rented_products_names.join(", ")
                  $(divRow).append(`
                  <div class="card" style="width: 18rem; cursor:pointer;" onclick="singleRental('${rental._id}');">
                    <img src="/img/products/${rented_products[0].image}" class="card-img-top" alt="Product Image">
                    <div class="card-body">
                      <h5 class="card-title">${rented_products_names ? rented_products_names : 'Products Names'}</h5>
                      <p class="card-text">${rented_products[0].description ? rented_products[0].description : 'Product Description'}</p>
                    </div>
                    <ul class="list-group list-group-flush">
                      <li class="list-group-item">Start: ${rental.start_date ? new Date(rental.start_date).toLocaleString() : ''}</li>
                      <li class="list-group-item">End: ${rental.end_date ? new Date(rental.end_date).toLocaleString() : ''}</li>
                    </ul>
                  </div>`);
                }
              });
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
    beforeSend: xhr => {
      xhr.setRequestHeader('auth', sessionStorage.getItem('auth'))
    },
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
          <th>Invoice</th>
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
              <td><a href=""><i class="bi bi-receipt" style="color: brown; cursor: pointer;"></i></a></td>
            </tr>`);
        } else {
          $(tbdy).append(`
            <tr class="table-light">
              <td data-id="start_date">${new Date(rental.start_date).toLocaleString()}</td>
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
          <button class="btn-add-product" onclick="addProductField(this)">+</button>
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
        </div>
        <div class="mb-3">
          <label for="rentalState" class="form-label">State</label>
          <select class="form-select" id="rentalState" aria-label="Select State" data-db-field="state">
            <option selected>Open this select menu</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Active">Active</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Closed">Closed</option>
          </select>
        </div>`
      $(content).append(createModal(body))

      // Event listeners
      $(document).off("click", "#createRecord")
      $(document).on("click", "#createRecord", function createRental(){
        createRecord('rental', '', this)
      });
    },
  });
}

// Retrieve and display one single rental
function singleRental(id) {
  var authToken = sessionStorage.getItem('auth')
  $.ajax({
    url: "API/rental/" + id,
    type: "GET",
    beforeSend: xhr => {
      xhr.setRequestHeader('auth', authToken)
    },
    success: res => {
      var rental = res.rental;
      var content = document.getElementById("content");
      content.innerHTML = "";
      var rented_products = {};
      var renting_client = {};

      $.ajax({
        url: "API/inventory/many/" + rental.products_id.toString(),
        type: "GET",
        beforeSend: xhr => {
          xhr.setRequestHeader('auth', authToken)
        },
        success: res => {
          rented_products = res.products
          $.ajax({
            url: "API/clients/" + rental.client_id,
            type: "GET",
            beforeSend: xhr => {
              xhr.setRequestHeader('auth', authToken)
            },
            success: res => {
              renting_client = res.client
              var rented_productsHTML = ` `
              var rented_productsHTML_confirm = ` `
              var rented_productsArr = []
              rented_products.forEach((prod, i) => {
                rented_productsArr.push(`${rented_products[i].name} id=${rented_products[i]._id}`)
                // Generate HTML for displaying rented products in single rental
                rented_productsHTML += `
                  <a href="javascript:singleInventory('${prod._id}');" style="max-width: calc(25% - 1rem);">
                    <div class="prod-thumbnail-wrapper">
                      <img class="img-fluid prod-img-thumbnail img-thumbnail" src="${prod.image ? '/img/products/' + prod.image : ''}" alt="Rented Product photo" />
                    </div>
                    <h2>${prod.name ? prod.name : ''}</h2>
                    </a>`
                
                // Generate HTML for displaying rented products in rental confirm operation
                rented_productsHTML_confirm += `
                <label for="${rented_products[i].name}" class="form-label">Product ${i+1}</label>
                    <input required class="form-control" list="objectsList" id="${rented_products[i].name}" onkeyup="typingLogic(this)" value="${rented_productsArr[i]}" data-collection="inventory" data-field-search="name" data-db-field="product_id" placeholder="Type to search...">
                    <datalist id="objectsList"></datalist>`
              })
              console.log(rented_productsHTML)

              $(content).append(`
                <div class="row">
                  <div class="col-md-6 p-5">
                    <h2>Rented Products</h2>
                    <div class="d-flex colsRental">
                      ${rented_productsHTML}
                    </div>
                  </div>
                  <div class="col-md-3 p-5">
                      <!-- Display Rented Object -->
                        <div class="d-flex colsRental">
                          <a href="javascript:singleClient('${renting_client._id}');" class="client-wrapper">
                            <h2>Renting Client</h2>
                            <div class="thumbnail-wrapper">
                              <img class="img-fluid img-thumbnail" src="/img/${renting_client.image ? renting_client.image : 'profile-placeholder.png'}" alt="Rented Product photo">
                            </div>
                            <h2>${renting_client.username ? renting_client.username : ''}</h2>
                          </a>
                        </div>
                  </div>

                  <!-- Display Rental Data -->
                  <div class="col-md-3 p-5">
                      <form action="">
                          <label for="rentalStartDate" class="form-label">Starting Date</label>
                          <input type="datetime-local" data-db-field="start_date" class="form-control mb-3" id="rentalStartDate" value="${new Date(rental.start_date).toISOString().slice(0,16)}" readonly>

                          <label for="rentalEndDate" class="form-label">Ending Date</label>
                          <input type="datetime-local" data-db-field="end_date" class="form-control mb-3" id="rentalEndDate" value="${new Date(rental.end_date).toISOString().slice(0,16)}" readonly>

                          <div class="mb-3">
                            <label for="rentalState" class="form-label">State</label>
                            <select class="form-select" id="rentalState" aria-label="Select State" data-db-field="state" disabled>
                              <option value="Pending" ${rental.state == "Pending" ? 'selected' : ''}>Pending</option>
                              <option value="Accepted" ${rental.state == "Accepted" ? 'selected' : ''}>Accepted</option>
                              <option value="Active" ${rental.state == "Active" ? 'selected' : ''}>Active</option>
                              <option value="Confirmed" ${rental.state == "Confirmed" ? 'selected' : ''}>Confirmed</option>
                              <option value="Closed" ${rental.state == "Closed" ? 'selected' : ''}>Closed</option>
                            </select>
                          </div>
                          <!-- If the end date is in the future, add a button to modify and update the rental data -->
                          ${(new Date() < new Date(rental.start_date)) ? `
                            <button id="updateData" onclick="updateRecordInfo('rental', '${rental._id}', this)" type="button" class="btn btn-primary" data-collection="rental">Update Data</button>
                            <button id="updateData" onclick="deleteRecord('rental', '${rental._id}', this); showRental();" type="button" class="btn btn-danger" data-collection="rental">Delete Rental</button>
                            ` : ''}
                      </form>
                  </div>
                </div>
                `)
                
              body = `
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
                  <div class="mb-3">
                    ${rented_productsHTML_confirm}
                  </div>
                  <div class="mb-3" id="rentPenalty" style="display:none;">
                    <button type="button" onclick='addPenalty(this, ${JSON.stringify(rented_productsArr)})' class="btn btn-primary" data-count="0">Add Penalty</button>
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
            }
          });
        }
      })
      

      var q = {'rental_id' : id}
      $.ajax({
        url: "API/operations/",
        type: "GET",
        data: q,
        beforeSend: xhr => {
          xhr.setRequestHeader('auth', authToken)
        },
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
    },
  });
}

// Retrieve and display all the products
function showInventory(){
  $.ajax({
    url: "API/inventory/",
    type: "GET",
    beforeSend: xhr => {
      xhr.setRequestHeader('auth', sessionStorage.getItem('auth'))
    },
    success: res => {
      var content = document.getElementById("content");
      content.innerHTML = "";
      var container = document.createElement('div');
      container.className = "container table-wrapper pt-5";

      $(container).append('\
      <div class="container pb-3 mb-sm-1 inventory-search-wrapper">\
        <i class="bi bi-search" style="margin-right: 0.5rem;"></i>\
        <input id="livesearch" type="text" size="30" onkeyup="showResult(this.value.toLowerCase())" placeholder="Search products">\
      <div id="productsInventory" class="row"></div>');

      var tbl = document.createElement('table');
      tbl.className = "table table-light table-hover";
      var thd = document.createElement('thead');
      var loggedin = sessionStorage.getItem("usr_id")
      $(thd).append(`
        <tr class="table-light ">
          <th>Name</th>
          <th>Image</th>
          <th>Avaiability</th>
          <th>State</th>
          <th>Price</th>
          <th>Archive</th>
          ${loggedin ? '<th>Delete</th>' : ''}
        </tr>`)
      var tbdy = document.createElement('tbody');
      $.each(res.products, (i, product) => {
        $(tbdy).append(`
          <tr class="table-light prods" >
            <td class="filterProd">${product.name}</td>
            <td><img src="../img/products/${product.image}" width="30vw"></td>
            <td>${product.avaiability}</td>
            <td>${product.state}</td>
            <td>${product.price}</td>
            <td><a onclick="singleInventory('${product._id}'); return false;"><i class="bi bi-box-arrow-up-right" style="color: brown; cursor: pointer;"></i></a></td>
            ${loggedin ? '<td><i onclick="deleteRecord(\'inventory\', \'' + product._id + '\', this);" class="bi bi-x-circle" style="color: red; cursor: pointer;"></i></td>' : ''}
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
        </div>
        <div class="mb-3">
          <label for="productQty" class="form-label">Quantity</label>
          <div class="input-group">
          <input type="number" class="form-control" id="productQty" aria-label="Product Quantity" data-db-field="quantity">
          </div>
        </div>`
      if (loggedin) $(content).append(createModal(body))

      // Event listeners
      $(document).off("click", "#createRecord")
      $(document).on("click", "#createRecord", function(){
        createRecord('inventory', '', this)
      });
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
    beforeSend: xhr => {
      xhr.setRequestHeader('auth', sessionStorage.getItem('auth'))
    },
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

                  
                  <label for="rentalStartDate" class="form-label">Unavailability Starting Date</label>
                  <input required type="datetime-local" data-db-field="startD" class="form-control mb-3" id="productStartDate">
      
                  <label for="rentalEndDate" class="form-label">Unavailability Ending Date</label>
                  <input required type="datetime-local" data-db-field="endD" class="form-control mb-3" id="productEndDate">
                  

                  <label for="productPrice" class="form-label">Price</label>
                  <input type="number" data-db-field="price" class="form-control mb-3" id="productPrice" value="${product.price ? product.price : ''}" readonly>

                  ${sessionStorage.getItem("usr_id") ? '<button id="updateData" onclick="updateRecordInfo(\'inventory\', \''+product._id+'\', this)" type="button" class="btn btn-primary">Update Data</button>' : ''}
              </form>
          </div>
        </div>`)
    },
  });
}

// Retrieve and display all the promotions
function showPromotions() {
  $.ajax({
    url: "API/promotions/",
    type: "GET",
    beforeSend: xhr => {
      xhr.setRequestHeader('auth', sessionStorage.getItem('auth'))
    },
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
    },
  });
}

function addProductField(btn) {
  var fieldHTML = `
    <input required style="margin-top:0.5rem;" class="form-control" list="objectsList" onkeyup="typingLogic(this)" data-collection="inventory" data-field-search="name" data-db-field="product_id" placeholder="Type to search...">
    <datalist id="objectsList"></datalist>`
    console.log(btn)
  $(fieldHTML).insertBefore(btn)
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
                        <button type="button" id="createRecord" data-bs-dismiss="modal" class="btn btn-primary">Save Record</button>
                    </div>
                </form>
            </div>
        </div>
    </div>`
}

function createRecord(col, id, el) {
  var fields = $($(el).closest("form")).find("input, select, textarea");
  var authToken = sessionStorage.getItem('auth')

  // JavaScript object to pass as data to update in the POST request
  var toCreateObject = {};
  if (col === 'rental' || col === 'operations') toCreateObject['products_id'] = []
  if (col === 'operations') {
    toCreateObject['penalties_prods'] = []
    toCreateObject['penalties_days'] = []
  }
  fields.each(function() {
    // Turns an ID string in the BSON Object
    var val = $(this).val()
    if (val.includes('id=')) {
      var index = val.indexOf("id=") + 3
      val = val.substring(index)
    }
    if (col === 'rental' && col === 'operations' && $(this).data('db-field') === 'product_id') {
      toCreateObject['products_id'].push(val)
    } else if (col === 'operations' && toCreateObject['type'] === 'rent_close') {

      // Collecting penalties data 
      if ($(this).data('db-field') === 'penalty_prod')
        toCreateObject['penalties_prods'].push(val)
      else if ($(this).data('db-field') === 'penalty_days')
        toCreateObject['penalties_days'].push(val)

    } else {
      toCreateObject[$(this).data('db-field')] = val;
    }
  });

  if (col === 'inventory') {
    toCreateObject['creation_date'] = new Date();
  }

  if (col === 'operations') {
    //creation of operation closed etc.
    toCreateObject['rental_id'] = id;
    toCreateObject['employee_id'] = sessionStorage.getItem("usr_id");


    if (toCreateObject['type'] === 'rent_confirm') {
      // don't know if it's gonna be used, WE ALREADY HAVE A "Create new rental" feature
    } else if (toCreateObject['type'] === 'rent_close') {
      console.log(toCreateObject)
      var updInventoryID = toCreateObject['product_id'];
      /* ANOTHER AJAX REQUEST FOR EDITING PRODUCT AVAILABILITY AND STATE WHEN AN EMPLOYEE CONFIRMS THE RENT CLOSING */
      var toUpdateObject = {};
      // toUpdateObject['avaiability'] = toCreateObject['avaiability'];
      
      toUpdateObject['indisponibilityDates'] = [...{startD : toCreateObject['startD'],startD : toCreateObject['endD']}];
      toUpdateObject['state'] = toCreateObject['state'];
      toUpdateObject['startD'] = toCreateObject['startD'];
      toUpdateObject['endD'] = toCreateObject['endD'];
      // delete toCreateObject.avaiability;
      delete toCreateObject.state;
      delete toCreateObject.start_date;
      delete toCreateObject.end_date;
      delete toCreateObject.product_id;

       // Update AJAX Request
       $.ajax({
        url: "API/inventory/" + updInventoryID,
        type: "PATCH",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(toUpdateObject),
        beforeSend: xhr => {
          xhr.setRequestHeader('auth', authToken)
        },
        success: function (response) {
          if (response) {
            $.ajax({
              url: "API/invoice/",
              type: "POST",
              contentType: "application/json",
              dataType: "json",      
              data: JSON.stringify({ 
                rental_id: toCreateObject['rental_id'],
                end_date: new Date(),
                filePdf : toCreateObject['rental_id']
              }),
              beforeSend: xhr => {
                xhr.setRequestHeader('auth', authToken)
              },
              success: function (response) {
                if (response) {  
                  console.log(response)
                  $.ajax({
                    url: "API/rental/" + id,
                    type: "GET",
                    beforeSend: xhr => {
                      xhr.setRequestHeader('auth', authToken)
                    },
                    success: res => {
                      const rntl = res.rental;
                      $.ajax({
                        url: "API/inventory/" + updInventoryID,
                        type: "PATCH",
                        contentType: "application/json",
                        dataType: "json",
                        data: JSON.stringify({indisponibilityDates : [...{startD: rntl.start_date,endD: rntl.end_date}]}),
                        success:{}
                      });
                      $.ajax({
                        url: "API/clients/" + rntl.client_id,
                        type: "GET",
                        beforeSend: xhr => {
                          xhr.setRequestHeader('auth', authToken)
                        },
                        success: res => {
                          const clnt = res.client;
                          const clientInfo = {
                              client_name: res.client.name,
                              client_surname: res.client.surname,
                              client_address: res.client.address,
                              client_payment: res.client.payment,
                          }
                          $.ajax({
                            url: "API/inventory/" + rntl.product_id,
                            type: "GET",
                            beforeSend: xhr => {
                              xhr.setRequestHeader('auth', authToken)
                            },
                            success: async res => {
                              const finalPrice = await calcPrice(rntl.price, new Date(rntl.start_date), new Date(rntl.end_date),clnt._id)
                              console.log(finalPrice)
                              const productInfo = {
                                product_name: res.products.name,
                                product_image: res.products.image,
                                product_state: res.products.state,
                                product_price: res.products.price,
                                product_category: res.products.category,
                                total: rntl.price
                              }
                            
                              $.ajax({
                                url: "API/invoice/pdf/",
                                type: "POST",
                                contentType: "application/json",
                                dataType: "json",
                                data: JSON.stringify({
                                  clientInfo,
                                  productInfo
                                }),
                                beforeSend: xhr => {
                                  xhr.setRequestHeader('auth', authToken)
                                },
                                success: function (response) {
                                  if (response) {
                                  } else {
                                    alert("There was an error.");
                                  }
                                },      
                                error: function(err){
                                  console.log(err);
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                 
                } else {
                  alert("There was an error.");
                }
              },
              error: function(err){
                console.log(err);
              }
            });
          } else {
            alert("There was an error.");
          }
        },
        error: function(err){
          console.log(err);
        }
      });
      //fill invoice
      
      /*var rentID = response.rental._id; 
      $.ajax({
        url: "API/invoice/"+toCreateObject['invoice_id'],
        type: "PATCH",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
          rental_id: rentID,
        }),
        success: function (response) {
          if (response) {
          } else {
            alert("There was an error.");
          }
        },
      });*/
      console.log("s")
    }
  }
  if (col === 'rental') {
    // toCreateObject['state'] = 'Accepted';
    $.ajax({
      url: "API/inventory/many/" + toCreateObject['products_id'].toString(),
      type: "GET",
      beforeSend: xhr => {
        xhr.setRequestHeader('auth', authToken)
      },
      success: response => {
        if (response) {
          const diffInMs   = new Date(toCreateObject['end_date']) - new Date(toCreateObject['start_date'])
          const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
          var prodsSumPrice = 0
          response.products.forEach(prod => prodsSumPrice += prod.price) // Sum of products to multiply for rental days
          toCreateObject['price'] = (prodsSumPrice * diffInDays).toString()
          console.log(JSON.stringify(toCreateObject))
          $.ajax({
            url: "API/" + col + "/",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(toCreateObject),
            success: function (response) {
              if (response) {
                showRental();
              } else {
                alert("There was an error.");
              }
            },
          });
        } else {
          alert("There was an error.");
        }
      },
    });
  } else {
    console.log(toCreateObject)
    // Create AJAX Request
    $.ajax({
      url: "API/" + col + "/",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(toCreateObject),
      success: function (response) {
        if (response) {
          switch (col) {
            case 'clients' : showClients(); break;
            case 'inventory' : showInventory(); break;
            case 'promotions' : showPromotions(); break;
          }
        } else {
          alert("There was an error.");
        }
      },
    });
  }
}

/******** PRICE LOGIC *********/
// Just promotions
async function calcPrice(rental_price, rental_start_date, rental_end_date, client_id) {
  let res = await $.ajax({
    url: "API/promotions/",
    type: "GET",
    beforeSend: xhr => {
      xhr.setRequestHeader('auth', sessionStorage.getItem('auth'))
    },
    success: res => {
      var proms = res.promotions
      for (const [key, value] of Object.entries(proms)) {
        var prom_start_date = new Date(value.start_date)
        var prom_end_date = new Date(value.end_date)
        if (rental_start_date >= prom_start_date && rental_end_date <= prom_end_date) {
          var old_rental_price = rental_price 
          rental_price = old_rental_price - ( old_rental_price / 100 * value.percentage )
        }
      }
    },
  });
  return rental_price
}


function updateRecordInfo(col, id, el) {
  var startDate = $(el).siblings("input[data-db-field='start_date']").val();
  if (col === 'clients' || ( col === 'rental' && new Date(startDate) > new Date() ) || col === 'inventory' ) {
    if (boolUtil) {
      $(el).siblings("input, textarea").attr("readonly", false);
      $("select").attr("disabled", false);
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
        if(toUpdateObject["startD"]&& toUpdateObject["endD"] && !toUpdateObject["indisponibilityDates"])
          toUpdateObject["indisponibilityDates"] = [ {startD : toUpdateObject["startD"] ,endD : toUpdateObject["endD"]}]
      });

      
      console.log(toUpdateObject)
      // Update AJAX Request
      $.ajax({
        url: "API/" + col + "/" + id,
        type: "PATCH",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(toUpdateObject),
        beforeSend: xhr => {
          xhr.setRequestHeader('auth', sessionStorage.getItem('auth'))
        },
        success: function (response) {
          if (response) {
            console.log(response);
            // Put everything back to read-only
            $(el).html("Update Data");
            $(el).siblings("input, textarea").attr("readonly", true);
            $("select").attr("disabled", true);
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

async function deleteRecord(col, id, el) {
  var authToken = sessionStorage.getItem('auth')

  // Delete operation validation (client only if got no rentals, rental only active or future)
  var errMsg = "";
  var toDelete = true;
  if (col === 'rental') {
    await $.ajax({
      url: "API/rental/",
      type: "GET",
      beforeSend: xhr => {
        xhr.setRequestHeader('auth', authToken)
      },
      success: function (response) {
        if (response) {
          deleteRecord('invoice', response.rental[0].invoice_id, this);
        }
      },
    });

    var startDate = $($(el).closest("tr")).find("td[data-id='start_date']").html();
    console.log(startDate)
    if (new Date(startDate) <= new Date()) {
      toDelete = false;
      errMsg = "You can't delete active rental.";
    }
  }

  if (col === 'clients') {
    await $.ajax({
      url: "API/rental/client/" + id,
      type: "GET",
      beforeSend: xhr => {
        xhr.setRequestHeader('auth', authToken)
      },
      success: function (response) {
        console.log('clients rental retrieved')
        if (response.rental.length) {
          toDelete = false;
          errMsg = "You can't delete clients with active/booked rental.";
        }
      },
    });
  }

  console.log('clients rental retrieved outside if block')

  if (col === 'inventory') {
    await $.ajax({
      url: "API/rental/rentalByProductId/" + id,
      type: "GET",
      beforeSend: xhr => {
        xhr.setRequestHeader('auth', authToken)
      },
      success: function (response) {
        if (response.rental.length) {
          toDelete = false;
          errMsg = "You can't delete rented products but you can make them unavailable.";
        }
      },
    });
  }

  if (toDelete) {
    var confirmalert = true
    if (col !== 'invoice') confirmalert = confirm("Are you sure?");
    if (confirmalert == true) {
      // AJAX Request
      $.ajax({
        url: "API/" + col + "/" + id,
        type: "DELETE",
        beforeSend: xhr => {
          xhr.setRequestHeader('auth', authToken)
        },
        success: function (response) {
          if (response) {
            // Remove row from HTML Table
            $(el).closest("tr").css("--bs-table-bg", "red");
            $(el)
              .closest("tr")
              .fadeOut(400, function () {
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
    data: q,
    beforeSend: xhr => {
      xhr.setRequestHeader('auth', sessionStorage.getItem('auth'))
    },
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
    $("#rentPenalty").hide();
  } else if(sel.value == "rent_close") {
    $("#rentPenalty").show();
  }
}

function addPenalty(btn, rented_productsArr) {
  var count = $(btn).data("count")
  if (count < rented_productsArr.length) {
   var selOptions = ``
    rented_productsArr.forEach(prod => {
      selOptions += `
        <option value="${prod}">${prod}</option>
      `
    })
    var fieldHTML = `
      <div class="mb-3">
        <label for="penaltyProd${count+1}" class="form-label">Penalty Product</label>
        <select required id="penaltyProd${count+1}" class="form-select mb-2" data-db-field="penalty_prod">
          ${selOptions}
        </select>
        <label for="penaltyDays${count+1}" class="form-label">Penalty Days</label>
        <input type="number" class="form-control" id="penaltyDays${count+1}" min="1" max="7" data-db-field="penalty_days">
      </div>`
      console.log(btn)
    $(fieldHTML).insertBefore(btn)
    count++
    $(btn).data("count", count)
    if (count == rented_productsArr.length) btn.style.display = "none"
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
      if($(".filterProd",this).text().toLowerCase().search(str)!=-1)
        $(this).show();
      else
        $(this).hide();
    });
}
