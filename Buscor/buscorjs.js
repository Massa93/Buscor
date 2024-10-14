// app.js

// Simulated backend data
let registeredUsers = [];
let tickets = [];
let purchases = [];

// Utility functions
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

function getCurrentDate() {
    return new Date().toISOString().split('T')[0];
}

// User management
function registerUser(name, email, password) {
    const user = { id: generateId(), name, email, password };
    registeredUsers.push(user);
    return user;
}

function loginUser(email, password) {
    return registeredUsers.find(user => user.email === email && user.password === password);
}

function isAnyUserRegistered() {
    return registeredUsers.length > 0;
}

// Ticket management
function createTicket(type, price, validDays) {
    const ticket = { id: generateId(), type, price, validDays };
    tickets.push(ticket);
    return ticket;
}

function purchaseTicket(userId, ticketId) {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return null;

    const purchase = {
        id: generateId(),
        userId,
        ticketId,
        purchaseDate: getCurrentDate(),
        expirationDate: new Date(Date.now() + ticket.validDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    purchases.push(purchase);
    return purchase;
}

function getUserTickets(userId) {
    return purchases.filter(p => p.userId === userId).map(p => {
        const ticket = tickets.find(t => t.id === p.ticketId);
        return { ...p, ...ticket };
    });
}

// Initialize some data
createTicket('single', 2.50, 1);
createTicket('weekly', 15, 7);
createTicket('monthly', 50, 30);

// Main app logic
document.addEventListener('DOMContentLoaded', () => {
    let currentUser = null;

    const sections = {
        login: document.getElementById('login-section'),
        register: document.getElementById('register-section'),
        ticketSelection: document.getElementById('ticket-selection'),
        paymentForm: document.getElementById('payment-form'),
        confirmation: document.getElementById('confirmation'),
        dashboard: document.getElementById('dashboard')
    };

    const navButtons = {
        home: document.getElementById('home-btn'),
        login: document.getElementById('login-btn'),
        register: document.getElementById('register-btn'),
        dashboard: document.getElementById('dashboard-btn'),
        logout: document.getElementById('logout-btn')
    };

    function showSection(sectionName) {
        Object.values(sections).forEach(section => section.style.display = 'none');
        sections[sectionName].style.display = 'block';
    }

    function updateNavigation() {
        if (currentUser) {
            navButtons.login.style.display = 'none';
            navButtons.register.style.display = 'none';
            navButtons.dashboard.style.display = 'inline-block';
            navButtons.logout.style.display = 'inline-block';
        } else {
            navButtons.register.style.display = 'inline-block';
            navButtons.dashboard.style.display = 'none';
            navButtons.logout.style.display = 'none';
            navButtons.login.style.display = isAnyUserRegistered() ? 'inline-block' : 'none';
        }
    }

    function updateDashboard() {
        if (!currentUser) return;

        const userInfo = document.getElementById('user-info');
        const activeTickets = document.getElementById('active-tickets');
        const purchaseHistory = document.getElementById('purchase-history');

        userInfo.innerHTML = `<p>Name: ${currentUser.name}</p><p>Email: ${currentUser.email}</p>`;

        const userTickets = getUserTickets(currentUser.id);
        activeTickets.innerHTML = userTickets.map(ticket => 
            `<p>${ticket.type} - Valid until: ${ticket.expirationDate}</p>`
        ).join('');

        purchaseHistory.innerHTML = userTickets.map(ticket => 
            `<p>${ticket.type} - Purchased on: ${ticket.purchaseDate}</p>`
        ).join('');
    }

    navButtons.home.addEventListener('click', () => {
        showSection(currentUser ? 'ticketSelection' : 'register');
    });

    navButtons.login.addEventListener('click', () => showSection('login'));
    navButtons.register.addEventListener('click', () => showSection('register'));
    navButtons.dashboard.addEventListener('click', () => {
        showSection('dashboard');
        updateDashboard();
    });

    navButtons.logout.addEventListener('click', () => {
        currentUser = null;
        updateNavigation();
        showSection('register');
    });

    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        currentUser = loginUser(email, password);
        if (currentUser) {
            updateNavigation();
            showSection('ticketSelection');
        } else {
            alert('Invalid credentials');
        }
    });

    document.getElementById('register-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        currentUser = registerUser(name, email, password);
        if (currentUser) {
            updateNavigation();
            showSection('ticketSelection');
            alert('Registration successful! You can now log in.');
            navButtons.login.style.display = 'inline-block';
        } else {
            alert('Registration failed. Please try again.');
        }
    });

    tickets.forEach(ticket => {
        const button = document.createElement('button');
        button.className = 'ticket-btn';
        button.textContent = `${ticket.type} - $${ticket.price}`;
        button.addEventListener('click', () => {
            showSection('paymentForm');
            document.getElementById('selected-ticket').value = ticket.id;
        });
        document.getElementById('ticket-selection').appendChild(button);
    });

    document.getElementById('payment-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const ticketId = document.getElementById('selected-ticket').value;
        const purchase = purchaseTicket(currentUser.id, ticketId);
        if (purchase) {
            showSection('confirmation');
            const ticketDisplay = document.getElementById('ticket-display');
            const ticket = tickets.find(t => t.id === ticketId);
            ticketDisplay.innerHTML = `
                <h3>Your ${ticket.type} Trip Ticket</h3>
                <p>Valid from: ${purchase.purchaseDate}</p>
                <p>Expires on: ${purchase.expirationDate}</p>
                <p>Ticket ID: ${purchase.id}</p>
            `;
        } else {
            alert('Failed to purchase ticket');
        }
    });

    // Initialize the app
    updateNavigation();
    showSection('register');
});