<?php 
    $sectionTitle = "Rental";
    include("back-office-header.php");

    // Connection to the DB and query to retrieve clients
    $dbName = "KITrental";
    $colName = "rental";
    include("../modules/db-config.php");

    // CURRENT & FUTURE RENTAL

    // Query to retrieve all the clients
    $query = ['end_date' => ['$gte' => new MongoDB\BSON\UTCDateTime(new DateTime())]];;
    $result = $collection->find($query);

    // Display retrieved data
    ?>

<ul class="nav nav-tabs" id="myTab" role="tablist">
<li class="nav-item" role="presentation">
    <button class="nav-link active" id="cur-fut-tab" data-bs-toggle="tab" data-bs-target="#cur-fut" type="button" role="tab" aria-controls="cur-fut" aria-selected="false">Current/Future</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="past-tab" data-bs-toggle="tab" data-bs-target="#past" type="button" role="tab" aria-controls="past" aria-selected="true">Past</button>
  </li>
</ul>
<div class="tab-content" id="myTabContent">
  <div class="tab-pane fade show active" id="cur-fut" role="tabpanel" aria-labelledby="cur-fut-tab">
  <table class="table table-light table-hover">
		<thead>
			<tr class="table-light">
				<th>Starting Date</th>
				<th>Ending Date</th>
                <th>Archive</th>
				<th>Client</th> 
				<th>Delete</th>
			</tr>
		</thead>
		<tbody>
    <?php
    
    foreach ($result as $singleRental) { ?>
        <!-- Displaying Data Read From Database -->
        <tr class="table-light">
            <td data-id="start_date"><?php echo date("F j, Y, g:i a", date_timestamp_get($singleRental['starting_date']->toDateTime())); ?></td>
            <td data-id="end_date"><?php echo date("F j, Y, g:i a", date_timestamp_get($singleRental['end_date']->toDateTime())); ?></td>
            <td><a href="single-rental.php?rentalId=<?=$singleRental['_id']?>"><i class="bi bi-box-arrow-up-right" style="color: brown; cursor: pointer;"></i></a></td>
            <td><a href="single-client.php?userId=<?=$singleRental['client_id']?>"><i class="bi bi-person-square" style="color: brown; cursor: pointer;"></i></a></td>
            <td><i class="bi bi-x-circle" style="color: red; cursor: pointer;" data-collection="rental" data-id="<?=$singleRental['_id']?>"></i></td>
        </tr>
    <?php } ?>
		</tbody>
	</table>
  </div>
  <div class="tab-pane fade" id="past" role="tabpanel" aria-labelledby="past-tab">

  <?php


// PAST RENTAL

// Query to retrieve all the clients
$query = ['end_date' => ['$lt' => new MongoDB\BSON\UTCDateTime(new DateTime())]];
$result = $collection->find($query, array('sort' => ['end_date' => -1]));

// Display retrieved data
?>
<table class="table table-light table-hover">
    <thead>
        <tr class="table-light">
            <th>Starting Date</th>
            <th>Ending Date</th>
            <th>Archive</th>
            <th>Client</th>
        </tr>
    </thead>
    <tbody>
<?php

foreach ($result as $singleRental) { ?>
    <!-- Displaying Data Read From Database -->
    <tr class="table-light">
        <td data-id="start_date"><?php echo date("F j, Y, g:i a", date_timestamp_get($singleRental['starting_date']->toDateTime())); ?></td>
        <td data-id="end_date"><?php echo date("F j, Y, g:i a", date_timestamp_get($singleRental['end_date']->toDateTime())); ?></td>
        <td><a href="single-rental.php?rentalId=<?=$singleRental['_id']?>&past=true"><i class="bi bi-box-arrow-up-right" style="color: brown; cursor: pointer;"></i></a></td>
        <td><a href="single-client.php?userId=<?=$singleRental['client_id']?>"><i class="bi bi-person-square" style="color: brown; cursor: pointer;"></i></a></td>
    </tr>
<?php } ?>
    </tbody>
</table> 
  </div>
</div>



    <!-- Button trigger modal -->
    <button type="button" class="btn btn-primary btn-add-rental" data-bs-toggle="modal" data-bs-target="#staticBackdrop"><i class="bi bi-plus"></i></button>

    <!-- Modal -->
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">Add a Rental</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form action="" autocomplete="off">
                    <div class="modal-body">
                        <div class="container-fluid">
                            <div class="mb-3">
                                <label for="searchObjects" class="form-label">Object Rented</label>
                                <input required class="form-control" list="objectsList" id="searchObjects" data-collection="inventory" data-field-search="title" data-db-field="object_id" placeholder="Type to search...">
                                <datalist id="objectsList"></datalist>
                            </div>
                            <div class="mb-3">
                                <label for="searchClients" class="form-label">Client Renting</label>
                                <input required class="form-control" list="clientsList" id="searchClients" data-collection="clients" data-field-search="username" data-db-field="client_id" placeholder="Type to search...">
                                <datalist id="clientsList"></datalist>
                            </div>
                            <div class="mb-3">
                                <label for="rentalStartDate" class="form-label">Rental Starting Date</label>
                                <input required type="datetime-local" data-db-field="starting_date" class="form-control mb-3" id="rentalStartDate">
                                
                                <label for="rentalEndDate" class="form-label">Rental Ending Date</label>
                                <input required type="datetime-local" data-db-field="end_date" class="form-control mb-3" id="rentalEndDate">
                            </div>
                            
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" id="createRecord" class="btn btn-primary" data-collection="rental">Save Rental</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

<?php include("back-office-footer.php"); ?>