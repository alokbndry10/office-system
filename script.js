// ===== FORM SWITCHING FUNCTIONALITY =====
const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");
const wrapper = document.querySelector(".wrapper");
const loginTitle = document.querySelector(".title-login");
const registerTitle = document.querySelector(".title-register");
const signUpBtn = document.querySelector("#SignUpBtn");
const signInBtn = document.querySelector("#SignInBtn");

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
    loginTitle.style.top = "-60px";
    loginTitle.style.opacity = 0;
    registerTitle.style.top = "50%";
    registerTitle.style.opacity = 1;
}

// ===== FORM VALIDATION AND AUTHENTICATION =====
class FormValidator {
    constructor() {
        this.initializeValidation();
    }

    initializeValidation() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupFields());
        } else {
            this.setupFields();
        }
    }

    setupFields() {
        // Get all form elements
        this.companyName = document.getElementById('company-name');
        this.vatNumber = document.getElementById('vat-number');
        this.address = document.getElementById('address');
        this.username = document.getElementById('username');
        this.phoneNumber = document.getElementById('phone-number');
        this.email = document.getElementById('reg-email');
        this.password = document.getElementById('password');
        this.confirmPassword = document.getElementById('confirm-password');
        this.logoUpload = document.getElementById('logo-upload');
        this.agreeCheckbox = document.getElementById('agree');
        this.registerBtn = document.getElementById('SignUpBtn');

        // Email regex pattern
        this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // Password regex (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
        this.passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        console.log('Form elements found:', {
            password: !!this.password,
            confirmPassword: !!this.confirmPassword,
            registerBtn: !!this.registerBtn
        });

        this.setupEventListeners();
        this.createValidationIcons();
    }

    createValidationIcons() {
        // Add validation icons to each input field
        const fields = [
            this.companyName, this.vatNumber, this.address, this.username,
            this.phoneNumber, this.email, this.password, this.confirmPassword
        ];

        fields.forEach(field => {
            if (field) {
                const inputBox = field.parentElement;
                // Ensure input box has relative positioning
                inputBox.style.position = 'relative';
                
                // Create validation icon if it doesn't already exist
                let validationIcon = inputBox.querySelector('.validation-icon');
                if (!validationIcon) {
                    validationIcon = document.createElement('i');
                    validationIcon.className = 'validation-icon';
                    validationIcon.style.position = 'absolute';
                    validationIcon.style.top = '50%';
                    validationIcon.style.right = '55px';
                    validationIcon.style.transform = 'translateY(-50%)';
                    validationIcon.style.fontSize = '18px';
                    validationIcon.style.display = 'none';
                    validationIcon.style.zIndex = '10';
                    inputBox.appendChild(validationIcon);
                }
            }
        });
    }

    setupEventListeners() {
        // Real-time validation
        if (this.companyName) this.companyName.addEventListener('input', () => this.validateField(this.companyName, 'required'));
        if (this.vatNumber) this.vatNumber.addEventListener('input', () => this.validateField(this.vatNumber, 'required'));
        if (this.address) this.address.addEventListener('input', () => this.validateField(this.address, 'required'));
        if (this.username) this.username.addEventListener('input', () => this.validateField(this.username, 'username'));
        if (this.phoneNumber) this.phoneNumber.addEventListener('input', () => this.validateField(this.phoneNumber, 'phone'));
        if (this.email) this.email.addEventListener('input', () => this.validateField(this.email, 'email'));
        
        if (this.password) {
            this.password.addEventListener('input', () => {
                this.validateField(this.password, 'password');
                // Re-validate confirm password when password changes
                if (this.confirmPassword && this.confirmPassword.value) {
                    this.validateField(this.confirmPassword, 'confirmPassword');
                }
            });
        }
        
        if (this.confirmPassword) {
            this.confirmPassword.addEventListener('input', () => this.validateField(this.confirmPassword, 'confirmPassword'));
        }
        
        if (this.logoUpload) this.logoUpload.addEventListener('change', () => this.validateFile());
        if (this.agreeCheckbox) this.agreeCheckbox.addEventListener('change', () => this.validateCheckbox());

        // Form submission
        if (this.registerBtn) this.registerBtn.addEventListener('click', (e) => this.handleSubmit(e));
    }

    validateField(field, type) {
        if (!field) return false;
        
        const value = field.value.trim();
        const inputBox = field.parentElement;
        let validationIcon = inputBox.querySelector('.validation-icon');
        
        // Create validation icon if it doesn't exist
        if (!validationIcon) {
            validationIcon = document.createElement('i');
            validationIcon.className = 'validation-icon';
            validationIcon.style.position = 'absolute';
            validationIcon.style.top = '50%';
            validationIcon.style.right = '55px';
            validationIcon.style.transform = 'translateY(-50%)';
            validationIcon.style.fontSize = '18px';
            validationIcon.style.display = 'none';
            inputBox.style.position = 'relative';
            inputBox.appendChild(validationIcon);
        }
        
        let isValid = false;

        switch (type) {
            case 'required':
                isValid = value.length > 0;
                break;
            case 'username':
                isValid = value.length >= 3;
                break;
            case 'phone':
                isValid = /^[\+]?[1-9][\d]{0,15}$/.test(value) && value.length >= 8;
                break;
            case 'email':
                isValid = this.emailRegex.test(value);
                break;
            case 'password':
                isValid = value.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(value);
                break;
            case 'confirmPassword':
                isValid = value === this.password.value && value.length > 0;
                break;
        }

        this.updateFieldValidation(field, validationIcon, isValid);
        this.updatePasswordStrengthMessage(field, type, isValid, value);
        return isValid;
    }

    updateFieldValidation(field, icon, isValid) {
        if (!field || !icon) return;
        
        if (field.value.trim() === '') {
            // Empty field
            field.style.borderColor = '#E3E4E6';
            icon.style.display = 'none';
            this.removeFieldMessage(field);
        } else if (isValid) {
            // Valid field
            field.style.borderColor = '#28a745';
            icon.style.display = 'block';
            icon.className = 'validation-icon bx bx-check-circle';
            icon.style.color = '#28a745';
            this.removeFieldMessage(field);
        } else {
            // Invalid field
            field.style.borderColor = '#dc3545';
            icon.style.display = 'block';
            icon.className = 'validation-icon bx bx-x-circle';
            icon.style.color = '#dc3545';
        }
    }

    updatePasswordStrengthMessage(field, type, isValid, value) {
        if (type === 'password' && field === this.password && value.length > 0 && !isValid) {
            this.showFieldMessage(field, 'Password must be at least 8 characters with uppercase, lowercase, number, and special character', 'error');
        } else if (type === 'confirmPassword' && field === this.confirmPassword && value.length > 0 && !isValid) {
            this.showFieldMessage(field, 'Passwords do not match', 'error');
        }
    }

    showFieldMessage(field, message, type = 'error') {
        this.removeFieldMessage(field);
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `field-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            font-size: 12px;
            padding: 5px 10px;
            margin-top: 2px;
            border-radius: 4px;
            z-index: 100;
            color: ${type === 'error' ? '#dc3545' : '#28a745'};
            background-color: ${type === 'error' ? '#f8d7da' : '#d4edda'};
            border: 1px solid ${type === 'error' ? '#f5c6cb' : '#c3e6cb'};
        `;
        
        field.parentElement.style.position = 'relative';
        field.parentElement.appendChild(messageDiv);
    }

    removeFieldMessage(field) {
        const existingMessage = field.parentElement.querySelector('.field-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    }

    validateFile() {
        const file = this.logoUpload.files[0];
        const inputBox = this.logoUpload.parentElement;
        let validationIcon = inputBox.querySelector('.file-validation-icon');
        
        if (!validationIcon) {
            validationIcon = document.createElement('i');
            validationIcon.className = 'file-validation-icon';
            validationIcon.style.position = 'absolute';
            validationIcon.style.top = '50%';
            validationIcon.style.right = '55px';
            validationIcon.style.transform = 'translateY(-50%)';
            validationIcon.style.fontSize = '18px';
            inputBox.appendChild(validationIcon);
        }

        if (file && file.type.startsWith('image/')) {
            this.logoUpload.style.borderColor = '#28a745';
            validationIcon.style.display = 'block';
            validationIcon.className = 'file-validation-icon bx bx-check-circle';
            validationIcon.style.color = '#28a745';
            return true;
        } else if (file) {
            this.logoUpload.style.borderColor = '#dc3545';
            validationIcon.style.display = 'block';
            validationIcon.className = 'file-validation-icon bx bx-x-circle';
            validationIcon.style.color = '#dc3545';
            return false;
        } else {
            this.logoUpload.style.borderColor = '#E3E4E6';
            validationIcon.style.display = 'none';
            return false;
        }
    }

    validateCheckbox() {
        const label = this.agreeCheckbox.nextElementSibling;
        if (this.agreeCheckbox.checked) {
            label.style.color = '#28a745';
            return true;
        } else {
            label.style.color = '#dc3545';
            return false;
        }
    }

    validateAllFields() {
        const validations = [];
        
        // Validate each field and store results
        if (this.companyName) validations.push(this.validateField(this.companyName, 'required'));
        if (this.vatNumber) validations.push(this.validateField(this.vatNumber, 'required'));
        if (this.address) validations.push(this.validateField(this.address, 'required'));
        if (this.username) validations.push(this.validateField(this.username, 'username'));
        if (this.phoneNumber) validations.push(this.validateField(this.phoneNumber, 'phone'));
        if (this.email) validations.push(this.validateField(this.email, 'email'));
        if (this.password) validations.push(this.validateField(this.password, 'password'));
        if (this.confirmPassword) validations.push(this.validateField(this.confirmPassword, 'confirmPassword'));
        
        validations.push(this.validateFile());
        validations.push(this.validateCheckbox());

        const allValid = validations.every(isValid => isValid);
        
        console.log('Validation results:', {
            companyName: this.companyName ? this.validateField(this.companyName, 'required') : 'N/A',
            vatNumber: this.vatNumber ? this.validateField(this.vatNumber, 'required') : 'N/A',
            address: this.address ? this.validateField(this.address, 'required') : 'N/A',
            username: this.username ? this.validateField(this.username, 'username') : 'N/A',
            phone: this.phoneNumber ? this.validateField(this.phoneNumber, 'phone') : 'N/A',
            email: this.email ? this.validateField(this.email, 'email') : 'N/A',
            password: this.password ? this.validateField(this.password, 'password') : 'N/A',
            confirmPassword: this.confirmPassword ? this.validateField(this.confirmPassword, 'confirmPassword') : 'N/A',
            file: this.validateFile(),
            checkbox: this.validateCheckbox(),
            overall: allValid
        });

        return allValid;
    }

    showMessage(message, type = 'error') {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 25px;
            border-radius: 8px;
            font-weight: 500;
            z-index: 1001;
            max-width: 400px;
            text-align: center;
            animation: slideDown 0.3s ease;
        `;

        if (type === 'success') {
            messageDiv.style.backgroundColor = '#d4edda';
            messageDiv.style.color = '#155724';
            messageDiv.style.border = '1px solid #c3e6cb';
        } else {
            messageDiv.style.backgroundColor = '#f8d7da';
            messageDiv.style.color = '#721c24';
            messageDiv.style.border = '1px solid #f5c6cb';
        }

        document.body.appendChild(messageDiv);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentElement) {
                messageDiv.remove();
            }
        }, 5000);
    }

    handleSubmit(e) {
        e.preventDefault();

        if (this.validateAllFields()) {
            this.showMessage('Registration successful! All fields are valid.', 'success');
            
            // Collect form data
            const formData = {
                companyName: this.companyName.value,
                vatNumber: this.vatNumber.value,
                address: this.address.value,
                username: this.username.value,
                phoneNumber: this.phoneNumber.value,
                email: this.email.value,
                password: this.password.value,
                logo: this.logoUpload.files[0]
            };

            console.log('Registration Data:', formData);
            
            // Here you can add AJAX call to submit data to server
            // this.submitToServer(formData);
            
        } else {
            this.showMessage('Please fill all fields correctly and ensure passwords match.');
        }
    }

    // Optional: Method to submit data to server
    submitToServer(formData) {
        const xhr = new XMLHttpRequest();
        const data = new FormData();
        
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        xhr.open('POST', 'php/register.php', true);
        xhr.onload = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const response = xhr.response;
                    if (response === 'registration success') {
                        this.showMessage('Company registered successfully!', 'success');
                        // Redirect or switch to login form
                        setTimeout(() => {
                            loginFunction();
                        }, 2000);
                    } else {
                        this.showMessage(response);
                    }
                } else {
                    this.showMessage('Server error. Please try again.');
                }
            }
        };
        
        xhr.send(data);
    }
}

// Initialize validator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const validator = new FormValidator();
});

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
`;
document.head.appendChild(style);