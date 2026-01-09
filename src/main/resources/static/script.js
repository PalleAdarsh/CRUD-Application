const API_URL = '/api/users';

// State
let users = [];

// DOM Elements
const userTableBody = document.getElementById('userTableBody');
const noDataMessage = document.getElementById('noDataMessage');
const modal = document.getElementById('userModal');
const userForm = document.getElementById('userForm');
const modalTitle = document.getElementById('modalTitle');
const saveBtn = document.getElementById('saveBtn');
const addNewBtn = document.getElementById('addNewBtn');
const closeBtn = document.querySelector('.close-btn');
const cancelBtn = document.querySelector('.cancel-btn');
const toast = document.getElementById('toast');

// Event Listeners
document.addEventListener('DOMContentLoaded', fetchUsers);
addNewBtn.addEventListener('click', openAddModal);
closeBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
userForm.addEventListener('submit', handleFormSubmit);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Fetch Users
async function fetchUsers() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch users');
        users = await response.json();
        renderTable();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// Render Table
function renderTable() {
    userTableBody.innerHTML = '';

    if (users.length === 0) {
        noDataMessage.classList.remove('hidden');
        return;
    }

    noDataMessage.classList.add('hidden');

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone || '-'}</td>
            <td>
                <button class="btn btn-edit" onclick="openEditModal(${user.id})">Edit</button>
                <button class="btn btn-danger" onclick="confirmDelete(${user.id})">Delete</button>
            </td>
        `;
        userTableBody.appendChild(row);
    });
}

// Form Handling
async function handleFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('userId').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    const userData = { name, email, phone };
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Operation failed');
        }

        await fetchUsers();
        closeModal();
        showToast(id ? 'User updated successfully' : 'User created successfully', 'success');
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// Delete Handling
window.confirmDelete = async (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete user');

            await fetchUsers();
            showToast('User deleted successfully', 'success');
        } catch (error) {
            showToast(error.message, 'error');
        }
    }
};

// Modal Functions
function openAddModal() {
    modalTitle.textContent = 'Add New User';
    userForm.reset();
    document.getElementById('userId').value = '';
    saveBtn.textContent = 'Save User';
    modal.classList.remove('hidden');
}

window.openEditModal = (id) => {
    const user = users.find(u => u.id === id);
    if (!user) return;

    modalTitle.textContent = 'Edit User';
    document.getElementById('userId').value = user.id;
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('phone').value = user.phone || '';
    saveBtn.textContent = 'Update User';
    modal.classList.remove('hidden');
};

function closeModal() {
    modal.classList.add('hidden');
}

// Toast Function
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}
