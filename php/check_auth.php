<?php
session_start();
require_once 'config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

try {
    // Verify session token if it exists
    if (isset($_SESSION['session_token'])) {
        $sessionToken = $_SESSION['session_token'];
        $userId = $_SESSION['user_id'];
        
        $query = "SELECT id FROM user_sessions WHERE session_token = ? AND company_id = ? AND expires_at > NOW()";
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, "si", $sessionToken, $userId);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        
        if (mysqli_num_rows($result) === 0) {
            // Session expired or invalid
            session_destroy();
            echo json_encode(['success' => false, 'message' => 'Session expired']);
            exit;
        }
    }
    
    // Get user info
    $userQuery = "SELECT id, company_name, username FROM companies WHERE id = ? AND is_active = 1";
    $userStmt = mysqli_prepare($conn, $userQuery);
    mysqli_stmt_bind_param($userStmt, "i", $_SESSION['user_id']);
    mysqli_stmt_execute($userStmt);
    $userResult = mysqli_stmt_get_result($userStmt);
    
    if (mysqli_num_rows($userResult) === 0) {
        session_destroy();
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit;
    }
    
    $user = mysqli_fetch_assoc($userResult);
    
    echo json_encode([
        'success' => true,
        'user' => $user
    ]);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>
