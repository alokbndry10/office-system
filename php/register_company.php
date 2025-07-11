<?php
session_start();
require_once 'config.php';

header('Content-Type: application/json');

// Function to generate unique account number
function generateAccountNumber() {
    return 'TAM' . date('Y') . rand(100000, 999999);
}

// Function to handle file upload
function handleLogoUpload($file) {
    $uploadDir = 'uploads/logos/';
    
    // Create upload directory if it doesn't exist
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    $maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!in_array($file['type'], $allowedTypes)) {
        return ['success' => false, 'message' => 'Invalid file type. Only JPEG, PNG, and GIF are allowed.'];
    }
    
    if ($file['size'] > $maxSize) {
        return ['success' => false, 'message' => 'File size too large. Maximum 5MB allowed.'];
    }
    
    $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $fileName = uniqid('logo_') . '.' . $fileExtension;
    $filePath = $uploadDir . $fileName;
    
    if (move_uploaded_file($file['tmp_name'], $filePath)) {
        return ['success' => true, 'path' => $filePath];
    } else {
        return ['success' => false, 'message' => 'Failed to upload file.'];
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Get form data
        $companyName = trim($_POST['company_name'] ?? '');
        $vatNumber = trim($_POST['vat_number'] ?? '');
        $address = trim($_POST['address'] ?? '');
        $phoneNumber = trim($_POST['phone_number'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';
        $confirmPassword = $_POST['confirm_password'] ?? '';
        
        // Validation
        $errors = [];
        
        if (empty($companyName)) $errors[] = 'Company name is required';
        if (empty($vatNumber)) $errors[] = 'VAT number is required';
        if (empty($address)) $errors[] = 'Address is required';
        if (empty($phoneNumber)) $errors[] = 'Phone number is required';
        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Valid email is required';
        }
        if (strlen($password) < 6) $errors[] = 'Password must be at least 6 characters';
        if ($password !== $confirmPassword) $errors[] = 'Passwords do not match';
        
        if (!empty($errors)) {
            echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
            exit;
        }
        
        // Check if email or VAT number already exists
        $checkQuery = "SELECT id FROM companies WHERE email = ? OR vat_number = ?";
        $checkStmt = mysqli_prepare($conn, $checkQuery);
        mysqli_stmt_bind_param($checkStmt, "ss", $email, $vatNumber);
        mysqli_stmt_execute($checkStmt);
        $result = mysqli_stmt_get_result($checkStmt);
        
        if (mysqli_num_rows($result) > 0) {
            echo json_encode(['success' => false, 'message' => 'Email or VAT number already exists']);
            exit;
        }
        
        // Handle logo upload
        $logoPath = null;
        if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
            $uploadResult = handleLogoUpload($_FILES['logo']);
            if (!$uploadResult['success']) {
                echo json_encode($uploadResult);
                exit;
            }
            $logoPath = $uploadResult['path'];
        }
        
        // Hash password
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        
        // Start transaction
        mysqli_begin_transaction($conn);
        
        try {
            // Insert company
            $insertQuery = "INSERT INTO companies (company_name, vat_number, address, phone_number, email, password_hash, logo_path) VALUES (?, ?, ?, ?, ?, ?, ?)";
            $insertStmt = mysqli_prepare($conn, $insertQuery);
            mysqli_stmt_bind_param($insertStmt, "sssssss", $companyName, $vatNumber, $address, $phoneNumber, $email, $passwordHash, $logoPath);
            
            if (!mysqli_stmt_execute($insertStmt)) {
                throw new Exception('Failed to register company');
            }
            
            $companyId = mysqli_insert_id($conn);
            
            // Create default travel account
            $accountNumber = generateAccountNumber();
            $accountName = $companyName . " - Main Account";
            
            $accountQuery = "INSERT INTO travel_accounts (company_id, account_number, account_name, account_type) VALUES (?, ?, ?, 'business')";
            $accountStmt = mysqli_prepare($conn, $accountQuery);
            mysqli_stmt_bind_param($accountStmt, "iss", $companyId, $accountNumber, $accountName);
            
            if (!mysqli_stmt_execute($accountStmt)) {
                throw new Exception('Failed to create travel account');
            }
            
            // Commit transaction
            mysqli_commit($conn);
            
            echo json_encode([
                'success' => true, 
                'message' => 'Company registered successfully!',
                'company_id' => $companyId,
                'account_number' => $accountNumber
            ]);
            
        } catch (Exception $e) {
            mysqli_rollback($conn);
            throw $e;
        }
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Registration failed: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>
