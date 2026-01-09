const API_URL = '/api/users';
const userTableBody = document.getElementById('users-table-body');
const userModal = document.getElementById('user-modal');
const userForm = document.getElementById('user-form');
const modalTitle = document.getElementById('modal-title');
const addUserBtn = document.getElementById('add-user-btn');
const closeBtn = document.querySelector('.close-btn');
const cancelBtn = document.getElementById('cancel-btn');
const searchInput = document.getElementById('search-input');
const noUsersMessage = document.getElementById('no-users-message');
let usersData = [];

document.addEventListener('DOMContentLoaded', fetchUsers);

async function fetchUsers() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch users');
        usersData = await response.json();
        renderUsers(usersData);
    } catch (error) {
        showToast(error.message, 'error');
    }
}

function renderUsers(users) {
    userTableBody.innerHTML = '';
    if (users.length === 0) {
        noUsersMessage.classList.remove('hidden');
    } else {
        noUsersMessage.classList.add('hidden');
        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.id}</td>
                <td>${escapeHtml(user.name)}</td>
                <td>${escapeHtml(user.email)}</td>
                <td>${escapeHtml(user.phone || '-')}</td>
                <td>
                    <button class="btn btn-edit" onclick="openEditModal(${user.id})"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn btn-delete" onclick="deleteUser(${user.id})"><i class="fas fa-trash-alt"></i> Delete</button>
                </td>
            `;
            userTableBody.appendChild(tr);
        });
    }
}

function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filteredUsers = usersData.filter(user => 
        user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
    );
    renderUsers(filteredUsers);
});

addUserBtn.addEventListener('click', () => { openModal('Add User'); });
closeBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
window.onclick = function(event) { if (event.target == userModal) { closeModal(); } }

function openModal(title) {
    modalTitle.textContent = title;
    userForm.reset();
    document.getElementById('user-id').value = '';
    userModal.style.display = 'flex';
}

function closeModal() {
    userModal.style.display = 'none';
    clearErrors();
}

function openEditModal(id) {
    const user = usersData.find(u => u.id === id);
    if (user) {
        openModal('Edit User');
        document.getElementById('user-id').value = user.id;
        document.getElementById('name').value = user.name;
        document.getElementById('email').value = user.email;
        document.getElementById('phone').value = user.phone;
    }
}

userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const id = document.getElementById('user-id').value;
    const user = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value
    };
    try {
        let response;
        if (id) {
            response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });
        } else {
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });
        }
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Operation failed');
        }
        showToast(id ? 'User updated successfully' : 'User created successfully', 'success');
        closeModal();
        fetchUsers();
    } catch (error) {
        showToast(error.message, 'error');
    }
});

async function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete user');
            showToast('User deleted successfully', 'success');
            fetchUsers();
        } catch (error) {
            showToast(error.message, 'error');
        }
    }
}

function validateForm() {
    clearErrors();
    let isValid = true;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    if (name.length < 2) { document.getElementById('name-error').textContent = 'Name must be at least 2 characters'; isValid = false; }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) { document.getElementById('email-error').textContent = 'Invalid email format'; isValid = false; }
    return isValid;
}

function clearErrors() { document.querySelectorAll('.error-msg').forEach(el => el.textContent = ''); }
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => { toast.className = toast.className.replace('show', ''); }, 3000);
}
