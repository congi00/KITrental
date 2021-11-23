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
            <h2><?=$rentedObject['title'];?></h2>

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

                <?php echo !isset($_GET['past']) ? '<button id="updateData" type="button" class="btn btn-primary" data-collection="rental" data-id="<?=$singleRental[\'_id\']?>">Edit Data</button>' : ''; ?>
            </form>
        </div>
	</div>
    <!-- PUT HERE ALL THE OPERATIONS ON THE SINGLE RENTAL, LIKE CREATION, MODIFY OR WHATEVER (REQUIREMENT IN THE SPECS) | ANOTHER QUERY ON THE OPERATIONS IS NEEDED, OR OPERATIONS ADDED IN THE RENTAL DOCUMENT IN MONGODB -->
    <div class="row">
        <ul class="list-group">
            <?php 
                /*foreach ($rental as $singleRental) { ?>
                    <li class="list-group-item"><?=$singleRental['name']?></li>
                <?php }*/
            ?>
        </ul>
    </div>

<?php include("back-office-footer.php"); ?>