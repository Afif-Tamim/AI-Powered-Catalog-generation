<?php
session_start(); // For login sessions
include 'database.php'; // Links to database.php

// Handle login form submission
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['email'])) {
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $password = $_POST['password'];
    
    // Query database
    $query = "SELECT * FROM users WHERE email = '$email'";
    $result = mysqli_query($conn, $query);
    
    if ($row = mysqli_fetch_assoc($result)) {
        // Verify password
        if (password_verify($password, $row['password'])) {
            $_SESSION['user_id'] = $row['user_id'];
            $_SESSION['email'] = $row['email'];
            $_SESSION['name'] = $row['first_name'] . ' ' . $row['last_name'];
            // Login successful - JavaScript will handle UI
        } else {
            $error = "Invalid password";
        }
    } else {
        $error = "User not found";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CatalogAI - Product Management System</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Login Screen -->
    <div id="login-screen" class="login-screen">
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
                            <h1 class="logo-title">CatalogAI</h1>
                            <p class="logo-subtitle">Product Intelligence Platform</p>
                        </div>
                    </div>
                </div>
                
                <form id="login-form" class="login-form">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="you@company.com" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" placeholder="••••••••" required>
                    </div>
                    <button type="submit" class="btn btn-primary btn-full">
                        <span>Sign In</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="m9 18 6-6-6-6"/>
                        </svg>
                    </button>
                </form>
                
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

    <!-- Main Application -->
    <div id="main-app" class="main-app" style="display: none;">
        <!-- Sidebar -->
        <div class="sidebar">
            <div class="sidebar-header">
                <div class="logo">
                    <svg class="logo-icon" width="32" height="32" viewBox="0 0 40 40" fill="none">
                        <rect width="40" height="40" rx="10" fill="url(#logoGradient2)"/>
                        <path d="M20 10 L28 16 L28 24 L20 30 L12 24 L12 16 Z" stroke="white" stroke-width="2" fill="none"/>
                        <circle cx="20" cy="20" r="3" fill="white"/>
                        <defs>
                            <linearGradient id="logoGradient2" x1="0" y1="0" x2="40" y2="40">
                                <stop offset="0%" style="stop-color:#2563EB"/>
                                <stop offset="100%" style="stop-color:#10B981"/>
                            </linearGradient>
                        </defs>
                    </svg>
                    <span class="logo-text">CatalogAI</span>
                </div>
            </div>
            
            <nav class="sidebar-nav">
                <a href="#" class="nav-item active" data-view="dashboard">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect width="7" height="7" x="3" y="3" rx="1"/>
                        <rect width="7" height="7" x="14" y="3" rx="1"/>
                        <rect width="7" height="7" x="14" y="14" rx="1"/>
                        <rect width="7" height="7" x="3" y="14" rx="1"/>
                    </svg>
                    <span>Dashboard</span>
                </a>
                <a href="#" class="nav-item" data-view="catalog">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 5v14M7 5v14M11 5v14M15 5v14M19 5v14M21 5v14"/>
                    </svg>
                    <span>New Catalog</span>
                </a>
                <a href="#" class="nav-item" data-view="analytics">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="20" x2="18" y2="10"/>
                        <line x1="12" y1="20" x2="12" y2="4"/>
                        <line x1="6" y1="20" x2="6" y2="14"/>
                    </svg>
                    <span>Analytics</span>
                </a>
                <a href="#" class="nav-item" data-view="voices">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/>
                        <path d="M7 7h.01"/>
                    </svg>
                    <span>Brand Voices</span>
                </a>
                <a href="#" class="nav-item" data-view="settings">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                        <circle cx="12" cy="12" r="3"/>
                    </svg>
                    <span>Settings</span>
                </a>
            </nav>
            
            <div class="sidebar-footer">
                <button class="btn btn-ghost btn-full" id="logout-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    <span>Sign Out</span>
                </button>
            </div>
        </div>

        <!-- Main Content -->
        <div class="main-content">
            <!-- Header -->
            <div class="header">
                <div class="header-content">
                    <div>
                        <h1 class="header-title" id="header-title">Dashboard</h1>
                        <p class="header-subtitle">Overview of your catalog operations</p>
                    </div>
                    <div class="header-actions">
                        <div class="ai-indicator">
                            <div class="ai-pulse"></div>
                            <span>5 sources active</span>
                        </div>
                        <span class="badge badge-primary">Admin</span>
                    </div>
                </div>
            </div>

            <!-- Content Area -->
            <div class="content-area" id="content-area">
                <!-- Content will be dynamically loaded here -->
            </div>
        </div>
    </div>

    <script src="app.js"></script>
</body>
</html>
