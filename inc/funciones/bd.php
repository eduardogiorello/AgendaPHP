<?php
//credenciales
define('DB_USUARIO', 'root');
define('DB_PASSWORD', '');
define('DB_HOST', 'localhost');
define('DB_NOMBRE', 'agendaphp');

$conn = new mYsqli(DB_HOST, DB_USUARIO, DB_PASSWORD, DB_NOMBRE);
// echo $conn->ping();