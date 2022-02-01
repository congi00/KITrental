<?php
  // https://stackoverflow.com/questions/44136256/how-can-i-use-php-to-set-my-navbar-hrefs-to-absolute-paths
  //$base_url = "http://localhost/KITrental/"; //FRAVI REMEMBER TO EDIT WITH LIVE SITE
  $base_url = "http://localhost:8000/"; //CONGIU
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
        <link rel="stylesheet" href="<?=$base_url?>css/front-office.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

        <!--Reactstrap-->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/react/16.8.4/umd/react.production.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.8.4/umd/react-dom.production.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/reactstrap/4.8.0/reactstrap.min.js" ></script>
        <!-- Load React. -->
        <!-- Note: when deploying, replace "development.js" with "production.min.js". -->
        <script src="https://unpkg.com/react@17/umd/react.development.js" crossorigin></script>
        <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" crossorigin></script>
        <!-- React Router DOM -->
        <script src='https://unpkg.com/react-router-dom@5.0.0/umd/react-router-dom.min.js'></script>
        <!-- Load JSX -->
        <script src="https://unpkg.com/babel-standalone@6.26.0/babel.js"></script>

        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.6.1/font/bootstrap-icons.css">
        <script type="text/javascript" src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"></script>
        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" />

        <title>KITRental - <?php echo $sectionTitle; ?></title>
    </head>
    <body>
      <div id="root"></div>
