<?php 
    $sectionTitle = "Single Client";
    include("back-office-header.php");

    // Connection to the DB
    $dbName = "KITrental";
    $colName = "clients";
    include("../modules/db-config.php");

    // Retrieve single client, getting the ID from the URL parameter
    $userId = $_GET['userId'];

    $query = ['_id' => new MongoDB\BSON\ObjectID($userId)];
    $client = $collection->findOne($query);

    // Retrieve rental associated with the client, making the comparison with the ID retrieved from the URL parameter
    $colName = "rental";
    $collection = $db->$colName;
    

    $query = ['client_id' => new MongoDB\BSON\ObjectID($userId)];
    $rental = $collection->find($query);

    // Retrieve notes associated with the client, if present
    $colName = "operations";
    $collection = $db->$colName;
    

    $query = ['type' => 'client_note', 'linkedTo_id' => new MongoDB\BSON\ObjectID($userId)];
    $clientNotes = $collection->find($query);


    // Display retrieved data
    ?>
    <div class="row">
        <div class="col-md-4 p-5">
            <img class="img-fluid img-thumbnail" src="<?php echo !empty($client['imageUrl']) ? $client['imageUrl'] : $base_url . 'img\profile-placeholder.png';?>" alt="Client profile photo">
        </div>
        <div class="col-md-8 p-5">
            <form action="">
                <label for="clientUsername" class="form-label">Client's Username</label>
                <input type="text" data-db-field="username" class="form-control mb-3" id="clientUsername" value="<?php echo isset($client['username']) ? $client['username'] : ''; ?>" readonly>
                
                <label for="clientEmailAddress" class="form-label">Client's Email Address</label>
                <input type="email" data-db-field="email" class="form-control mb-3" id="clientEmailAddress" value="<?php echo isset($client['email']) ? $client['email'] : ''; ?>" readonly>

                <label for="clientAddress" class="form-label">Client's Address</label>
                <input type="text" data-db-field="address" class="form-control mb-4" id="clientAddress" value="<?php echo isset($client['address']) ? $client['address'] : ''; ?>" readonly>

                <button id="updateData" type="button" class="btn btn-primary" data-collection="clients" data-id="<?=$client['_id']?>">Update Data</button>
            </form>
        </div>
	</div>
    <div class="row">
        <p>
            <?php 
                // Display notes associated with the client, if present
                foreach ($clientNotes as $note) { ?>
                    <p>
                        <?php echo isset($note['notes']) ? $note['notes'] : '';?>
                    </p>
                <?php }
            ?>
        </p>
    </div>
    <div class="row">
        <ul class="list-group rental-list-group">
            <?php 
                // Display rental associated with the client, if present
                foreach ($rental as $singleRental) { ?>
                    <li class="list-group-item rental-list-item">
                        <?php echo isset($singleRental['name']) ? $singleRental['name'] : '';?>
                        <a href="single-rental.php?rentalId=<?=$singleRental['_id']?>"><i class="bi bi-box-arrow-up-right" style="color: brown; cursor: pointer;"></i></a>
                    </li>
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
                                <select required class="form-select" id="operationType" data-db-field="type">
                                    <!-- <option value="rent_create">Create Rent</option>
                                    <option value="rent_update">Update Rent</option> -->
                                    <option value="client_note">Add a Client Note</option> <!-- THIS SEEMS TO BE THE ONLY NEEDED ONE -->
                                </select>
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
                        <button type="button" id="createRecord" class="btn btn-primary" data-rental="<?= $userId; ?>" data-collection="operations">Save Operation</button>
                    </div>
                </form>
            </div>
        </div>
    </div>


<?php include("back-office-footer.php"); ?>