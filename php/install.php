<?php
// Database Installation Script
// This script will automatically create the database and required tables

echo "<!DOCTYPE html>
<html>
<head>
    <title>Travel Account System - Database Setup</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            margin-bottom: 30px;
        }
        .success { color: green; }
        .error { color: red; }
        .info { color: blue; }
        .step {
            background: white;
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
            border-left: 4px solid #667eea;
        }
        .button {
            background: #4CAF50;
            color: white;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            margin: 10px 5px;
        }
        .button:hover { background: #45a049; }
    </style>
</head>
<body>";

echo "<div class='header'>
    <h1>🚀 Travel Account Management System</h1>
    <h2>Database Setup & Installation</h2>
</div>";

$success_count = 0;
$error_count = 0;

// Step 1: Create Database
echo "<div class='step'>";
echo "<h3>Step 1: Creating Database</h3>";

$hostname = "localhost";
$username = "root";
$password = "";
$database = "account_system";

// Connect without database to create it
$temp_conn = mysqli_connect($hostname, $username, $password);

if (!$temp_conn) {
    echo "<p class='error'>✗ Cannot connect to MySQL server: " . mysqli_connect_error() . "</p>";
    echo "<p><strong>Solution:</strong> Make sure XAMPP MySQL is running!</p>";
    exit;
}

$create_db_sql = "CREATE DATABASE IF NOT EXISTS $database";
if (mysqli_query($temp_conn, $create_db_sql)) {
    echo "<p class='success'>✓ Database '$database' created/verified successfully</p>";
    $success_count++;
} else {
    echo "<p class='error'>✗ Error creating database: " . mysqli_error($temp_conn) . "</p>";
    $error_count++;
}

mysqli_close($temp_conn);
echo "</div>";

// Step 2: Connect to database and create tables
echo "<div class='step'>";
echo "<h3>Step 2: Creating Tables</h3>";

require_once 'config.php';

// SQL statements to create tables
$sql_statements = [
    // Companies table
    "CREATE TABLE IF NOT EXISTS companies (
        id INT PRIMARY KEY AUTO_INCREMENT,
        company_name VARCHAR(255) NOT NULL,
        vat_number VARCHAR(50) UNIQUE NOT NULL,
        address TEXT NOT NULL,
        phone_number VARCHAR(20) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        logo_path VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )",
    
    // Travel accounts table
    "CREATE TABLE IF NOT EXISTS travel_accounts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        company_id INT NOT NULL,
        account_number VARCHAR(50) UNIQUE NOT NULL,
        account_name VARCHAR(100) NOT NULL,
        account_type ENUM('business', 'personal', 'corporate') DEFAULT 'business',
        balance DECIMAL(15,2) DEFAULT 0.00,
        currency VARCHAR(3) DEFAULT 'USD',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
    )",
    
    // Transactions table
    "CREATE TABLE IF NOT EXISTS transactions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        account_id INT NOT NULL,
        transaction_type ENUM('credit', 'debit') NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        description TEXT,
        reference_number VARCHAR(100),
        transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INT NOT NULL,
        FOREIGN KEY (account_id) REFERENCES travel_accounts(id) ON DELETE CASCADE,
        FOREIGN KEY (created_by) REFERENCES companies(id) ON DELETE CASCADE
    )",
    
    // User sessions table
    "CREATE TABLE IF NOT EXISTS user_sessions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        company_id INT NOT NULL,
        session_token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
    )"
];

// Index statements
$index_statements = [
    "CREATE INDEX IF NOT EXISTS idx_companies_email ON companies(email)",
    "CREATE INDEX IF NOT EXISTS idx_companies_vat ON companies(vat_number)",
    "CREATE INDEX IF NOT EXISTS idx_travel_accounts_company ON travel_accounts(company_id)",
    "CREATE INDEX IF NOT EXISTS idx_transactions_account ON transactions(account_id)",
    "CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date)",
    "CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token)"
];

$success_count = 0;
$error_count = 0;

// Execute table creation statements
foreach ($sql_statements as $index => $sql) {
    $table_names = ['companies', 'travel_accounts', 'transactions', 'user_sessions'];
    $table_name = $table_names[$index];
    
    if (mysqli_query($conn, $sql)) {
        echo "<p class='success'>✓ Table '$table_name' created successfully</p>";
        $success_count++;
    } else {
        echo "<p class='error'>✗ Error creating table '$table_name': " . mysqli_error($conn) . "</p>";
        $error_count++;
    }
}

echo "</div>";

echo "<div class='step'>";
echo "<h3>Step 3: Creating Indexes</h3>";

// Execute index creation statements
foreach ($index_statements as $sql) {
    if (mysqli_query($conn, $sql)) {
        echo "<p class='success'>✓ Index created successfully</p>";
        $success_count++;
    } else {
        echo "<p class='error'>✗ Error creating index: " . mysqli_error($conn) . "</p>";
        $error_count++;
    }
}

echo "</div>";

// Step 4: Create uploads directory
echo "<div class='step'>";
echo "<h3>Step 4: Setting Up File Storage</h3>";

$uploads_dir = '../uploads/logos/';
if (!is_dir($uploads_dir)) {
    if (mkdir($uploads_dir, 0755, true)) {
        echo "<p class='success'>✓ Created uploads directory: $uploads_dir</p>";
        $success_count++;
    } else {
        echo "<p class='error'>✗ Failed to create uploads directory: $uploads_dir</p>";
        $error_count++;
    }
} else {
    echo "<p class='info'>ℹ️ Uploads directory already exists: $uploads_dir</p>";
    $success_count++;
}

echo "</div>";

// Final Summary
echo "<div class='step' style='border-left-color: " . ($error_count == 0 ? "#4CAF50" : "#f44336") . ";'>";
echo "<h3>🎯 Installation Summary</h3>";
echo "<p><strong>Successful operations:</strong> $success_count</p>";
echo "<p><strong>Failed operations:</strong> $error_count</p>";

if ($error_count == 0) {
    echo "<div style='background: #d4edda; padding: 20px; border-radius: 5px; margin: 15px 0;'>";
    echo "<h3 style='color: #155724; margin: 0;'>🎉 Setup Completed Successfully!</h3>";
    echo "<p style='color: #155724; margin: 10px 0;'>Your Travel Account Management System is ready to use!</p>";
    echo "</div>";
    
    echo "<h4>🚀 Quick Start Options:</h4>";
    echo "<div style='text-align: center; margin: 20px 0;'>";
    
    // Check if running on PHP built-in server or Apache
    $server_port = $_SERVER['SERVER_PORT'] ?? '80';
    $base_url = "http://localhost" . ($server_port != '80' ? ":$server_port" : "");
    
    if ($server_port == '8000') {
        // Running on PHP built-in server
        echo "<a href='../index.html' class='button'>📱 Start Using System</a>";
        echo "<p><strong>Current URL:</strong> <a href='$base_url/index.html' target='_blank'>$base_url/index.html</a></p>";
    } else {
        // Running on Apache (XAMPP)
        $xampp_url = "http://localhost/office-system/html/index.html";
        echo "<a href='../html/index.html' class='button'>📱 Start Using System</a>";
        echo "<p><strong>XAMPP URL:</strong> <a href='$xampp_url' target='_blank'>$xampp_url</a></p>";
    }
    
    echo "</div>";
    
    echo "<div style='background: #cce5ff; padding: 15px; border-radius: 5px; margin: 15px 0;'>";
    echo "<h4 style='color: #004085; margin: 0;'>📝 Next Steps:</h4>";
    echo "<ol style='color: #004085; margin: 10px 0;'>";
    echo "<li>Click 'Start Using System' above</li>";
    echo "<li>Register your company account</li>";
    echo "<li>Login and start managing your travel accounts</li>";
    echo "</ol>";
    echo "</div>";
    
} else {
    echo "<div style='background: #f8d7da; padding: 20px; border-radius: 5px; margin: 15px 0;'>";
    echo "<h3 style='color: #721c24; margin: 0;'>⚠️ Setup Issues Detected</h3>";
    echo "<p style='color: #721c24; margin: 10px 0;'>Some errors occurred during setup. Please:</p>";
    echo "<ul style='color: #721c24;'>";
    echo "<li>Make sure XAMPP MySQL service is running</li>";
    echo "<li>Check database permissions</li>";
    echo "<li>Refresh this page to try again</li>";
    echo "</ul>";
    echo "</div>";
}

echo "</div>";

mysqli_close($conn);

echo "</body></html>";
