<?php
    $sectionTitle = "Back-Office";
    include("page-templates/back-office/back-office-header.php"); 
?>
        <!-- Three Image Sections for visual menu -->
        <div class="container-fluid h-100">
            <div class="row h-100">
                <div id="clients-section" class="col-12 col-lg-4 bg-primary">
                    <a href="page-templates\back-office\clients.php" class="w-100 h-100">
                        <h1>Clients</h1>
                    </a>
                </div>
                <div id="inventory-section" class="col-12 col-lg-4 bg-secondary">
                    <a href="#" class="w-100 h-100">
                        <h1>Inventory</h1>
                    </a>
                </div>
                <div id="rental-section" class="col-12 col-lg-4 bg-success">
                    <a href="page-templates\back-office\rental.php" class="w-100 h-100">
                        <h1>Rental</h1>
                    </a>
                </div>
            </div>
        </div>

<?php include("page-templates/back-office/back-office-footer.php"); ?>
        