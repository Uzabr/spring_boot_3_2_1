// user.js

const USER_API_URL = '/api/user/current';

// Объявляем переменные на уровне модуля
let token = '';
let headerName = '';

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('User page initialized');

    // Получаем CSRF токен из мета-тега
    token = document.querySelector('meta[name="_csrf"]').getAttribute('content');
    headerName = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

    console.log('CSRF Token:', token);
    console.log('CSRF Header:', headerName);

    loadUserData();
    setupEventListeners();
});

// Загрузка данных пользователя
async function loadUserData() {
    showLoading('userInfoTable');

    try {
        const response = await fetch(USER_API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                [headerName]: token
            }
        });

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('Access denied. Please log in again.');
            }
            throw new Error(`Loading error: ${response.status}`);
        }

        const user = await response.json();
        console.log('Loaded user data:', user);
        renderUserInfo(user);
        updateUserHeader(user);
        hideLoading('userInfoTable');

    } catch (error) {
        console.error('Error loading user data:', error);
        hideLoading('userInfoTable');
        showAlert(error.message, 'danger');
    }
}

// Рендер информации о пользователе в таблице
function renderUserInfo(user) {
    const tbody = document.querySelector('#userInfoTable');
    if (!tbody) {
        console.error('User info table not found');
        return;
    }

    tbody.innerHTML = '';

    const row = document.createElement('tr');

    // Получаем названия ролей
    const roleNames = getUserRoleNames(user);

    row.innerHTML = `
        <td>${user.id || ''}</td>
        <td>${escapeHtml(user.username || '')}</td>
        <td>${escapeHtml(user.firstName || '')}</td>
        <td>${escapeHtml(user.lastName || '')}</td>
        <td>${user.age || ''}</td>
        <td>${roleNames}</td>
    `;

    tbody.appendChild(row);
}

// Обновление заголовка с информацией о пользователе
function updateUserHeader(user) {
    const usernameElement = document.getElementById('currentUsername');
    const rolesElement = document.getElementById('currentUserRoles');

    if (usernameElement) {
        usernameElement.textContent = user.username || 'User';
    }

    if (rolesElement) {
        const roleNames = getUserRoleNames(user);
        rolesElement.textContent = roleNames || 'USER';
    }
}

// Получение названий ролей пользователя
function getUserRoleNames(user) {
    let roleNames = '';

    if (user.roles && Array.isArray(user.roles)) {
        roleNames = user.roles.map(role =>
            typeof role === 'string' ? role :
                role.name ? role.name :
                    role.authority ? role.authority : ''
        ).filter(name => name).join(', ');
    } else if (user.authorities && Array.isArray(user.authorities)) {
        roleNames = user.authorities.map(auth =>
            auth.authority
        ).join(', ');
    }

    return roleNames;
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Логаут
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            document.getElementById('logoutForm').submit();
        });
    }
}

// Вспомогательная функция для показа уведомлений
function showAlert(message, type) {
    // Удаляем существующие уведомления
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.style.cssText = 'position: fixed; top: 80px; right: 20px; z-index: 1050; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(alertDiv);

    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<tr><td colspan="6" class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></td></tr>';
    }
}

function hideLoading(elementId) {
    // Логика скрытия loading state (оставляем пустым, так как данные уже загружены)
}

function escapeHtml(unsafe) {
    if (unsafe === null || unsafe === undefined) return '';
    return unsafe
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}