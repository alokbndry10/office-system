# Travel Account Management System - Setup Guide

## 📋 Overview
The Travel Account Management System is a web-based application designed for companies to manage their travel accounts, transactions, and financial records. Built with PHP, MySQL, HTML, CSS, and JavaScript.

## 🚀 Super Simple Setup (Recommended)

### Option 1: Run from Current Location (No Copying!)

1. **Start XAMPP** (if you have it)
   - Open XAMPP Control Panel
   - Start MySQL service ✅
   - (Apache not needed - we'll use PHP built-in server)

2. **Double-click to start**
   - Just double-click: `start-server.bat`
   - This automatically uses XAMPP's PHP + MySQL

3. **One-Click Setup**
   - Open browser: `http://localhost:8000/php/install.php`
   - The installer will automatically:
     - Create the database
     - Create all tables
     - Set up file directories
     - Show you the login page link

4. **Start Using**
   - Go to: `http://localhost:8000`
   - Register your company and start using!

### Option 2: Using XAMPP htdocs (Traditional)

1. **Install XAMPP** (if not already installed)
   - Download from: https://www.apachefriends.org/download.html
   - Install and start Apache + MySQL services

2. **Copy Project to XAMPP**
   ```
   Copy office-system folder to: C:\xampp\htdocs\
   ```

3. **One-Click Setup**
   - Open browser: `http://localhost/office-system/php/install.php`
   - The installer will automatically:
     - Create the database
     - Create all tables
     - Set up file directories
     - Show you the login page link

4. **Start Using**
   - Go to: `http://localhost/office-system/html/index.html`
   - Register your company and start using!

### Option 3: Manual PHP Built-in Server

1. **Start the server**
   ```powershell
   cd "path\to\office-system"
   C:\xampp\php\php.exe -S localhost:8000 -t html
   ```

2. **Run installer**
   - Open: `http://localhost:8000/php/install.php`
   - Follow the setup wizard

3. **Access application**
   - Go to: `http://localhost:8000`

## 📁 Project Structure
```
office-system/
├── css/
│   └── style.css                 # Main stylesheet
├── html/
│   ├── index.html               # Login/Register page
│   └── dashboard.html           # Main dashboard
├── js/
│   ├── script.js               # Login/Register functionality
│   └── dashboard.js            # Dashboard functionality
├── php/
│   ├── config.php              # Database configuration
│   ├── install.php             # Database setup script
│   ├── login.php               # Authentication handler
│   ├── register_company.php    # Company registration
│   └── test_connection.php     # Database test utility
├── uploads/
│   └── logos/                  # Company logo storage
├── README.md                   # Project documentation
└── SETUP.md                    # Setup instructions
```

## 🔧 Configuration

### Automatic Configuration
The system is pre-configured for XAMPP with these default settings:
- **Database:** localhost
- **Username:** root  
- **Password:** (empty)
- **Database Name:** account_system (created automatically)

### Manual Configuration (if needed)
Edit `php/config.php` only if you have custom database settings:
```php
<?php
$hostname = "localhost";     // Database server
$username = "root";          // Database username  
$password = "";              // Database password
$database = "account_system";// Database name (created automatically)
```

## ⚡ Troubleshooting

### Quick Fixes

**"Cannot connect to MySQL server"**
- Start XAMPP MySQL service
- Check if MySQL is running on port 3306

**"Access denied for user 'root'"**
- Use default XAMPP MySQL settings (user: root, password: empty)
- Or update `php/config.php` with your MySQL credentials

**"Page not found" when accessing the site**
- **For XAMPP:** Use `http://localhost/office-system/html/index.html`
- **For PHP server:** Use `http://localhost:8000/index.html`

**Installation page shows errors**
- Refresh the page - it will retry automatically
- Make sure XAMPP MySQL service is green/running

## 🎯 URLs Reference

### XAMPP URLs
- **Installer:** `http://localhost/office-system/php/install.php`
- **Application:** `http://localhost/office-system/html/index.html`

### PHP Built-in Server URLs  
- **Installer:** `http://localhost:8000/php/install.php`
- **Application:** `http://localhost:8000/index.html`

## 📊 Database Schema

### Tables Created:
1. **companies** - Company registration data and login credentials
2. **travel_accounts** - Travel account information
3. **transactions** - Financial transaction records
4. **user_sessions** - User session management

### Key Features:
- Secure password hashing
- Session-based authentication
- Foreign key constraints
- Indexed fields for performance

## 🔐 Security Features

- **Password Hashing:** Uses PHP `password_hash()` with bcrypt
- **SQL Injection Protection:** Prepared statements throughout
- **Session Management:** Secure token-based sessions
- **Input Validation:** Client and server-side validation
- **File Upload Security:** Restricted file types and sizes

## 🎯 Features

### Registration
- Company information collection
- Email-based authentication (no username required)
- Logo upload functionality
- Terms and conditions agreement
- Real-time form validation

### Login
- Email and password authentication
- Comprehensive error handling
- Session management
- Account status verification

### Error Handling
- User-friendly error messages
- Server error protection
- Database connection monitoring
- Form validation feedback

## 🛠️ Development

### Adding New Features
1. Place PHP files in `php/` directory
2. Add CSS to `css/style.css` or create new files
3. JavaScript goes in `js/` directory
4. HTML pages in `html/` directory

### Database Changes
- Modify `php/install.php` for schema changes
- Update `php/config.php` if needed
- Test with `php/test_connection.php`

## 🔧 Troubleshooting

### Common Issues

**Database Connection Failed:**
- Check database credentials in `config.php`
- Ensure MySQL server is running
- Verify database name exists

**Login Not Working:**
- Run database installation: `/php/install.php`
- Check error messages for specific issues
- Verify account exists and is active

**File Upload Issues:**
- Check `uploads/logos/` directory permissions
- Verify file size limits in PHP configuration
- Ensure allowed file types (JPG, PNG, GIF)

**Server Won't Start:**
- Check if port 8000 is available
- Use different port: `php -S localhost:8080 -t html`
- Verify PHP is installed and in PATH

### Debug Mode
Enable error reporting in `config.php`:
```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

## 📝 API Endpoints

### Authentication
- `POST /php/login.php` - User login
- `POST /php/register_company.php` - Company registration

### Utilities  
- `GET /php/test_connection.php` - Database connectivity test
- `GET /php/install.php` - Database installation

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check troubleshooting section above
- Review configuration settings

## 🚀 Deployment

### Production Deployment
1. Upload files to web server
2. Configure database credentials
3. Set proper file permissions
4. Configure web server (Apache/Nginx)
5. Enable HTTPS for security
6. Configure backup procedures

### Security Considerations
- Use strong database passwords
- Enable HTTPS in production
- Regular security updates
- Monitor access logs
- Implement rate limiting

---

**Version:** 1.0.0  
**Last Updated:** July 2025  
**Author:** alokbndry10