<?php
session_start();
include 'database.php';

$error = '';
$success = '';

// Handle signup form submission
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['signup'])) {
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    $first_name = mysqli_real_escape_string($conn, $_POST['first_name']);
    $last_name = mysqli_real_escape_string($conn, $_POST['last_name']);
    $company = mysqli_real_escape_string($conn, $_POST['company']);
    
    // Validation
    if (empty($email) || empty($password) || empty($first_name) || empty($last_name)) {
        $error = "All fields except company are required";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Invalid email format";
    } elseif (strlen($password) < 6) {
        $error = "Password must be at least 6 characters";
    } elseif ($password !== $confirm_password) {
        $error = "Passwords do not match";
    } else {
        // Check if email already exists
        $check_query = "SELECT * FROM users WHERE email = '$email'";
        $check_result = mysqli_query($conn, $check_query);
        
        if (mysqli_num_rows($check_result) > 0) {
            $error = "Email already registered";
        } else {
            // Hash password
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            
            // Insert new user
            $insert_query = "INSERT INTO users (email, password, first_name, last_name, company, role, is_active) 
                           VALUES ('$email', '$hashed_password', '$first_name', '$last_name', '$company', 'User', 1)";
            
            if (mysqli_query($conn, $insert_query)) {
                $success = "Account created successfully! Redirecting to login...";
                // Auto-login after signup
                $user_id = mysqli_insert_id($conn);
                $_SESSION['user_id'] = $user_id;
                $_SESSION['email'] = $email;
                $_SESSION['name'] = $first_name . ' ' . $last_name;
                $_SESSION['role'] = 'User';
                
                // Redirect after 2 seconds
                header("refresh:2;url=index.php");
            } else {
                $error = "Error creating account: " . mysqli_error($conn);
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up - CatalogAI</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="login-screen">
        <div class="login-container">
            <div class="login-card card">
                <div class="login-glow"></div>
                <div class="login-header">
                    <div class="logo">
                        <svg class="logo-icon" width="40" height="40" viewBox="0 0 40 40" fill="none">
                            <rect width="40" height="40" rx="10" fill="url(#logoGradient)"/>
                            <path d="M20 10 L28 16 L28 24 L20 30 L12 24 L12 16 Z" stroke="white" stroke-width="2" fill="none"/>
                            <circle cx="20" cy="20" r="3" fill="white"/>
                            <defs>
                                <linearGradient id="logoGradient" x1="0" y1="0" x2="40" y2="40">
                                    <stop offset="0%" style="stop-color:#2563EB"/>
                                    <stop offset="100%" style="stop-color:#10B981"/>
                                </linearGradient>
                            </defs>
                        </svg>
                        <div>
                            <h1 class="logo-title">Create Account</h1>
                            <p class="logo-subtitle">Join CatalogAI today</p>
                        </div>
                    </div>
                </div>
                
                <?php if ($error): ?>
                    <div style="padding: 12px; background: rgba(239, 68, 68, 0.1); border: 1px solid #EF4444; border-radius: 8px; margin-bottom: 20px; color: #EF4444; font-size: 14px;">
                        ⚠️ <?php echo $error; ?>
                    </div>
                <?php endif; ?>
                
                <?php if ($success): ?>
                    <div style="padding: 12px; background: rgba(16, 185, 129, 0.1); border: 1px solid #10B981; border-radius: 8px; margin-bottom: 20px; color: #10B981; font-size: 14px;">
                        ✓ <?php echo $success; ?>
                    </div>
                <?php endif; ?>
                
                <form method="POST" class="login-form">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div class="form-group">
                            <label for="first_name">First Name</label>
                            <input type="text" id="first_name" name="first_name" placeholder="John" required 
                                   value="<?php echo isset($_POST['first_name']) ? htmlspecialchars($_POST['first_name']) : ''; ?>">
                        </div>
                        <div class="form-group">
                            <label for="last_name">Last Name</label>
                            <input type="text" id="last_name" name="last_name" placeholder="Doe" required
                                   value="<?php echo isset($_POST['last_name']) ? htmlspecialchars($_POST['last_name']) : ''; ?>">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="you@company.com" required
                               value="<?php echo isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>">
                    </div>
                    
                    <div class="form-group">
                        <label for="company">Company (Optional)</label>
                        <input type="text" id="company" name="company" placeholder="Your Company Inc."
                               value="<?php echo isset($_POST['company']) ? htmlspecialchars($_POST['company']) : ''; ?>">
                    </div>
                    
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" placeholder="••••••••" required>
                        <span style="font-size: 11px; color: #64748B; margin-top: 4px; display: block;">Minimum 6 characters</span>
                    </div>
                    
                    <div class="form-group">
                        <label for="confirm_password">Confirm Password</label>
                        <input type="password" id="confirm_password" name="confirm_password" placeholder="••••••••" required>
                    </div>
                    
                    <button type="submit" name="signup" class="btn btn-primary btn-full">
                        <span>Create Account</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="m9 18 6-6-6-6"/>
                        </svg>
                    </button>
                </form>
                
                <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #475569;">
                    <p style="color: #94A3B8; font-size: 14px; margin: 0;">
                        Already have an account? 
                        <a href="index.php" style="color: #3B82F6; text-decoration: none; font-weight: 600;">Sign In</a>
                    </p>
                </div>
                
                <div class="login-features">
                    <div class="feature-item">
                        <svg class="feature-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                        </svg>
                        <span>AI-Powered Cataloging</span>
                    </div>
                    <div class="feature-item">
                        <svg class="feature-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                        <span>Enterprise-Grade Security</span>
                    </div>
                    <div class="feature-item">
                        <svg class="feature-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="20" x2="18" y2="10"/>
                            <line x1="12" y1="20" x2="12" y2="4"/>
                            <line x1="6" y1="20" x2="6" y2="14"/>
                        </svg>
                        <span>Real-time Analytics</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>