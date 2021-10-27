<?php 
    $sectionTitle = "Inventory";
    include("back-office-header.php");

    // Connection to the DB and query to retrieve clients
    $dbName = "KITrental";
    $colName = "inventory";
    include("../modules/db-config.php");

    $query = [];
    $result = $collection->find($query);

    // Display retrieved data
    ?>
    <table class="table table-light table-hover">
		<thead>
			<tr class="table-light">
				<th>Username</th>
				<th>Address</th>
				<th>Archive</th>
				<th>Delete</th>
			</tr>
		</thead>
		<tbody>
    <?php
    
    foreach ($result as $client) { ?>
        <!-- Displaying Data Read From Database -->
        <tr class="table-light">
            <td><?php echo $client['username']; ?></td>
            <td><?php echo $client['address']; ?></td>
            <td><a href="single-client.php?usr=<?=$client['username']?>"><i class="bi bi-box-arrow-up-right" style="color: brown; cursor: pointer;"></i></a></td>
            <td><i class="bi bi-x-circle" style="color: red; cursor: pointer;" data-user="<?=$client['username']?>"></i></td>
        </tr>
    <?php }
?>
		</tbody>
	</table>

<?php include("back-office-footer.php"); ?>