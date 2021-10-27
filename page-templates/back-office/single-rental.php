<?php 
    $sectionTitle = "Single Client";
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
        <div class="col-md-4 p-5">
            <img class="img-fluid img-thumbnail" src="<?=$client['imageUrl'];?>" alt="Client profile photo">
        </div>
        <div class="col-md-8 p-5">
            <form action="">
                <label for="clientUsername" class="form-label">Client's Username</label>
                <input type="text" class="form-control mb-3" id="clientUsername" value="<?=$client['username']?>" readonly>
                
                <label for="clientEmailAddress" class="form-label">Client's Email Address</label>
                <input type="email" class="form-control mb-3" id="clientEmailAddress" value="<?=$client['email']?>" readonly>

                <label for="clientAddress" class="form-label">Client's Address</label>
                <input type="text" class="form-control mb-4" id="clientAddress" value="<?=$client['address']?>" readonly>

                <button id="editData" type="button" class="btn btn-primary" data-id="<?=$client['_id']?>">Edit Data</button>
            </form>
        </div>
	</div>
    <!-- PUT HERE ALL THE OPERATIONS ON THE SINGLE RENTAL, LIKE CREATION, MODIFY OR WHATEVER (REQUIREMENT IN THE SPECS) | ANOTHER QUERY ON THE OPERATIONS IS NEEDED, OR OPERATIONS ADDED IN THE RENTAL DOCUMENT IN MONGODB -->
    <div class="row">
        <ul class="list-group">
            <?php 
                foreach ($rental as $singleRental) { ?>
                    <li class="list-group-item"><?=$singleRental['name']?></li>
                <?php }
            ?>
        </ul>
    </div>

<?php include("back-office-footer.php"); ?>