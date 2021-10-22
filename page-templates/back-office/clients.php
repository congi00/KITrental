<?php 
    $sectionTitle = "Clients";
    include("back-office-header.php");

    // Connection to the DB and query to retrieve clients
    include("../modules/db-config.php");

    $query = "SELECT * FROM clients";
    $result = mysqli_query($con, $query);

    // Display retrieved data
    ?>
    <table class="table table-light table-hover">
		<thead>
			<tr class="table-light">
				<th>Username</th>
				<th>Address</th>
				<th>Rental</th>
				<th>Edit</th>
				<th>Delete</th>
			</tr>
		</thead>
		<tbody>
    <?php
    
    while ($row = mysqli_fetch_array($result)) { ?>
        <!-- Displaying Data Read From Database -->
        <tr class="table-light">
            <td><?php echo $row['username']; ?></td>
            <td><?php echo $row['address']; ?></td>
            <td><i class="bi bi-box-arrow-up-right" style="color: brown;"></i></td>
            <td><i class="bi bi-pencil-square" style="color: grey;"></i></td>
            <td><i class="bi bi-x-circle" style="color: red;" data-user="<?=$row['username']?>"></i></td>
        </tr>
    <?php }
    mysqli_close($con);

?>
		</tbody>
	</table>

<?php include("back-office-footer.php"); ?>
