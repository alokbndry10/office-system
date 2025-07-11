// Dashboard JavaScript functionality
class TravelAccountDashboard {
    constructor() {
        this.currentUser = null;
        this.accounts = [];
        this.transactions = [];
        this.init();
    }

    async init() {
        try {
            await this.checkAuth();
            await this.loadUserData();
            await this.loadAccounts();
            await this.loadTransactions();
            this.setupEventListeners();
        } catch (error) {
            console.error('Initialization error:', error);
            this.redirectToLogin();
        }
    }

    async checkAuth() {
        // Check if user is logged in
        const response = await fetch('check_auth.php');
        const data = await response.json();
        
        if (!data.success) {
            throw new Error('Not authenticated');
        }
        
        this.currentUser = data.user;
    }

    async loadUserData() {
        try {
            const response = await fetch('get_company_data.php');
            const data = await response.json();
            
            if (data.success) {
                this.updateUserInterface(data.company);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    updateUserInterface(company) {
        document.getElementById('company-name').textContent = company.company_name;
        document.getElementById('username').textContent = company.username;
        
        // Update profile form
        document.getElementById('profile-company-name').value = company.company_name;
        document.getElementById('profile-vat').value = company.vat_number;
        document.getElementById('profile-email').value = company.email;
        document.getElementById('profile-phone').value = company.phone_number;
        document.getElementById('profile-address').value = company.address;
        
        // Update company logo if exists
        if (company.logo_path) {
            const logoContainer = document.getElementById('company-logo');
            logoContainer.innerHTML = `<img src="${company.logo_path}" alt="Company Logo">`;
        }
        
        // Update member since
        const memberSince = new Date(company.created_at).toLocaleDateString();
        document.getElementById('member-since').textContent = memberSince;
    }

    async loadAccounts() {
        try {
            const response = await fetch('get_accounts.php');
            const data = await response.json();
            
            if (data.success) {
                this.accounts = data.accounts;
                this.updateAccountsDisplay();
                this.updateAccountsFilter();
                this.updateStats();
            }
        } catch (error) {
            console.error('Error loading accounts:', error);
        }
    }

    async loadTransactions() {
        try {
            const response = await fetch('get_transactions.php');
            const data = await response.json();
            
            if (data.success) {
                this.transactions = data.transactions;
                this.updateTransactionsDisplay();
                this.updateRecentTransactions();
                this.updateStats();
            }
        } catch (error) {
            console.error('Error loading transactions:', error);
        }
    }

    updateAccountsDisplay() {
        const accountsGrid = document.getElementById('accounts-grid');
        
        if (this.accounts.length === 0) {
            accountsGrid.innerHTML = '<p class="no-data">No accounts found. Create your first account!</p>';
            return;
        }
        
        accountsGrid.innerHTML = this.accounts.map(account => `
            <div class="account-card">
                <div class="account-header">
                    <h3>${account.account_name}</h3>
                    <span class="account-type">${account.account_type}</span>
                </div>
                <div class="account-number">${account.account_number}</div>
                <div class="account-balance">${account.currency} ${parseFloat(account.balance).toFixed(2)}</div>
                <div class="account-actions">
                    <button class="btn-secondary" onclick="dashboard.showTransactionModal('${account.id}')">
                        <i class='bx bx-plus'></i> Add Transaction
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateAccountsFilter() {
        const accountFilter = document.getElementById('account-filter');
        accountFilter.innerHTML = '<option value="">All Accounts</option>' +
            this.accounts.map(account => 
                `<option value="${account.id}">${account.account_name}</option>`
            ).join('');
    }

    updateTransactionsDisplay() {
        const tbody = document.querySelector('#all-transactions-table tbody');
        
        if (this.transactions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="no-data">No transactions found</td></tr>';
            return;
        }
        
        tbody.innerHTML = this.transactions.map(transaction => `
            <tr>
                <td>${new Date(transaction.transaction_date).toLocaleDateString()}</td>
                <td>${transaction.account_name}</td>
                <td>
                    <span class="transaction-type ${transaction.transaction_type}">
                        ${transaction.transaction_type.toUpperCase()}
                    </span>
                </td>
                <td class="${transaction.transaction_type}">
                    ${transaction.transaction_type === 'credit' ? '+' : '-'}${transaction.currency} ${parseFloat(transaction.amount).toFixed(2)}
                </td>
                <td>${transaction.description || 'N/A'}</td>
                <td>${transaction.reference_number || 'N/A'}</td>
            </tr>
        `).join('');
    }

    updateRecentTransactions() {
        const tbody = document.querySelector('#recent-transactions-table tbody');
        const recentTransactions = this.transactions.slice(0, 5);
        
        if (recentTransactions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="no-data">No transactions found</td></tr>';
            return;
        }
        
        tbody.innerHTML = recentTransactions.map(transaction => `
            <tr>
                <td>${new Date(transaction.transaction_date).toLocaleDateString()}</td>
                <td>${transaction.account_name}</td>
                <td>
                    <span class="transaction-type ${transaction.transaction_type}">
                        ${transaction.transaction_type.toUpperCase()}
                    </span>
                </td>
                <td class="${transaction.transaction_type}">
                    ${transaction.transaction_type === 'credit' ? '+' : '-'}${transaction.currency} ${parseFloat(transaction.amount).toFixed(2)}
                </td>
                <td>${transaction.description || 'N/A'}</td>
            </tr>
        `).join('');
    }

    updateStats() {
        // Update total accounts
        document.getElementById('total-accounts').textContent = this.accounts.length;
        
        // Calculate total balance
        const totalBalance = this.accounts.reduce((sum, account) => sum + parseFloat(account.balance), 0);
        document.getElementById('total-balance').textContent = `$${totalBalance.toFixed(2)}`;
        
        // Update total transactions
        document.getElementById('total-transactions').textContent = this.transactions.length;
    }

    setupEventListeners() {
        // Add account form submission
        document.getElementById('add-account-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.addAccount();
        });

        // Profile form submission
        document.getElementById('profile-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.updateProfile();
        });
    }

    async addAccount() {
        const formData = new FormData();
        formData.append('account_name', document.getElementById('new-account-name').value);
        formData.append('account_type', document.getElementById('new-account-type').value);
        formData.append('currency', document.getElementById('new-account-currency').value);
        
        try {
            const response = await fetch('add_account.php', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert('Account created successfully!');
                this.closeModal('add-account-modal');
                document.getElementById('add-account-form').reset();
                await this.loadAccounts();
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error adding account:', error);
            alert('An error occurred while creating the account');
        }
    }

    async updateProfile() {
        const formData = new FormData();
        formData.append('phone_number', document.getElementById('profile-phone').value);
        formData.append('address', document.getElementById('profile-address').value);
        
        try {
            const response = await fetch('update_profile.php', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert('Profile updated successfully!');
                this.toggleProfileEdit();
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An error occurred while updating profile');
        }
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Remove active class from all menu items
        document.querySelectorAll('.sidebar-menu li').forEach(li => {
            li.classList.remove('active');
        });
        
        // Show selected section
        document.getElementById(`${sectionName}-section`).classList.add('active');
        
        // Add active class to clicked menu item
        event.target.closest('li').classList.add('active');
        
        // Update page title
        const titles = {
            overview: 'Dashboard Overview',
            accounts: 'Travel Accounts',
            transactions: 'Transactions',
            profile: 'Company Profile'
        };
        
        document.getElementById('page-title').textContent = titles[sectionName];
    }

    showAddAccountModal() {
        document.getElementById('add-account-modal').style.display = 'block';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    toggleProfileEdit() {
        const phoneInput = document.getElementById('profile-phone');
        const addressInput = document.getElementById('profile-address');
        const editBtn = document.querySelector('.btn-secondary');
        const saveBtn = document.getElementById('save-profile-btn');
        
        if (phoneInput.readOnly) {
            phoneInput.readOnly = false;
            addressInput.readOnly = false;
            editBtn.style.display = 'none';
            saveBtn.style.display = 'inline-flex';
        } else {
            phoneInput.readOnly = true;
            addressInput.readOnly = true;
            editBtn.style.display = 'inline-flex';
            saveBtn.style.display = 'none';
        }
    }

    filterTransactions() {
        const accountFilter = document.getElementById('account-filter').value;
        const typeFilter = document.getElementById('type-filter').value;
        
        let filteredTransactions = this.transactions;
        
        if (accountFilter) {
            filteredTransactions = filteredTransactions.filter(t => t.account_id == accountFilter);
        }
        
        if (typeFilter) {
            filteredTransactions = filteredTransactions.filter(t => t.transaction_type === typeFilter);
        }
        
        const tbody = document.querySelector('#all-transactions-table tbody');
        
        if (filteredTransactions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="no-data">No transactions match the filters</td></tr>';
            return;
        }
        
        tbody.innerHTML = filteredTransactions.map(transaction => `
            <tr>
                <td>${new Date(transaction.transaction_date).toLocaleDateString()}</td>
                <td>${transaction.account_name}</td>
                <td>
                    <span class="transaction-type ${transaction.transaction_type}">
                        ${transaction.transaction_type.toUpperCase()}
                    </span>
                </td>
                <td class="${transaction.transaction_type}">
                    ${transaction.transaction_type === 'credit' ? '+' : '-'}${transaction.currency} ${parseFloat(transaction.amount).toFixed(2)}
                </td>
                <td>${transaction.description || 'N/A'}</td>
                <td>${transaction.reference_number || 'N/A'}</td>
            </tr>
        `).join('');
    }

    async logout() {
        try {
            const response = await fetch('logout.php', { method: 'POST' });
            const data = await response.json();
            
            if (data.success) {
                this.redirectToLogin();
            }
        } catch (error) {
            console.error('Logout error:', error);
            this.redirectToLogin();
        }
    }

    redirectToLogin() {
        window.location.href = 'index.html';
    }
}

// Global functions for onclick events
function showSection(sectionName) {
    dashboard.showSection(sectionName);
}

function showAddAccountModal() {
    dashboard.showAddAccountModal();
}

function closeModal(modalId) {
    dashboard.closeModal(modalId);
}

function toggleProfileEdit() {
    dashboard.toggleProfileEdit();
}

function filterTransactions() {
    dashboard.filterTransactions();
}

function logout() {
    dashboard.logout();
}

// Initialize dashboard when page loads
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new TravelAccountDashboard();
});

// Close modal when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}
