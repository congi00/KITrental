<?php
  // https://stackoverflow.com/questions/44136256/how-can-i-use-php-to-set-my-navbar-hrefs-to-absolute-paths
  $base_url = "http://localhost/KITrental/"; // REMEMBER TO EDIT WITH LIVE SITE
  // $base_url_CONGIU = "http://localhost:8000/;
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.6.1/font/bootstrap-icons.css">
        <script type="text/javascript" src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"></script>
        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" />
        <link rel="stylesheet" href="<?=$base_url?>css/back-office.css">
        <title>KITRental - <?php echo $sectionTitle; ?></title>
    </head>
    <body>
    <?php if ($sectionTitle != "Back-Office") : ?>
        <!-- Boostrap Navbar -->
        <nav class="navbar navbar-expand-lg">
            <div class="container-fluid ">
              <img src="../../img/logos/KITrental-logos_white.png"></img>
              <!--<a class="navbar-brand text-white" href="<?=$base_url?>back-office.php">Home</a>
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>-->
              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                  <li class="nav-item ">
                    <a class="nav-link active text-white" aria-current="page" href="clients.php">Clients</a>
                  </li>
                  <li class="nav-item ">
                    <a class="nav-link active text-white" aria-current="page" href="inventory.php">inventory</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link text-white" href="<?=$base_url?>page-templates/back-office/rental.php">Rental</a>
                  </li>
                  <!--<li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Dropdown
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                      <li><a class="dropdown-item" href="#">Action</a></li>
                      <li><a class="dropdown-item" href="#">Another action</a></li>
                      <li><hr class="dropdown-divider"></li>
                      <li><a class="dropdown-item" href="#">Something else here</a></li>
                    </ul>
                  </li>-->
                  <!--<li class="nav-item">
                    <a class="nav-link disabled">Disabled</a>
                  </li>-->
                </ul>

                <!-- Search Form-->
                <form class="d-flex">
                  <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                  <button class="btn btn-outline-success" type="submit">Search</button>
                </form>
              </div>
            </div>
        </nav>
    <?php endif; ?>
