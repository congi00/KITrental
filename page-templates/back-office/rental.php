<?php 
    $sectionTitle = "Rental";
    include("back-office-header.php");

    // Connection to the DB and query to retrieve clients
    $dbName = "KITrental";
    $colName = "rental";
    include("../modules/db-config.php");

    // Query to retrieve all the clients
    $query = [];
    $result = $collection->find($query);

    // Display retrieved data
    ?>
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
            <td><?php echo date("F j, Y, g:i a", date_timestamp_get($singleRental['starting_date']->toDateTime())); ?></td>
            <td><?php echo date("F j, Y, g:i a", date_timestamp_get($singleRental['end_date']->toDateTime())); ?></td>
            <td><a href="single-rental.php?rentalId=<?=$singleRental['_id']?>"><i class="bi bi-box-arrow-up-right" style="color: brown; cursor: pointer;"></i></a></td>
            <td><a href="single-client.php?userId=<?=$singleRental['client_id']?>"><i class="bi bi-person-square" style="color: brown; cursor: pointer;"></i></a></td>
            <td><i class="bi bi-x-circle" style="color: red; cursor: pointer;" data-id="<?=$singleRental['_id']?>"></i></td>
        </tr>
    <?php }
?>
		</tbody>
	</table>

<?php include("back-office-footer.php"); ?>