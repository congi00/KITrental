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

    <div class="container pb-5 mb-sm-1">
        <div class="row">
    <!-- Displaying Data Read From Database -->
    <?php

    foreach ($result as $inventory) { ?>
      <div class="col-md-2 col-sm-6 mt-4">
            <div class="card border-0 mb-grid-gutter">
              <img src="../../img/products/<?php echo $inventory['image'];?>" width="100%">
                <div class="card-body border mt-n1 py-4 text-center">
                    <h2 class="h5 mb-1"><?php echo $inventory['name']; ?></h2>
                    <span class="d-block mb-3 font-size-xs text-muted"><b>Avaiability:</b><br> <?php echo $inventory['avaiability'];?><br>
                      <span class="font-weight-semibold"><b>State:</b><br> <?php echo $inventory['state']; ?>
                      </span></span>
                      <a href="single-inventory.php?prdId=<?=$inventory['_id']?>"><i class="bi bi-clipboard-plus" style="color: green; cursor: pointer;"></i></a>
                      <i class="bi bi-x-circle " style="margin-left: 15px; color: red; cursor: pointer;" data-collection="inventory" data-id="<?=$inventory['_id']?>"></i>
                </div>
            </div>
        </div>
    <?php }
    ?>
  </div>
</div>

<?php include("back-office-footer.php"); ?>
