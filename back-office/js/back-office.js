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
    //dateRangePicker();
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
                    <a href="" aria-label="Show Clients" onclick="$(\'nav\').show(); showClients(); return false;" class="w-100 h-100">\
                        <h1 class="text-white text-uppercase">Clients</h1>\
                    </a>\
                </div>\
                <div id="inventory-section" class="col-12 col-lg-4 bg-secondary">\
                    <a href="" aria-label="Show Inventory" onclick="$(\'nav\').show(); showInventory(); return false;" class="w-100 h-100">\
                        <h1 class="text-white text-uppercase">Inventory</h1>\
                    </a>\
                </div>\
                <div id="rental-section" class="col-12 col-lg-4 bg-success">\
                    <a href="" aria-label="Show Rental" onclick="$(\'nav\').show(); showRental(); return false;" class="w-100 h-100">\
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
                <button type="button" class="btn btn-dark btn-lg" id="noLogIn" onclick="$(\'nav\').show(); showInventory(); return false;">Guest access</button>\
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

function logOut() {
  sessionStorage.removeItem('usr_id')
  sessionStorage.removeItem('auth')
  showHome()
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
            <td><a href="" aria-label="Single Client" onclick="singleClient('${client._id}'); return false;"><i class="bi bi-box-arrow-up-right" style="color: brown; cursor: pointer;"></i></a></td>
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
      $(content).append(createModal('Add new Client', body, 'Save Client'))
    
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
      // var curr_date = new Date();
      $.each(res.rental, (i, rental) => {
        if (rental.end_date) { // rental labelled as past if they've got the end date (created on close rental operation)
          $(past_tbdy).append(`
            <tr class="table-light">
              <td>${new Date(rental.start_date).toLocaleString()}</td>
              <td>${new Date(rental.end_date).toLocaleString()}</td>
              <td><a href="" aria-label="Single Rental" onclick="singleRental('${rental._id}'); return false;"><i class="bi bi-box-arrow-up-right" style="color: brown; cursor: pointer;"></i></a></td>
              <td><a href="" aria-label="Single Client" onclick="singleClient('${rental.client_id}'); return false;"><i class="bi bi-person-square" style="color: brown; cursor: pointer;"></i></a></td>
              <td><a href="/invoices/${rental._id}.pdf"><i class="bi bi-receipt" style="color: brown; cursor: pointer;"></i></a></td>
            </tr>`);
        } else {
          $(tbdy).append(`
            <tr class="table-light ${rental.broken_product ? 'rental-alert' : ''}">
              <td data-id="start_date">${new Date(rental.start_date).toLocaleString()}</td>
              <td><a href="" aria-label="Single Rental" onclick="singleRental('${rental._id}'); return false;"><i class="bi bi-box-arrow-up-right" style="color: brown; cursor: pointer;"></i></a></td>
              <td><a href="" aria-label="Single Client" onclick="singleClient('${rental.client_id}'); return false;"><i class="bi bi-person-square" style="color: brown; cursor: pointer;"></i></a></td>
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
          <input type="text" name="daterange" class="date-picker form-control" data-db-field="product_date" />
          <button type="button" class="btn-add-product" onclick="addProductField(this)">Add Product</button>
          <button type="button" class="btn-add-multiplier" onclick="addPriceSupplement(this)">Add Multiplier</button>
        </div>
        <div class="mb-3">
            <label for="searchClients" class="form-label">Client Renting</label>
            <input required class="form-control" list="clientsList" id="searchClients" onkeyup="typingLogic(this)" data-collection="clients" data-field-search="username" data-db-field="client_id" placeholder="Type to search...">
            <datalist id="clientsList"></datalist>
        </div>
        <div class="mb-3">
            <label for="rentalStartDate" class="form-label">Rental Starting Date</label>
            <input required type="datetime-local" data-db-field="start_date" class="form-control mb-3" id="rentalStartDate">
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
      $(content).append(createModal('Add new Rental', body, 'Save Rental'))

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
                <div style="text-align:center; position: relative;" >
                  <a href="javascript:singleInventory('${prod._id}');" style="max-width: calc(25% - 1rem);">
                    <div class="prod-thumbnail-wrapper">
                      <img class="img-fluid prod-img-thumbnail img-thumbnail" src="${prod.image ? '/img/products/' + prod.image : ''}" alt="Rented Product photo" />
                    </div>
                    <h2>${prod.name ? prod.name : ''}</h2>
                  </a>
                  <input  type="text" name="daterange" class="date-picker form-control" id="pickerProd${i}" data-picker="${i}" data-db-field="product_dates" />
                  <button style="margin-top:0.5rem" id="updateData" type="button" class="btn btn-primary" data-product="${i}">Update Data</button>
                  ${rental.broken_product && prod._id == rental.broken_product.prod_id ? `
                    <div class="issueDiv">
                      <h3 style="margin-top: 0.5rem;">ISSUE!!</h3>
                      <p>The client says: ${rental.broken_product.issue}</p>
                      <p>Change the product by toggling "Change broken product" button and checking the checkbox on the right.</p>
                    </div>
                  ` : ''}
                </div>
                  `
                  // Event listener to create dateRangePicker
                  $(document).on('focus', 'input[data-picker="' + i + '"]',(event) => {
                    dateRangePicker(prod.indisponibilityDates, $('input[data-picker="' + i + '"]'), rental.datesProducts[i])
                  });
                  $(document).on('click', 'button[data-product="' + i + '"]',async (e) => {
                    
                    await updateRecordInfo('inventory', prod._id, e.target);
                    await updateRecordInfo('rental', rental._id, e.target);
                  });
                
                // Generate HTML for displaying rented products in rental confirm operation
                rented_productsHTML_confirm += `
                <label for="${rented_products[i].name}" class="form-label">Product ${i+1}</label>
                    <input required class="form-control" list="objectsList" id="${rented_products[i].name}" onkeyup="typingLogic(this)" value="${rented_productsArr[i]}" data-collection="inventory" data-field-search="name" data-db-field="product_id" placeholder="Type to search...">
                    <datalist id="objectsList"></datalist>`
              })

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
                          <div class="mb-3">
                          <button type="button" onclick='addPenalty(this,"rental",${JSON.stringify(rented_productsArr)})' class="btn btn-primary" data-count="0">Change broken product</button> 
                          </div>
                          <div class="mb-3">
                            <label for="rentalTotalPrice" class="form-label">Sale cause of broken product</label>
                            <input type="checkbox"  id="saleBrokenPrice" name="50" readonly>
                          </div>
                          <div class="mb-3">
                            <label for="rentalTotalPrice" class="form-label">Total Price</label>
                            <div class="input-group">
                              <span class="input-group-text">$</span>
                              <input type="text" data-db-field="real_price" class="form-control" id="rentalTotalPrice" value="${rental.real_price}" readonly>
                            </div>
                          </div>
                          <div class="mb-3">
                            <label for="rentalPrice" class="form-label">Discounted Price</label>
                            <div class="input-group">
                              <span class="input-group-text">$</span>
                              <input type="text" data-db-field="price" class="form-control" id="rentalPrice" value="${rental.price}" readonly>
                            </div>
                          </div>
                          ${rental.note ? `
                            <div class="mb-3">
                              <div class="single-rental-notes">
                                <h6>Notes:</h6>
                                <p>${rental.note}</p>
                              </div>
                            </div>` : ''}
                          <!-- If the end date is in the future, add a button to modify and update the rental data -->
                          ${(new Date() < new Date(rental.start_date && rental.state != 'Closed')) ? `
                            <button id="updateData" onclick="updateRecordInfo('rental', '${rental._id}', this)" type="button" class="btn btn-primary" data-collection="rental">Update Data</button>
                            <button id="updateData" onclick="deleteRecord('rental', '${rental._id}', this); showRental();" type="button" class="btn btn-danger" data-collection="rental">Delete Rental</button>
                            ` : ''}
                      </form>
                  </div>
                </div>
                `)
                
              // If rental is closed no more operations are possible
              if (rental.state !== 'Closed') {

                body = `
                  <div>
                    <div class="mb-3" id="rentPenalty">
                      <button type="button" onclick='addPenalty(this,"penalty", ${JSON.stringify(rented_productsArr)})' class="btn btn-danger" data-count="0">Add Penalty</button>
                    </div>
                    <div class="mb-3">
                        <label for="operationNotes" class="form-label">Notes</label>
                        <textarea class="form-control" list="clientsList" id="operationNotes" data-db-field="notes" placeholder="Type to search...">
                        </textarea>
                  </div>`

                $(content).append(createModal('Close this Rental', body, 'Close'))
                $(document).off("click", "#createRecord")
                $(document).on("click", "#createRecord", function(){
                  createRecord('operations', id, this)
                });
          
                var myModalEl = document.getElementById('staticBackdrop')
                myModalEl.addEventListener('hidden.bs.modal', function (event) {
                  singleRental(id);
                })
              }

              // Retrieval of rental operations
              var q = {'rental_id' : id}
              $.ajax({
                url: "API/operations/",
                type: "GET",
                data: q,
                beforeSend: xhr => {
                  xhr.setRequestHeader('auth', authToken)
                },
                success: res => {
                  var operations = res.operations
                  if (operations.length) {
                    var divRow = document.createElement('div');
                    divRow.className = "row rental-cards-group px-5 pb-5";
                    $.each(operations, (i, op) => {
                      $.ajax({
                        url: "API/employees/" + op.employee_id,
                        type: "GET",
                        beforeSend: xhr => {
                          xhr.setRequestHeader('auth', authToken)
                        },
                        success : res => {
                          var opType = ''
                          switch (op.type) {
                            case 'rent_create': opType = "Rental Creation"; break;
                            case 'rent_update': opType = "Rental Update"; break;
                            case 'rent_close': opType = "Rental Closing"; break;
                          }
                          $(divRow).append(`
                          <div class="card" style="width: 18rem;">
                            <div class="card-body">
                              <h5 class="card-title">${opType}</h5>
                              <p class="card-text">${op.notes ? op.notes : ''}</p>
                            </div>
                            <ul class="list-group list-group-flush">
                              <li class="list-group-item">Employee ${op.employee_id ? res.employees.username : ''}</li>
                            </ul>
                          </div>`);
                          // Last iteration
                          if (i == operations.length - 1) {
                            content.appendChild(divRow);
                          }
                        }
                      });
                    });
                  }
                },
              });
            }
          });
        }
      })
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
          <th>Category</th>
          <th>Sub category</th>
          <th>Availability</th>
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
            <td>${product.category}</td>
            <td>${product.subCategory}</td>
            <td>${product.availability}</td>
            <td>${product.state}</td>
            <td>${product.price}</td>
            <td><a href="" aria-label="Single Inventory" onclick="singleInventory('${product._id}'); return false;"><i class="bi bi-box-arrow-up-right" style="color: brown; cursor: pointer;"></i></a></td>
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
          <select class="form-select" id="productAval" aria-label="Select Availability" data-db-field="availability">
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
          <label for="subCategory" class="form-label">Sub Category</label>
          <select class="form-select" id="subCategory" aria-label="Select Sub Category" data-db-field="subCategory">
            <option selected>Open this select menu</option>
            <option value="Blender">Blender</option>
            <option value="Torch">Torch</option>
            <option value="Kneader">Kneader</option>
            <option value="Smoker">Smoker</option>
            <option value="Barbeque">Barbeque</option>
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
      if (loggedin) $(content).append(createModal('Add new Product',body, 'Save Product'))

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

                  <label for="productAvailability" class="form-label">Product's availability</label><br>
                  <select id="productAvailability" name="availability" data-db-field="availability" onchange="displayEdits(this);" disabled>
                    <option value="${product.availability ? product.availability : ''}">${product.availability ? product.availability : ''}</option>
                    <option value="${product.availability=='available' ? 'unavailable' : 'available'}">${product.availability=='available' ? 'unavailable' : 'available'}</option>
                  </select><br>

                  <div id="startEndDateU" style="display:none;">
                    <label for="rentalStartDate" class="form-label">Unavailability Starting Date</label>
                    <input required type="datetime-local" data-db-field="startD" class="form-control mb-3" id="productStartDate">
      
                    <label for="rentalEndDate" class="form-label">Unavailability Ending Date</label>
                    <input required type="datetime-local" data-db-field="endD" class="form-control mb-3" id="productEndDate">
                  </div>

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
      $(content).append(createModal('Add new Promotion', body, 'Save Promotion'))
    
      // Event listeners
      $(document).off("click", "#createRecord")
      $(document).on("click", "#createRecord", function(){
        createRecord('promotions', '', this)
      });
    },
  });
}

// Retrieve and display all the employees (manager-only)
function showEmployees() {
  $.ajax({
    url: "API/employees/",
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
          <th>Role</th>
          <th>Delete</th>
        </tr>`)
      var tbdy = document.createElement('tbody');
      $.each(res.employees, (i, employee) => {
        $(tbdy).append(`
          <tr class="table-light">
            <td>${employee.username}</td>
            <td>${employee.role}</td>
            <td><i onclick="deleteRecord('employees', '${employee._id}', this);" class="bi bi-x-circle" style="color: red; cursor: pointer;"></i></td>
          </tr>`);
      })
      tbl.appendChild(thd);
      tbl.appendChild(tbdy);
      content.appendChild(container).appendChild(tbl);
      var body = `
        <div class="mb-3">
          <label for="employeeUsername" class="form-label">Employee's Username</label>
          <input required id="employeeUsername" class="form-control" data-db-field="username" placeholder="mariorossi">
        </div>
        <div class="mb-3">
          <label for="employeePassword" class="form-label">Employee's Password</label>
          <input required id="employeePassword" class="form-control" data-db-field="password" placeholder="password">
        </div>
        <div class="mb-3">
            <label for="employeeRole" class="form-label">Employee's Role</label>
            <select required id="employeeRole" class="form-select" data-db-field="role">
              <option value="officer">Officer</option>
              <option value="manager">Manager</option>
            </select>
        </div>`
      $(content).append(createModal('Add new Employee',body, 'Save Employee'))
    
      // Event listeners
      $(document).off("click", "#createRecord")
      $(document).on("click", "#createRecord", function createClient(){
        createRecord('employees', '', this)
      });
    },
  });
}

function addProductField(btn) {
  var fieldHTML = `
    <input required style="margin-top:0.5rem;" class="form-control" list="objectsList" onkeyup="typingLogic(this)" data-collection="inventory" data-field-search="name" data-db-field="product_id" placeholder="Type to search...">
    <datalist id="objectsList"></datalist>
    <input type="text" name="daterange" class="date-picker form-control" data-db-field="product_date" />`
    console.log(btn)
  $(fieldHTML).insertBefore(btn)
}

function addPriceSupplement(btn) {
  console.log($(btn).prev().prev('input[data-db-field="price_supplement"]').length)
  if (!$(btn).prev().prev('input[data-db-field="price_supplement"]').length) {
    var key = (new Date()).getTime()
    var fieldHTML = `
    <label for="priceSupplement${key}" class="form-label" style="margin-top:1rem">Price Supplement</label>
    <input type="number" class="form-control" id="priceSupplement${key}" placeholder="5" data-db-field="price_supplement" min="1" max="100"">`
    console.log(btn)
    console.log($(btn).prev())
  $(fieldHTML).insertBefore($(btn).prev())
  }
}

function createModal(header, body, btnTxt) {
  return `
    <!-- Button trigger modal -->
    <button type="button" aria-label="${header}" class="btn btn-primary ${btnTxt != 'Close' ? 'btn-add-record' : 'btn-close-rental'}" data-bs-toggle="modal" data-bs-target="#staticBackdrop">${btnTxt != 'Close' ? '<i class="bi bi-plus"></i>' : 'Close Rental'}</button>

    <!-- Modal -->
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">${header}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form action="" autocomplete="off">
                    <div class="modal-body">
                        <div class="container-fluid">
                          ${body}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" id="createRecord" data-bs-dismiss="modal" class="btn btn-primary ${btnTxt != 'Close' ? '' : 'btn-close-rental-modal'}">${btnTxt}</button>
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
  if (col === 'rental') toCreateObject['datesProducts'] = []
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
    if ((col === 'rental' || col === 'operations') && $(this).data('db-field') === 'product_id') {
      toCreateObject['products_id'].push(val)
    } else if (col === 'rental' && $(this).data('db-field') === 'product_date') {
      // Collecting dates for each products
      dates_obj = {startDate: new Date($(this).data('daterangepicker').startDate.toISOString()), endDate: new Date($(this).data('daterangepicker').endDate.toISOString())}
      toCreateObject['datesProducts'].push(dates_obj)
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
    toCreateObject['indisponibilityDates'] = [];
  }

  if (col === 'operations') {
    //creation of operation closed etc.
    toCreateObject['rental_id'] = id;
    toCreateObject['employee_id'] = sessionStorage.getItem("usr_id");


    // if (toCreateObject['type'] === 'rent_confirm') {
    //   // don't know if it's gonna be used, WE ALREADY HAVE A "Create new rental" feature
    // } else if (toCreateObject['type'] === 'rent_close') {
      console.log(toCreateObject)
      var updInventoryID = toCreateObject['product_id'];
      /* ANOTHER AJAX REQUEST FOR EDITING PRODUCT AVAILABILITY AND STATE WHEN AN EMPLOYEE CONFIRMS THE RENT CLOSING */
      var toUpdateObject = {};
      // toUpdateObject['avaiability'] = toCreateObject['avaiability'];
      
      toUpdateObject['state'] = toCreateObject['state'];
      toUpdateObject['startD'] = toCreateObject['startD'];
      toUpdateObject['endD'] = toCreateObject['endD'];
      // delete toCreateObject.avaiability;
      delete toCreateObject.state;
      delete toCreateObject.start_date;
      delete toCreateObject.end_date;
      delete toCreateObject.product_id;

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
                /*Rental add penalties */
                if(toCreateObject['penalties_prods'].length){
                  var additivePrice = 0;
                  var newNotes = rntl.note;
                  toCreateObject['penalties_prods'].forEach((element,index)=>{
                    console.log(element)
                    $.ajax({
                      url: "API/inventory/" + element,
                      type: "GET",
                      beforeSend: xhr => {
                        xhr.setRequestHeader('auth', authToken)
                      },
                      success: res => {
                        additivePrice += (res.products.price * toCreateObject['penalties_days'][index] * (50/100)) 
                        newNotes += "\nPenalties were added for "+toCreateObject['penalties_days'][index]+"days of delayed return ("+res.products.name+").";
                        if(index == toCreateObject['penalties_prods'].length-1){
                          additivePrice+=rntl.price;
                          $.ajax({
                            url: "API/rental/" + rntl._id,
                            type: "PATCH",
                            contentType: "application/json",
                            dataType: "json",
                            data: JSON.stringify({note:newNotes,price: additivePrice, end_date: new Date(), state: "Closed"}),
                            beforeSend: xhr => {
                              xhr.setRequestHeader('auth', authToken)
                            },
                            success: function (response) {
                              const rentalPriceR= response.result;
                              console.log(response.result)
                              $.ajax({
                                url: "API/clients/" + rentalPriceR.client_id,
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
                                      rental_id : rntl._id,
                                  }
                                  $.ajax({
                                    url: "API/inventory/many/" + rentalPriceR.products_id.toString(),
                                    type: "GET",
                                    beforeSend: xhr => {
                                      xhr.setRequestHeader('auth', authToken)
                                    },
                                    success: async res => {
                                      var products_prices = []
                                      var multPrices = []
                                      var prodsSumPrice = 0
                                      const productsInfo = []
                                      res.products.forEach((element,i)=>{
                                        products_prices.push(element.price)
                                        const diffInMs   = (new Date(rentalPriceR.datesProducts[i].endDate)).getTime() - (new Date(rentalPriceR.datesProducts[i].startDate)).getTime()
                                        const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));
                                        const multPrice = element.price * diffInDays
                                        prodsSumPrice += multPrice // Sum of products to multiply for rental days
                                        multPrices.push(multPrice)
                                        productsInfo.push(
                                          {
                                            product_name: element.name,
                                            product_image: element.image,
                                            product_state: element.state,
                                            product_price: element.price,
                                            product_category: element.category,
                                            product_start: rentalPriceR.datesProducts[i].startDate,
                                            product_end: rentalPriceR.datesProducts[i].endDate
                                          }
                                        )
                                      });
                                      console.log("prezzo rental"+additivePrice)
                                      const pricesFinalP = await calcPrice(additivePrice, products_prices, multPrices, rentalPriceR.datesProducts, rentalPriceR.client_id,"getPrices");
                                      const finalPrice = pricesFinalP.discounted_price
                                      const pricesProducts = pricesFinalP.pricesProducts
                                      console.log(pricesProducts)
                                      console.log(finalPrice)
                                      $.ajax({
                                        url: "API/rental/" + rntl._id,
                                        type: "PATCH",
                                        contentType: "application/json",
                                        dataType: "json",
                                        data: JSON.stringify({pricesProducts: pricesProducts}),
                                        beforeSend: xhr => {
                                          xhr.setRequestHeader('auth', authToken)
                                        },
                                        success: function (response) {
                                          $.ajax({
                                            url: "API/invoice/pdf/",
                                            type: "POST",
                                            contentType: "application/json",
                                            dataType: "json",
                                            data: JSON.stringify({
                                              clientInfo : clientInfo,
                                              productsInfo : productsInfo,
                                              rentalRef : response.result._id,
                                              rentalNotes : response.result.note,
                                              finalPrice : additivePrice
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
                            }
                          });
                        }
                      }});
                  });
                }else{
                  $.ajax({
                    url: "API/rental/" + rntl._id,
                    type: "PATCH",
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify({end_date: new Date(), state: "Closed"}),
                    beforeSend: xhr => {
                      xhr.setRequestHeader('auth', authToken)
                    },
                    success: function (response) {
                      const rentalPriceR= response.result;
                      console.log(response.result.price)
                      $.ajax({
                        url: "API/clients/" + rentalPriceR.client_id,
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
                            rental_id : rntl._id,
                          }
                          $.ajax({
                            url: "API/inventory/many/" + rentalPriceR.products_id.toString(),
                            type: "GET",
                            beforeSend: xhr => {
                              xhr.setRequestHeader('auth', authToken)
                            },
                            success: async res => {
                              var products_prices = []
                              var multPrices = []
                              var prodsSumPrice = 0
                              const productsInfo = []
                              res.products.forEach((element,i)=>{
                                products_prices.push(element.price)
                                const diffInMs   = (new Date(rentalPriceR.datesProducts[i].endDate)).getTime() - (new Date(rentalPriceR.datesProducts[i].startDate)).getTime()
                                const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));
                                const multPrice = element.price * diffInDays
                                prodsSumPrice += multPrice // Sum of products to multiply for rental days
                                multPrices.push(multPrice)
                                productsInfo.push({
                                  product_name: element.name,
                                  product_image: element.image,
                                  product_state: element.state,
                                  product_price: element.price,
                                  product_category: element.category,
                                  product_start: rentalPriceR.datesProducts[i].startDate,
                                  product_end: rentalPriceR.datesProducts[i].endDate
                                })
                              });
                              console.log("prezzo rental"+rentalPriceR.price)
                              const pricesFinalP = await calcPrice(rentalPriceR.price, products_prices, multPrices, rentalPriceR.datesProducts, rentalPriceR.client_id,"getPrices");
                              const finalPrice = pricesFinalP.discounted_price
                              const pricesProducts = pricesFinalP.pricesProducts
                              console.log(pricesProducts)
                              console.log(finalPrice)
                              $.ajax({
                                url: "API/rental/" + rntl._id,
                                type: "PATCH",
                                contentType: "application/json",
                                dataType: "json",
                                data: JSON.stringify({pricesProducts: pricesProducts}),
                                  beforeSend: xhr => {
                                xhr.setRequestHeader('auth', authToken)
                              },
                                success: function (response) {
                                  $.ajax({
                                    url: "API/invoice/pdf/",
                                    type: "POST",
                                    contentType: "application/json",
                                    dataType: "json",
                                    data: JSON.stringify({
                                      clientInfo : clientInfo,
                                      productsInfo : productsInfo,
                                      rentalRef : response.result._id,
                                      rentalNotes : response.result.note,
                                      finalPrice : rentalPriceR.price
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
                    }
                  });
                }
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
    // }
  }
  if (col === 'rental') {
    toCreateObject['note'] = ''
    $.ajax({
      url: "API/inventory/many/" + toCreateObject['products_id'].toString(),
      type: "GET",
      beforeSend: xhr => {
        xhr.setRequestHeader('auth', authToken)
      },
      success: async response => {
        if (response) {
          var prods = response.products

          // Price Calculation
          var prices = []
          var multPrices = []
          var prodsSumPrice = 0
          prods.forEach((prod, i) => {
            var productPrice = prod.price

            // Adding price supplement in case of several reserved bookings - USE CASE 5
            if (toCreateObject["price_supplement"]) {
              productPrice += productPrice / 100 * toCreateObject["price_supplement"]
              toCreateObject['note'] = `Product price from ${prod.price}$ to ${productPrice}$ due to ${toCreateObject["price_supplement"]}% of supplement for multiple reserved bookings.`
            }

            const diffInMs   = toCreateObject['datesProducts'][i].endDate.getTime() - toCreateObject['datesProducts'][i].startDate.getTime()
            const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24)) + 1;
            const multPrice = productPrice * diffInDays
            prodsSumPrice += multPrice // Sum of products to multiply for rental days
            multPrices.push(multPrice)
            prices.push(productPrice)

            // Insert unavailability dates into each product
            var dates = prod.indisponibilityDates
            dates = dates.concat(toCreateObject['datesProducts'][i]) // obj of start and end date
            $.ajax({
              url: "API/inventory/" + prod._id,
              type: "PATCH",
              contentType: "application/json",
              dataType: "json",
              data: JSON.stringify({indisponibilityDates: dates}),
              beforeSend: xhr => {
                xhr.setRequestHeader('auth', sessionStorage.getItem('auth'))
              },
              success: res => {
                if (res) {
                  console.log('call done?')
                } else {
                  alert("There was an error.");
                }
              }
            })
          })

          console.log(prodsSumPrice);
          const rentalPrice = prodsSumPrice
          
          const pricesFinalP = await calcPrice(rentalPrice, prices, multPrices, toCreateObject['datesProducts'], '',"getPrices")  
          const finalPrice = pricesFinalP.discounted_price
          const pricesProducts = pricesFinalP.pricesProducts
          toCreateObject["pricesProducts"] = pricesProducts
          console.log(toCreateObject["pricesProducts"]);
          toCreateObject['price'] = finalPrice
          toCreateObject['real_price'] = rentalPrice
          toCreateObject["pricesProducts"] = pricesProducts;

          // Rental creation
          $.ajax({
            url: "API/" + col + "/",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(toCreateObject),
            success: function (response) {
              if (response) {
                // Creation of rent_create operation associated with the employee
                $.ajax({
                  url: "API/operations/",
                  type: "POST",
                  contentType: "application/json",
                  data: JSON.stringify({type: 'rent_create', employee_id: sessionStorage.getItem("usr_id"), rental_id: response.rental._id, notes: ''}),
                  success: function (response) {
                    if (response) {
                      showRental();
                    } else {
                      alert("There was an error.");
                    }
                  },
                });
                showRental();
              } else {
                alert("There was an error.");
              }
            },
          });


          // toCreateObject['price'] = (prodsSumPrice * diffInDays).toString()
          // console.log(JSON.stringify(toCreateObject))
          
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
      beforeSend: xhr => {
        xhr.setRequestHeader('auth', authToken)
      },
      success: function (response) {
        if (response) {
          switch (col) {
            case 'clients' : showClients(); break;
            case 'inventory' : showInventory(); break;
            case 'promotions' : showPromotions(); break;
            case 'employees' : showEmployees(); break;
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
async function calcPrice(total_price, products_prices, products_mult_prices, products_dates, client_id,col) {
  var discounted_price = total_price
  var products_mult_pricesN = products_mult_prices;
  console.log("AAA")
  console.log(products_mult_prices)
  console.log(products_mult_pricesN)
  console.log("AAA")
  // Applying Promotions
  await $.ajax({
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

        products_dates.forEach((d, i) => {
          // If the order was placed within the promotion period
          if (d.startDate >= prom_start_date && d.startDate <= prom_end_date) {
            discounted_price -= (products_mult_prices[i] / 100) * value.percentage
            
            console.log("xx")
            console.log(products_mult_pricesN[i])
            products_mult_pricesN[i] -= (products_mult_prices[i] / 100) * value.percentage
            console.log("xxx")
            console.log(products_mult_pricesN[i])
          }
        })
      }
    },
  });

  // Weekdays Discount - Use Case 1
  products_dates.forEach((d, index) => {
    var start_day = new Date(d.startDate).getDay() // Sunday = 0, Monday = 1, ...
    var diffInDays = products_mult_prices[index] / products_prices[index]
    var current_day = start_day
    var inner_weekdays = false
    
    for(i=0; i < diffInDays; i++) {
      // Start weekdays check
      if(current_day == 0) {
        inner_weekdays = true;
      }

      // Inner weekdays Confirmed
      if(current_day == 4 && inner_weekdays) {
        var sub_amount = products_prices[index] + products_prices[index] * 0.5 + products_prices[index] * 0.25 // For free on Mondays, 50% on Tuesdays, 25% on Wednesdays 
        discounted_price -= sub_amount
        products_mult_pricesN[index] -=sub_amount
        inner_weekdays = false;
      }
      
      if (current_day == 6) current_day = 0
      else current_day++
    }
  })

  var pricesProducts = []
  console.log(products_mult_pricesN);
  products_mult_pricesN.forEach(element => {
    pricesProducts = pricesProducts.concat({price : element})
  });

  console.log()
  if(col === "getPrices")
    return {discounted_price,pricesProducts}
  else{
    return discounted_price
  }
}

async function updatePrice(rental_id, prodsDates) {
  var updatedPrice
  console.log(updatedPrice)
  var res = await $.ajax({
    url: "API/rental/" + rental_id,
    type: "GET",
    beforeSend: xhr => {
      xhr.setRequestHeader('auth', sessionStorage.getItem('auth'))
    },
    success: async res => {
      var rental = res.rental
      await $.ajax({
        url: "API/inventory/many/" + rental.products_id.toString(),
        type: "GET",
        beforeSend: xhr => {
          xhr.setRequestHeader('auth', sessionStorage.getItem('auth'))
        },
        success: async res => {
          var prods = res.products
          
          var prices = []
          var multPrices = []
          var prodsSumPrice = 0
          prods.forEach((prod, i) => {
            // const diffInMs   = toCreateObject['datesProducts'][i].endDate.getTime() - toCreateObject['datesProducts'][i].startDate.getTime()
            console.log(prodsDates)
            const diffInMs   = (new Date(prodsDates[i].endDate)).getTime() - (new Date(prodsDates[i].startDate)).getTime()
            const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24)) + 1;
            const multPrice = prod.price * diffInDays
            prodsSumPrice += multPrice // Sum of products to multiply for rental days
            multPrices.push(multPrice)
            prices.push(prod.price)
          })

          const rentalPrice = prodsSumPrice
          console.log("Calculating price...")
          updatedPrice = await calcPrice(rentalPrice, prices, multPrices, prodsDates, '',"")  
          console.log('updated price inner: ' + updatedPrice)

          $.ajax({
            url: "API/rental/" + rental_id,
            type: "PATCH",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({price: updatedPrice, real_price: rentalPrice}),
            beforeSend: xhr => {
              xhr.setRequestHeader('auth', sessionStorage.getItem('auth'))
            },
            success: res => {
              if (res) {
                var content = document.getElementById("content");
                content.innerHTML = "";
                singleRental(rental_id)
              } else {
                alert("There was an error.");
              }
            },
          });
        },
      });
    },
  });
}


async function updateRecordInfo(col, id, el) {
  console.log(col)
  var startDate = $(el).siblings("input[data-db-field='start_date']").val();

  // Edit of single product dates inside rental
  if (!startDate && col != "inventory") {
    startDate = $('input[data-db-field="start_date"]').val()
    boolUtil = false
  }

  var toUpdateObject = {};
  var utils = {}

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
      if (!fields.length) {
        fields = $($(el).siblings("input"))
        if ((col === 'rental' || col === 'inventory') && fields.data('db-field') === 'product_dates') {
          dates_obj = {startDate: new Date(fields.data('daterangepicker').startDate.toISOString()), endDate: new Date(fields.data('daterangepicker').endDate.toISOString())}
          utils['prod_date'] = dates_obj
          utils['prev_prod_date'] = new Date(fields.data('daterangepicker').oldStartDate.toISOString())
          if (col === 'rental') utils['prodPos'] = fields.data('picker')
        }
        
      } else {
        // JavaScript object to pass as data to update in the POST request
        fields.each(function() {
          toUpdateObject[$(this).data('db-field')] = $(this).val();
          if(toUpdateObject["startD"]&& toUpdateObject["endD"] && !toUpdateObject["indisponibilityDates"])
            toUpdateObject["indisponibilityDates"] = [ {startD : toUpdateObject["startD"] ,endD : toUpdateObject["endD"]}]
        });
      }   

      // Update single product dates within rental
      if ((col === 'rental' || col === 'inventory') && utils['prod_date']) {
        // Product GET
        await $.ajax({
          url: "API/" + col + "/" + id,
          type: "GET",
          beforeSend: xhr => {
            xhr.setRequestHeader('auth', sessionStorage.getItem('auth'))
          },
          success: async res => {
            var data = res[Object.keys(res)[0]]
            console.log(res)
            if (col === 'rental') {
              // Retrieves datesProducts arr from db, replace the indexed prod date and update
              var newDatesProds = data.datesProducts
              newDatesProds[utils['prodPos']] = utils['prod_date']
              toUpdateObject['datesProducts'] = newDatesProds

              
              // Updates Price
              console.log(newDatesProds)
              var updatedPrice = await updatePrice(id, newDatesProds)
              console.log(updatedPrice)

              // Creation of rental update operation related to the employee
              $.ajax({
                url: "api/inventory/" + data.products_id[utils['prodPos']],
                type: "GET",
                success: res => {
                  var prod = res.products
                  console.log(data.datesProducts[utils['prodPos']])
                  console.log(utils['prod_date'])
                  $.ajax({
                    url: "api/operations/",
                    type: "POST",
                    data: JSON.stringify({type: 'rent_update', employee_id: sessionStorage.getItem("usr_id"), rental_id: data._id, notes: `${prod.name} from ${data.datesProducts[utils['prodPos']].startDate.toLocaleString() + ' - ' + data.datesProducts[utils['prodPos']].endDate.toLocaleString()} to ${utils['prod_date'].startDate.toLocaleString() + ' - ' + utils['prod_date'].endDate.toLocaleString()}`}),
                    dataType: "json",
                    contentType: "application/json",
                  })
                }
              })
            } else if (col === 'inventory') {

              var prodDatesArr = data.indisponibilityDates
              var replacePos = null
              // console.log(prodDatesArr)
              prodDatesArr.some((date, i) => {
                var startIndDate = new Date(date.startDate)
                startIndDate.setHours(startIndDate.getHours() - 2) // So that the conversion to UTC doesn't add 2 hours and get the next day instead
                startIndDate.setHours(0, 0, 0, 0)
                utils['prev_prod_date'].setHours(0, 0, 0, 0)
                // console.log(startIndDate)
                // console.log(utils['prev_prod_date'])
                if (startIndDate.getTime() == utils['prev_prod_date'].getTime()) {
                  replacePos = i
                  // console.log(replacePos)
                  return true;
                }
              })

              var newIndDates = data.indisponibilityDates
              utils['prod_date'].startDate.setHours(5) // So that the conversion to UTC doesn't substract 2 hours and get the previous day instead
              newIndDates[replacePos] = utils['prod_date']
              toUpdateObject['indisponibilityDates'] = newIndDates
            }
          }
        })
      }
      // JavaScript object to pass as data to update in the POST request
      if(col === "inventory"){
        var indisponibilityDatesP;
        await $.ajax({
          url: "API/inventory/" + id,
          type: "GET",
          success: function (response) {
            if (response) {
              indisponibilityDatesP = response.products.indisponibilityDates;
              fields.each(function() {
                console.log($(this).data('db-field'))
                toUpdateObject[$(this).data('db-field')] = $(this).val();
                if(col === "inventory"){
                  if(toUpdateObject["startD"] && toUpdateObject["endD"]){
                    console.log(toUpdateObject["indisponibilityDates"]);
                  }else if(toUpdateObject["startD"] && !toUpdateObject["endD"]){
                    toUpdateObject["availability"] = "unavailable";
                  }
                }
              });

              if(toUpdateObject["availability"] != "available"){
                indisponibilityDatesP.push({startD : toUpdateObject["startD"] ,endD : toUpdateObject["endD"]});
                toUpdateObject["indisponibilityDates"] =indisponibilityDatesP;  
                console.log("ecc");
                if(toUpdateObject["endD"])
                  toUpdateObject["availability"] = "available";
                console.log("ecc");
              } 
                


              //toUpdateObject["availability"] = "avaiable";
              console.log(toUpdateObject["availability"]);

              delete toUpdateObject.startD;
              delete toUpdateObject.endD;
            }
          },
        });
      }else{
        fields.each(function() {
          console.log($(this).data('db-field'))
          toUpdateObject[$(this).data('db-field')] = $(this).val();
        });
      }
      
      
      if(col == "rental"){
        console.log(toUpdateObject);

        if(toUpdateObject["change_prod"]){
          $.ajax({
            url: "API/rental/" + id,
            type: "GET",
            beforeSend: xhr => {
              xhr.setRequestHeader('auth', sessionStorage.getItem('auth'))
            },
            success: function (response) {
              if (response) {
                var rntl = response.rental;
                toUpdateObject["note"] = rntl.note
                console.log("CIAO");
                console.log(response.rental);
                toUpdateObject["change_prod"] = toUpdateObject["change_prod"].slice(toUpdateObject["change_prod"].indexOf("id=")+3)
                console.log("eccolo")
                console.log(toUpdateObject["change_prod"]);
                rntl.products_id.forEach(async (element,index)=>{
                  if(element == toUpdateObject["change_prod"]){
                    rntl.products_id[index] = toUpdateObject["changeNew_prod"]
                    const actualPrice = rntl.pricesProducts[index];
                    $.ajax({
                      url: "API/inventory/" + toUpdateObject["changeNew_prod"],
                      type: "GET",
                      beforeSend: xhr => {
                        xhr.setRequestHeader('auth', sessionStorage.getItem('auth'))
                      },
                      success: function (response) {
                        console.log(rntl.pricesProducts[index].price)
                        console.log(toUpdateObject["payed_days"])
                        var priceNewP = rntl.pricesProducts[index].price / toUpdateObject["payed_days"]
                        
                                                 
                        console.log(rntl.note);
                      }
                    });
                  }

                  if(rntl.products_id.length-1 == index){
                    toUpdateObject["products_id"] = rntl.products_id
                    console.log(toUpdateObject["products_id"])
                    if(!rntl.note)
                      toUpdateObject["note"] = "problemi di malfunzionamento. Prezzi relativi a "+toUpdateObject["payed_days"]+"giorni, ma i giorni di noleggio restano invariati"
                    else
                      toUpdateObject["note"] = rntl.note + "problemi di malfunzionamento. Prezzi relativi a "+toUpdateObject["payed_days"]+"giorni, ma i giorni di noleggio restano invariati"
                    $.ajax({
                      url: "API/rental/" + id,
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
                          //if(response.rental)
                          // Put everything back to read-only
                          $(el).html("Update Data");
                          $(el).siblings("input, textarea").attr("readonly", true);
                          $("select").attr("disabled", true);
                          boolUtil = true;
                        } else {
                          alert("There was an error.");
                        }
                      },
                      error: function (response){ 
                        console.log(response);
                      }
                    });
                  }
                })
              }
            },
          });
        }

        var usCase = document.getElementById('saleBrokenPrice').checked;
        if(usCase){
          $.ajax({
            url: "API/rental/" + id,
            type: "GET",
            beforeSend: xhr => {
              xhr.setRequestHeader('auth', sessionStorage.getItem('auth'))
            },
            success: function (response) {
              toUpdateObject["price"] = toUpdateObject["price"] * (50/100)
              // Remove broken product alerts
              toUpdateObject["broken_product"] = null
              if(!toUpdateObject["note"])
                toUpdateObject["note"] = "Prezzo aggiornato con 50% di sconto per il disagio"
              else
                toUpdateObject["note"] = response.rental.note + "Prezzo aggiornato con 50% di sconto per il disagio"

              $.ajax({
                url: "API/rental/" + id,
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
                    //if(response.rental)
                    // Put everything back to read-only
                    $(el).html("Update Data");
                    $(el).siblings("input, textarea").attr("readonly", true);
                    $("select").attr("disabled", true);
                    boolUtil = true;

                    singleRental(id)
                  } else {
                    alert("There was an error.");
                  }
                },
                error: function (response){ 
                  console.log(response);
                }
              });
            }
          });
        }

        //toUpdateObject[] = toUpdateObject[change_prod]


        //toUpdateObject[real_price] = toUpdateObject[real_price].parseInt();
      }
      console.log(toUpdateObject)
      // Update AJAX Request
      if(col != "rental")
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
            //if(response.rental)
            // Put everything back to read-only
            $(el).html("Update Data");
            $(el).siblings("input, textarea").attr("readonly", true);
            $("select").attr("disabled", true);
            boolUtil = true;
          } else {
            alert("There was an error.");
          }
        },
        error: function (response){ 
          console.log(response);
        }
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
      if(col=='rental'){
        await $.ajax({
          url: "API/rental/"+ id,
          type: "GET",
          beforeSend: xhr => {
            xhr.setRequestHeader('auth', authToken)
          },
          success: function (response) {
            if (response) {
              response.rental.products_id.forEach((element,index) => {
                $.ajax({
                  url: "API/inventory/" + element,
                  type: "GET",
                  beforeSend: xhr => {
                    xhr.setRequestHeader('auth', sessionStorage.getItem('auth'))
                  },
                  success: res => {
                    console.log(res)
                    console.log(res.indisponibilityDates)
                    if (res) {
                      $.ajax({
                        url: "API/inventory/" + res.products._id,
                        type: "PATCH",
                        contentType: "application/json",
                        dataType: "json",
                        data: JSON.stringify({indisponibilityDates: res.products.indisponibilityDates.filter((x) => x.startDate !== response.rental.datesProducts[index].startDate)}),
                        beforeSend: xhr => {
                          xhr.setRequestHeader('auth', sessionStorage.getItem('auth'))
                        },
                        success: res => {
                          if (res) {
                            console.log('call done?')
                          } else {
                            alert("There was an error.");
                          }
                        }
                      })                      
                    } else {
                      alert("There was an error.");
                    }
                  }
                })
                
              })
              console.log(response);
              /*$.ajax({
                url: "API/inventory/" + id,
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
              });*/
            }
          },
        });
      }






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
  if ($(el).data("db-field") === 'product_id' && $(el).val().indexOf("id=") > 0) {
    var val = $(el).val();
    var index = val.indexOf("id=") + 3;
    var id = val.substring(index);
    console.log(id)

    $.ajax({
      url: "API/inventory/" + id,
      type: "GET",
      success: res => {
        console.log($(el))
        dateRangePicker(res.products.indisponibilityDates, $(el).nextAll('input[name="daterange"]')[0], '');
      }
    });
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
  } else if(sel.value == "unavailable"){
    $("#startEndDateU").show();
  }
}

function addPenalty(btn,col, rented_productsArr) {
  if(col==="penalty"){
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
  }else{
    var count = $(btn).data("count")

    var selNewOptions = ``
    $.ajax({
      url: "API/inventory/",
      type: "GET",
      beforeSend: xhr => {
        xhr.setRequestHeader('auth', sessionStorage.getItem('auth'))
      },
      success: res => {
        // Conversion from String to JSON object
        res.products.forEach(element =>{
          selNewOptions += `
          <option value="${element._id}">${element.name + " id="+ element._id}</option>
          `
        })
        if (count < rented_productsArr.length) {
          var selOptions = ``
            rented_productsArr.forEach(prod => {
              selOptions += `
                <option value="${prod}">${prod}</option>
              `
            })
            var fieldHTML = `
              <div class="mb-3">
                <label for="changeProd${count+1}" class="form-label">Change product</label>
                <select required id="changeProd${count+1}" class="form-select mb-2" data-db-field="change_prod">
                  ${selOptions}
                </select>
                <label for="changeNewProd${count+1}" class="form-label">New product</label>
                <select required id="changeNewProd${count+1}" class="form-select mb-2" data-db-field="changeNew_prod">
                  ${selNewOptions}
                </select>
                <label for="payedDays${count+1}" class="form-label">Paid days</label>
                <input type="number" class="form-control" id="paidDays${count+1}" onchange="calcPriceNew(this,'paid')" min="0" max="100" data-db-field="payed_days">
              </div>`
              console.log(btn)
            $(fieldHTML).insertBefore(btn)
            count++
            $(btn).data("count", count)
            if (count == rented_productsArr.length) btn.style.display = "none"
          }
      },
    });


    
  }
}

function calcPriceNew(btn,col){



  if(col === "free"){
    console.log(btn.value)

  }else{
    console.log(btn.value)  
  }  
}

function dateRangePicker(disabledArr, pickerInput, initialVal) {
  $(pickerInput).daterangepicker({
    isInvalidDate: function(date){
      // For each calendar date, check if it is within a disabled range.
      for(i=0; i<disabledArr.length; i++){  
          // Get each from/to ranges
          var From = new Date(disabledArr[i].startDate)
          From.setHours(From.getHours() + 2)
          var To = new Date(disabledArr[i].endDate)
          // Format them as dates : Year, Month (zero-based), Date
          var FromDate = new Date(From.getUTCFullYear(), From.getUTCMonth(), From.getUTCDate());
          var ToDate = new Date(To.getUTCFullYear(), To.getUTCMonth(), To.getUTCDate());

          // Set a flag to be used when found
          var found=false;
          // Compare date
          // console.log(date)
          if(date >= FromDate && date <= ToDate){
              found=true;
              return true; // Return false (disabled) and the "red" class.
          }
      }
      
      //At the end of the for loop, if the date wasn't found, return true.
      if(!found){
          return false; // Return true (Not disabled) and no class.
      }
    }
  });

  $(pickerInput).on('apply.daterangepicker', function(ev, picker) {
    var start_date = picker.startDate.toISOString()
    var end_date = picker.endDate.toISOString()
    var invalid = false
    disabledArr.forEach(range => {
      if(range.startD >= start_date && range.endD <= end_date)
        invalid = true
    })

    if (invalid)
      $(pickerInput).val("You can't comprehend disabled dates!");
  });

  if (initialVal) {
    $(pickerInput).data('daterangepicker').setStartDate(new Date(initialVal.startDate))
    $(pickerInput).data('daterangepicker').setEndDate(new Date(initialVal.endDate))
  }
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
