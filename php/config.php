<?php

$hostname = "localhost";
$username = "root";
$password = "";
$database = "account_system";

// First connect without selecting a database to create it if needed
$temp_conn = mysqli_connect($hostname, $username, $password);

if (!$temp_conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Create database if it doesn't exist
$create_db_sql = "CREATE DATABASE IF NOT EXISTS $database";
if (!mysqli_query($temp_conn, $create_db_sql)) {
    die("Error creating database: " . mysqli_error($temp_conn));
}

mysqli_close($temp_conn);

// Now connect to the specific database
$conn = mysqli_connect($hostname, $username, $password, $database);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Set charset to UTF-8
mysqli_set_charset($conn, "utf8"); 