<?php
    $sectionTitle = "Single Product";
    include("back-office-header.php");

    // Connection to the DB
    $dbName = "KITrental";
    $colName = "inventory";
    include("../modules/db-config.php");

    // Retrieve single product, getting the ID from the URL parameter
    $inventoryId = $_GET['prdId'];

    $query = ['_id' => new MongoDB\BSON\ObjectID($inventoryId)];
    $singleInventory = $collection->findOne($query);

    $actualAvaiability = isset($singleInventory['avaiability']) ? ($singleInventory['avaiability'] == "avaiable" ? "avaiable" : "rented") : '';
    $nextAvaiability = $actualAvaiability == "avaiable" ? "rented" : "avaiable";
    ?>

    <div class="row">
        <div class="col-md-4 p-5">
            <img class="img-fluid img-thumbnail" src="<?php echo !empty($singleInventory['image']) ? "../../img/products/".$singleInventory['image'] : $base_url . 'img\profile-placeholder.png';?>" alt="Product photo">
        </div>
        <div class="col-md-8 p-5">
            <form action="">
                <label for="productName" class="form-label">Product Name</label>
                <input type="text" data-db-field="name" class="form-control mb-3" id="productName" value="<?php echo isset($singleInventory['name']) ? $singleInventory['name'] : ''; ?>" readonly>

                <label for="productAvaiability" class="form-label">Avaiability</label><br>
                <select id="productAvaiable" name="avaiability" data-db-field="avaiability" disabled>
                  <option value="<?php echo $actualAvaiability;?>"><?php echo $actualAvaiability;?></option>
                  <option value="<?php echo $nextAvaiability;?>"><?php echo $nextAvaiability;?></option>
                </select>
                <br>


                <label for="productState" class="form-label">State</label>
                <input type="text" data-db-field="state" class="form-control mb-4" id="productState" value="<?php echo isset($singleInventory['state']) ? $singleInventory['state'] : ''; ?>" readonly>
                <button id="updateData" type="button" class="btn btn-primary" data-collection="inventory" data-id="<?=$singleInventory['_id']?>">Update Data</button>
            </form>
        </div>
	</div>

<?php include("back-office-footer.php"); ?>
