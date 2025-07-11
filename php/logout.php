<?php
session_start();
require_once 'config.php';

header('Content-Type: application/json');

try {
    if (isset($_SESSION['user_id']) && isset($_SESSION['session_token'])) {
        $sessionToken = $_SESSION['session_token'];
        $userId = $_SESSION['user_id'];
        
        // Delete session from database
        $deleteQuery = "DELETE FROM user_sessions WHERE session_token = ? AND company_id = ?";
        $deleteStmt = mysqli_prepare($conn, $deleteQuery);
        mysqli_stmt_bind_param($deleteStmt, "si", $sessionToken, $userId);
        mysqli_stmt_execute($deleteStmt);
    }
    
    // Destroy session
    session_destroy();
    
    echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Logout error: ' . $e->getMessage()]);
}
?>
