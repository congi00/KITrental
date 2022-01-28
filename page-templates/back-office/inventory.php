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
				<th>Image</th>
				<th>Name</th>
				<th>Avaiability</th>
				<th>State</th>
        <th>Delete</th>
        <th>Info</th>
			</tr>
		</thead>
		<tbody>
    <?php

    foreach ($result as $inventory) { ?>
        <!-- Displaying Data Read From Database -->
        <tr id="productTbl" class="table-light">
            <td style="background:url(../../img/products/<?php echo $inventory['image'];?>);background-size:100% 100%;"></td>
            <td><?php echo $inventory['name']; ?></td>
            <td><?php echo $inventory['avaiability']; ?></td>
            <td><?php echo $inventory['state']; ?></td>
            <td><i class="bi bi-x-circle" style="color: red; cursor: pointer;" data-collection="inventory" data-id="<?=$inventory['_id']?>"></i></td>
            <td><a href="single-inventory.php?prdId=<?=$inventory['_id']?>"><i class="bi bi-clipboard-plus" style="color: brown; cursor: pointer;"></i></a></td>
        </tr>
    <?php }
    ?>
		</tbody>
	</table>

<?php include("back-office-footer.php"); ?>
