<?php
session_start();
require_once 'config.php';

header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $userId = $_SESSION['user_id'];
        $accountName = trim($_POST['account_name'] ?? '');
        $accountType = trim($_POST['account_type'] ?? '');
        $currency = trim($_POST['currency'] ?? '');
        
        // Validation
        if (empty($accountName) || empty($accountType) || empty($currency)) {
            echo json_encode(['success' => false, 'message' => 'All fields are required']);
            exit;
        }
        
        // Generate unique account number
        do {
            $accountNumber = 'TAM' . date('Y') . rand(100000, 999999);
            $checkQuery = "SELECT id FROM travel_accounts WHERE account_number = ?";
            $checkStmt = mysqli_prepare($conn, $checkQuery);
            mysqli_stmt_bind_param($checkStmt, "s", $accountNumber);
            mysqli_stmt_execute($checkStmt);
            $exists = mysqli_num_rows(mysqli_stmt_get_result($checkStmt)) > 0;
        } while ($exists);
        
        // Insert new account
        $insertQuery = "INSERT INTO travel_accounts (company_id, account_number, account_name, account_type, currency) 
                        VALUES (?, ?, ?, ?, ?)";
        $insertStmt = mysqli_prepare($conn, $insertQuery);
        mysqli_stmt_bind_param($insertStmt, "issss", $userId, $accountNumber, $accountName, $accountType, $currency);
        
        if (mysqli_stmt_execute($insertStmt)) {
            echo json_encode([
                'success' => true,
                'message' => 'Account created successfully',
                'account_number' => $accountNumber
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to create account']);
        }
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>
