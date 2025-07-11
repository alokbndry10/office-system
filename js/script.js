// ===== FORM SWITCHING FUNCTIONALITY =====
const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");
const wrapper = document.querySelector(".wrapper");
const loginTitle = document.querySelector(".title-login");
const registerTitle = document.querySelector(".title-register");

// ===== ERROR MESSAGE FUNCTIONALITY =====
function showLoginError(message) {
    const errorContainer = document.getElementById('login-error');
    const errorText = errorContainer.querySelector('.error-text');
    
    errorText.textContent = message;
    errorContainer.style.display = 'flex';
    errorContainer.classList.remove('hiding');
}

function hideLoginError() {
    const errorContainer = document.getElementById('login-error');
    errorContainer.style.display = 'none';
    errorContainer.classList.remove('hiding');
}

function showRegisterError(message) {
    const errorContainer = document.getElementById('register-error');
    const errorText = errorContainer.querySelector('.error-text');
    
    errorText.textContent = message;
    errorContainer.style.display = 'flex';
    errorContainer.classList.remove('hiding');
}

function hideRegisterError() {
    const errorContainer = document.getElementById('register-error');
    errorContainer.style.display = 'none';
    errorContainer.classList.remove('hiding');
}

function showSuccessMessage(message, formType = 'login') {
    const errorContainer = document.getElementById(formType + '-error');
    const errorText = errorContainer.querySelector('.error-text');
    
    // Change styling to success
    errorContainer.className = 'success-message';
    errorContainer.querySelector('i').className = 'bx bx-check-circle';
    
    // Add close button if it doesn't exist
    if (!errorContainer.querySelector('.close-btn')) {
        const closeBtn = document.createElement('i');
        closeBtn.className = 'bx bx-x close-btn';
        closeBtn.onclick = function() {
            if (formType === 'login') {
                hideLoginError();
            } else {
                hideRegisterError();
            }
            // Reset to error styling
            errorContainer.className = 'error-message';
            errorContainer.querySelector('i').className = 'bx bx-error-circle';
        };
        errorContainer.appendChild(closeBtn);
    }
    
    errorText.textContent = message;
    errorContainer.style.display = 'flex';
    errorContainer.classList.remove('hiding');
}

// ===== UTILITY FUNCTIONS =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    if (password.length < 8) {
        return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
        return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
        return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
        return 'Password must contain at least one number';
    }
    return null;
}

// Logo preview functionality
const logoUpload = document.querySelector("#logo-upload");
const logoPreview = document.querySelector("#logo-preview");
const previewImage = document.querySelector("#preview-image");
const previewText = document.querySelector(".preview-text");

if (logoUpload) {
    logoUpload.addEventListener("change", function(event) {
        const file = event.target.files[0];
        
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                previewImage.style.display = "block";
                previewText.style.display = "none";
                logoPreview.classList.add("has-image");
            };
            
            reader.readAsDataURL(file);
        } else {
            previewImage.style.display = "none";
            previewText.style.display = "block";
            previewText.textContent = "No logo selected";
            logoPreview.classList.remove("has-image");
        }
    });
}

function loginFunction(){
    loginForm.style.left = "50%";
    loginForm.style.opacity = 1;
    registerForm.style.left = "150%";
    registerForm.style.opacity = 0;
    wrapper.classList.remove("register-mode");
    loginTitle.style.top = "50%";
    loginTitle.style.opacity = 1;
    registerTitle.style.top = "50px";
    registerTitle.style.opacity = 0;
}

function registerFunction(){
    loginForm.style.left = "-50%";
    loginForm.style.opacity = 0;
    registerForm.style.left = "50%";
    registerForm.style.opacity = 1;
    wrapper.classList.add("register-mode");
    loginTitle.style.top = "150px";
    loginTitle.style.opacity = 0;
    registerTitle.style.top = "50%";
    registerTitle.style.opacity = 1;
}

// Form submission handlers and initialization
document.addEventListener('DOMContentLoaded', function() {
    // ===== PASSWORD TOGGLE FUNCTIONALITY =====
    const passwordToggles = document.querySelectorAll('.password-toggle');
    
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordField = document.getElementById(targetId);
            
            if (passwordField) {
                const isPassword = passwordField.type === 'password';
                
                // Toggle password visibility
                passwordField.type = isPassword ? 'text' : 'password';
                
                // Toggle icon classes directly on the toggle element
                if (isPassword) {
                    this.classList.remove('bx-hide');
                    this.classList.add('bx-show');
                    this.classList.add('active');
                } else {
                    this.classList.remove('bx-show');
                    this.classList.add('bx-hide');
                    this.classList.remove('active');
                }
            }
        });
    });

    // ===== FORM SUBMISSION HANDLERS =====
    // Login form submission
    const loginFormElement = document.getElementById('login-form');
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Hide any previous error messages
            hideLoginError();
            
            const email = document.getElementById('log-email').value;
            const password = document.getElementById('log-pass').value;
            
            // Validation
            if (!email || !password) {
                showLoginError('Please fill in all fields');
                return;
            }
            
            if (!isValidEmail(email)) {
                showLoginError('Please enter a valid email address');
                return;
            }
            
            const submitBtn = document.getElementById('SignInBtn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Signing In...';
            submitBtn.disabled = true;
            
            try {
                const formData = new FormData();
                formData.append('email', email);
                formData.append('password', password);
                
                const response = await fetch('../php/login.php', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showSuccessMessage('Login successful! Redirecting...', 'login');
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1500);
                } else {
                    showLoginError(data.message || 'Invalid email or password');
                }
            } catch (error) {
                console.error('Login error:', error);
                showLoginError('Connection error. Please try again.');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Register form submission
    const registerFormElement = document.getElementById('register-form');
    if (registerFormElement) {
        registerFormElement.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Hide any previous error messages
            hideRegisterError();
            
            // Get form data
            const companyName = document.getElementById('company-name').value;
            const vatNumber = document.getElementById('vat-number').value;
            const address = document.getElementById('address').value;
            const phoneNumber = document.getElementById('phone-number').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // Validation
            if (!companyName || !vatNumber || !address || !phoneNumber || !email || !password || !confirmPassword) {
                showRegisterError('Please fill in all fields');
                return;
            }
            
            if (!isValidEmail(email)) {
                showRegisterError('Please enter a valid email address');
                return;
            }
            
            // Password validation
            const passwordError = validatePassword(password);
            if (passwordError) {
                showRegisterError(passwordError);
                return;
            }
            
            if (password !== confirmPassword) {
                showRegisterError('Passwords do not match');
                return;
            }
            
            // Check if terms are agreed
            const agreeCheckbox = document.getElementById('agree');
            if (!agreeCheckbox.checked) {
                showRegisterError('Please agree to terms and conditions');
                return;
            }
            
            // Check if logo is uploaded
            const logoFile = document.getElementById('logo-upload').files[0];
            if (!logoFile) {
                showRegisterError('Please upload a company logo');
                return;
            }
            
            const formData = new FormData();
            formData.append('company_name', companyName);
            formData.append('vat_number', vatNumber);
            formData.append('address', address);
            formData.append('phone_number', phoneNumber);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('confirm_password', confirmPassword);
            formData.append('logo', logoFile);
            
            const submitBtn = document.getElementById('SignUpBtn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Registering...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch('../php/register_company.php', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showSuccessMessage('Company registered successfully! You can now login.', 'register');
                    registerFormElement.reset();
                    logoPreview.classList.remove("has-image");
                    previewImage.style.display = "none";
                    previewText.style.display = "block";
                    previewText.textContent = "No logo selected";
                    
                    setTimeout(() => {
                        loginFunction();
                    }, 2000);
                } else {
                    showRegisterError(data.message || 'Registration failed. Please try again.');
                }
            } catch (error) {
                console.error('Registration error:', error);
                showRegisterError('Connection error. Please try again.');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});

// Message display function (legacy - keeping for compatibility)
function showMessage(message, type = 'error') {
    if (type === 'error') {
        if (document.querySelector('.login-form').style.left === '50%' || !document.querySelector('.login-form').style.left) {
            showLoginError(message);
        } else {
            showRegisterError(message);
        }
    } else {
        const formType = document.querySelector('.login-form').style.left === '50%' || !document.querySelector('.login-form').style.left ? 'login' : 'register';
        showSuccessMessage(message, formType);
    }
}
