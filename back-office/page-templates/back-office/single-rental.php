<?php 
    $sectionTitle = "Single Rental";
    include("back-office-header.php");

    // Connection to the DB
    $dbName = "KITrental";
    $colName = "rental";
    include("../modules/db-config.php");

    // Retrieve single rental, getting the ID from the URL parameter
    $rentalId = $_GET['rentalId'];

    $query = ['_id' => new MongoDB\BSON\ObjectID($rentalId)];
    $singleRental = $collection->findOne($query);

    // Retrieve client associated with the rental, making the comparison with the client ID from the rental document
    $colName = "clients";
    $collection = $db->$colName;
    
    $query = ['_id' => new MongoDB\BSON\ObjectID($singleRental['client_id'])];
    $associatedClient = $collection->findOne($query);

    // Retrieve rented object, making the comparison with the object ID from the rental document
    $colName = "inventory";
    $collection = $db->$colName;
    
    $query = ['_id' => new MongoDB\BSON\ObjectID($singleRental['object_id'])];
    $rentedObject = $collection->findOne($query);

    // Display retrieved data
    ?>
    <div class="row">
        <div class="col-md-6 p-5">
            <!-- Display Rented Object -->
            <h2><?=$rentedObject['name'];?></h2>

            <!-- Display Associated Client -->
            <h2><?=$associatedClient['username'];?></h2>
        </div>

        <!-- Display Rental Data -->
        <div class="col-md-6 p-5">
            <form action="">
                <label for="rentalStartDate" class="form-label">Starting Date</label>
                <input type="datetime-local" data-db-field="starting_date" class="form-control mb-3" id="rentalStartDate" value="<?php echo date("Y-m-d\TH:i:s", date_timestamp_get($singleRental['starting_date']->toDateTime())); ?>" readonly>
                
                <label for="rentalEndDate" class="form-label">Ending Date</label>
                <input type="datetime-local" data-db-field="end_date" class="form-control mb-3" id="rentalEndDate" value="<?php echo date("Y-m-d\TH:i:s", date_timestamp_get($singleRental['end_date']->toDateTime())); ?>" readonly>
                
                <!-- If the end date is in the future, add a button to modify and update the rental data -->
                <?php if (date_timestamp_get($singleRental['end_date']->toDateTime()) > strtotime(date("Y-m-d\TH:i:s")) ): ?>
                    <button id="updateData" type="button" class="btn btn-primary" data-collection="rental" data-id="<?=$singleRental['_id']?>">Update Data</button>                    
                <?php endif; ?>
            </form>
        </div>
	</div>
    <!-- PUT HERE ALL THE OPERATIONS ON THE SINGLE RENTAL, LIKE CREATION, MODIFY OR WHATEVER (REQUIREMENT IN THE SPECS) | ANOTHER QUERY ON THE OPERATIONS IS NEEDED, OR OPERATIONS ADDED IN THE RENTAL DOCUMENT IN MONGODB -->
    <?php
        $colName = "operations";
        $collection = $db->$colName;
        
        $query = ['linkedTo_id' => new MongoDB\BSON\ObjectID($rentalId)];
        $rentalOperations = $collection->find($query);
    ?>
    <div class="row">
        <ul class="list-group">
            <?php 
                foreach ($rentalOperations as $operation) { ?>
                    <li class="list-group-item"><?=$operation['type']?></li>
                <?php }
            ?>
        </ul>
    </div>

    <!-- Button trigger modal -->
    <button type="button" class="btn btn-primary btn-add-rental" data-bs-toggle="modal" data-bs-target="#staticBackdrop"><i class="bi bi-plus"></i></button>

    <!-- Modal -->
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">Add an Operation</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form action="" autocomplete="off">
                    <div class="modal-body">
                        <div class="container-fluid">
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
                                <label for="operationNotes" class="form-label">Notes</label>
                                    <label for="searchObjects" class="form-label">Object Rented</label>
                                    <input required class="form-control" list="objectsList" id="searchObjects" value="<?=$rentedObject['name'];?> id=<?=$rentedObject['_id'];?>" data-collection="inventory" data-field-search="name" data-db-field="object_id" placeholder="Type to search...">
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
                                    <input id="productState" class="form-control" type="text" name="state" data-db-field="state" value="<?=$rentedObject['state'];?>">
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="operationNotes" class="form-label">Notes</label>
                                <textarea class="form-control" list="clientsList" id="operationNotes" data-db-field="notes" placeholder="Type to search...">
                                </textarea>
                            </div>
                            <!-- TO BE REMOVED (probably) -->
                            <!-- <div class="mb-3">
                                <label for="searchClients" class="form-label">Client Renting</label>
                                <input required class="form-control" list="clientsList" id="searchClients" data-collection="clients" data-field-search="username" data-db-field="client_id" placeholder="Type to search...">
                                <datalist id="clientsList"></datalist>
                            </div>
                            <div class="mb-3">
                                <label for="rentalStartDate" class="form-label">Rental Starting Date</label>
                                <input required type="datetime-local" data-db-field="starting_date" class="form-control mb-3" id="rentalStartDate">
                                
                                <label for="rentalEndDate" class="form-label">Rental Ending Date</label>
                                <input required type="datetime-local" data-db-field="end_date" class="form-control mb-3" id="rentalEndDate">
                            </div> -->
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" id="createRecord" class="btn btn-primary" data-rental="<?= $rentalId; ?>" data-collection="operations">Save Operation</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

<?php include("back-office-footer.php"); ?>