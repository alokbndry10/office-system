<?php
session_start();
require_once 'config.php';

header('Content-Type: application/json');

// Function to generate session token
function generateSessionToken() {
    return bin2hex(random_bytes(32));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Check database connection first
        if (!$conn) {
            echo json_encode(['success' => false, 'message' => 'Server error. Please try again later.']);
            exit;
        }
        
        $email = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';
        
        // Validation
        if (empty($email) || empty($password)) {
            echo json_encode(['success' => false, 'message' => 'Email and password are required']);
            exit;
        }
        
        // Validate email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(['success' => false, 'message' => 'Please enter a valid email address']);
            exit;
        }
        
        // Check if user exists in database
        $query = "SELECT id, company_name, password_hash, is_active FROM companies WHERE email = ?";
        $stmt = mysqli_prepare($conn, $query);
        
        if (!$stmt) {
            echo json_encode(['success' => false, 'message' => 'Server error. Please try again later.']);
            exit;
        }
        
        mysqli_stmt_bind_param($stmt, "s", $email);
        
        if (!mysqli_stmt_execute($stmt)) {
            echo json_encode(['success' => false, 'message' => 'Server error. Please try again later.']);
            exit;
        }
        
        $result = mysqli_stmt_get_result($stmt);
        
        if (mysqli_num_rows($result) === 0) {
            // User not found - return generic error message for security
            echo json_encode(['success' => false, 'message' => 'Your email or password is wrong']);
            exit;
        }
        
        $user = mysqli_fetch_assoc($result);
        
        // Check if account is active
        if (!$user['is_active']) {
            echo json_encode(['success' => false, 'message' => 'Account is deactivated. Please contact support.']);
            exit;
        }
        
        // Verify password
        if (!password_verify($password, $user['password_hash'])) {
            // Wrong password - return generic error message for security
            echo json_encode(['success' => false, 'message' => 'Your email or password is wrong']);
            exit;
        }
        
        // Generate session token
        $sessionToken = generateSessionToken();
        $expiresAt = date('Y-m-d H:i:s', time() + (24 * 60 * 60)); // 24 hours
        
        // Clean up old sessions for this user
        $cleanupQuery = "DELETE FROM user_sessions WHERE company_id = ? OR expires_at < NOW()";
        $cleanupStmt = mysqli_prepare($conn, $cleanupQuery);
        
        if (!$cleanupStmt) {
            echo json_encode(['success' => false, 'message' => 'Server error. Please try again later.']);
            exit;
        }
        
        mysqli_stmt_bind_param($cleanupStmt, "i", $user['id']);
        mysqli_stmt_execute($cleanupStmt);
        
        // Create new session in database
        $sessionQuery = "INSERT INTO user_sessions (company_id, session_token, expires_at) VALUES (?, ?, ?)";
        $sessionStmt = mysqli_prepare($conn, $sessionQuery);
        
        if (!$sessionStmt) {
            echo json_encode(['success' => false, 'message' => 'Server error. Please try again later.']);
            exit;
        }
        
        mysqli_stmt_bind_param($sessionStmt, "iss", $user['id'], $sessionToken, $expiresAt);
        
        if (mysqli_stmt_execute($sessionStmt)) {
            // Set PHP session variables
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['company_name'] = $user['company_name'];
            $_SESSION['session_token'] = $sessionToken;
            
            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'user' => [
                    'id' => $user['id'],
                    'company_name' => $user['company_name']
                ]
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Server error. Please try again later.']);
        }
        
    } catch (mysqli_sql_exception $e) {
        // Database connection or query error
        error_log("Database error in login.php: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Server error. Please try again later.']);
    } catch (Exception $e) {
        // General error
        error_log("General error in login.php: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Server error. Please try again later.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

// Close database connection
if (isset($conn)) {
    mysqli_close($conn);
}
?>
