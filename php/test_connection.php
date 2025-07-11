<?php
// Database Connection Test
require_once 'config.php';

echo "<h2>Database Connection Test</h2>";

if ($conn) {
    echo "<p style='color: green;'>✓ Database connection successful!</p>";
    echo "<p><strong>Connected to:</strong> " . $database . "</p>";
    
    // Test if tables exist
    $tables = ['companies', 'travel_accounts', 'transactions', 'user_sessions'];
    echo "<h3>Checking Tables:</h3>";
    
    foreach ($tables as $table) {
        $result = mysqli_query($conn, "SHOW TABLES LIKE '$table'");
        if (mysqli_num_rows($result) > 0) {
            echo "<p style='color: green;'>✓ Table '$table' exists</p>";
        } else {
            echo "<p style='color: red;'>✗ Table '$table' not found</p>";
        }
    }
    
    echo "<hr>";
    echo "<p><a href='install.php' style='background: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-right: 10px;'>Run Installation</a>";
    echo "<a href='index.html' style='background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Go to Application</a></p>";
    echo "<p><strong>URLs:</strong></p>";
    echo "<ul>";
    echo "<li>Main App: <a href='http://localhost:8000/index.html' target='_blank'>http://localhost:8000/index.html</a></li>";
    echo "<li>Install: <a href='http://localhost:8000/install.php' target='_blank'>http://localhost:8000/install.php</a></li>";
    echo "</ul>";
    
} else {
    echo "<p style='color: red;'>✗ Database connection failed!</p>";
    echo "<p><strong>Error:</strong> " . mysqli_connect_error() . "</p>";
    echo "<p>Please check your database configuration in config.php</p>";
}

mysqli_close($conn);
?>

<!DOCTYPE html>
<html>
<head>
    <title>Database Test</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        h2, h3 {
            color: #333;
        }
        p {
            margin: 10px 0;
        }
        hr {
            margin: 30px 0;
            border: none;
            border-top: 2px solid #ddd;
        }
    </style>
</head>
</html>
