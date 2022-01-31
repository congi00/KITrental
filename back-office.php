<?php
    $sectionTitle = "Back-Office";
    include("page-templates/back-office/back-office-header.php");
?>

    <?php if (isset($_SESSION['loggedIn'])){ ?>
        <!-- Three Image Sections for visual menu -->
        <div class="container-fluid h-100">
            <div class="row h-100">
                <div id="clients-section" class="col-12 col-lg-4 bg-primary sectionsBack">
                    <a href="page-templates\back-office\clients.php" class="w-100 h-100">
                        <h1 class="text-white text-uppercase">Clients</h1>
                    </a>
                </div>
                <div id="inventory-section" class="col-12 col-lg-4 bg-secondary sectionsBack">
                    <a href="page-templates\back-office\inventory.php" class="w-100 h-100">
                        <h1 class="text-white text-uppercase">Inventory</h1>
                    </a>
                </div>
                <div id="rental-section" class="col-12 col-lg-4 bg-success sectionsBack">
                    <a href="page-templates\back-office\rental.php" class="w-100 h-100">
                        <h1 class="text-white text-uppercase">Rental</h1>
                    </a>
                </div>
            </div>
        </div>
    <?php }else{ ?>
      <div class="container-fluid h-100">

          <div class="row h-100" id="backendLogin">
              <div class="col-12 col-lg-7">
                <div id="titleCF">
                  <h2 class="text-white display-3 text-center ">Welcome in the</h2>
                </div>
                <div id="titleCS">
                  <h2 class="text-white display-3 text-center ">Back Office</h2>
                </div>

              </div>
              <div class="col-12 col-lg-5">
                <form id="formEmployees" action="page-templates/back-office/authentication.php">
                  <div class="text-center">
                    <img src="<?=$base_url?>img/logos/KITrental-logos_black.png" alt="logo">
                  </div>
                  <h3 class="fw-normal mb-2 pb-3 mt-4 pt-4 text-center" style="letter-spacing: 1px;">Log in</h3>

                  <div class="form-outline mb-3">
                    <label class="form-label" for="emplId">Email address</label>
                    <input type="email" name="emplId" id="emplUsername" class="form-control form-control-md" required>
                  </div>

                  <div class="form-outline mb-4">
                    <label class="form-label" for="emplPw">Password</label>
                    <input type="password" name="emplPw" id="emplPassword" class="form-control form-control-md" required>
                  </div>

                  <div class="pt-1 mb-4">
                    <button class="btn btn-info btn-lg btn-block btn-dark" type="button">Login</button>
                  </div>

                  <p class="small mb-5 pb-lg-2 text-center"><a class="text-muted" href="#!">Forgot password?</a></p>

                </form>
              </div>
          </div>
      </div>
    <?php }?>

<?php include("page-templates/back-office/back-office-footer.php"); ?>
