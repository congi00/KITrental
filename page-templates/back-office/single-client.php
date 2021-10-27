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