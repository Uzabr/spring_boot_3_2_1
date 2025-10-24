document.addEventListener('DOMContentLoaded', function () {
    // Получаем CSRF токен из мета-тега
    const token = document.querySelector('meta[name="_csrf"]').getAttribute('content');
    const headerName = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

    console.log('CSRF Token:', token);
    console.log('CSRF Header:', headerName);

    let currentUser = null;
    let allUsers = [];
    let allRoles = [];

    // Инициализация
    initializePage();

    // Логаут
    document.getElementById('logoutBtn').addEventListener('click', function () {
        document.getElementById('logoutForm').submit();
    });

    // Инициализация страницы
    async function initializePage() {
        try {
            await loadAllUsers();
            await loadAllRoles();
            populateRolesDropdowns();
            setupEventListeners();

            // Показываем первого пользователя в информации (временно)
            if (allUsers.length > 0) {
                populateUserInfoTab(allUsers[0]);
            }

            // Устанавливаем текущего пользователя (временно)
            document.getElementById('currentUsername').textContent = 'admin@mail.ru';
            document.getElementById('currentUserRoles').textContent = 'ROLE_ADMIN';

        } catch (error) {
            console.error('Error during initialization:', error);
            showAlert('Error loading page data!', 'danger');
        }
    }

    // Загрузка всех пользователей
    async function loadAllUsers() {
        try {
            console.log('Loading users...');
            const response = await fetch('/api/admin/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    [headerName]: token
                }
            });

            console.log('Users response status:', response.status);

            if (response.ok) {
                allUsers = await response.json();
                console.log('Loaded users:', allUsers);
                populateUsersTable();
            } else {
                throw new Error(`Failed to load users: ${response.status}`);
            }
        } catch (error) {
            console.error('Error loading users:', error);
            showAlert('Error loading users!', 'danger');
        }
    }

    // Загрузка всех ролей
    async function loadAllRoles() {
        try {
            console.log('Loading roles...');
            const response = await fetch('/api/admin/users/roles', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    [headerName]: token
                }
            });

            console.log('Roles response status:', response.status);

            if (response.ok) {
                allRoles = await response.json();
                console.log('Loaded roles:', allRoles);
            } else {
                throw new Error(`Failed to load roles: ${response.status}`);
            }
        } catch (error) {
            console.error('Error loading roles:', error);
            showAlert('Error loading roles!', 'danger');
        }
    }

    // Заполнение таблицы пользователей
    function populateUsersTable() {
        const tbody = document.querySelector('#usersTable tbody');
        tbody.innerHTML = '';

        if (allUsers.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="8" class="text-center">No users found</td>`;
            tbody.appendChild(row);
            return;
        }

        allUsers.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${user.id || ''}</td>
            <td>${user.username || ''}</td>
            <td>${user.firstName || ''}</td>
            <td>${user.lastName || ''}</td>
            <td>${user.age || ''}</td>
            <td>${user.roles ? user.roles.map(role => role.name).join(', ') : ''}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary edit-user" data-user-id="${user.id}">
                    Edit
                </button>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-danger delete-user" data-user-id="${user.id}">
                    Delete
                </button>
            </td>
        `;
            tbody.appendChild(row);
        });

        console.log('Users table populated with', allUsers.length, 'users');
    }

    // Заполнение информации о пользователе
    function populateUserInfoTab(user) {
        if (!user) return;

        const tbody = document.getElementById('userInfoTable');
        tbody.innerHTML = `
            <tr>
                <td>${user.id || ''}</td>
                <td>${user.username || ''}</td>
                <td>${user.firstName || ''}</td>
                <td>${user.lastName || ''}</td>
                <td>${user.age || ''}</td>
                <td>${user.roles ? user.roles.map(role => role.name).join(', ') : ''}</td>
            </tr>
        `;
    }

    // Заполнение выпадающих списков ролей
    function populateRolesDropdowns() {
        const createSelect = document.getElementById('createRoles');
        const editSelect = document.getElementById('editRoles');
        const deleteSelect = document.getElementById('deleteRoles'); // Добавляем для удаления

        createSelect.innerHTML = '';
        editSelect.innerHTML = '';
        deleteSelect.innerHTML = ''; // Очищаем для удаления

        // Добавляем пустую опцию для создания и редактирования
        const emptyOption1 = document.createElement('option');
        emptyOption1.value = '';
        emptyOption1.textContent = 'Select a role';
        emptyOption1.disabled = true;
        emptyOption1.selected = true;
        createSelect.appendChild(emptyOption1);

        const emptyOption2 = document.createElement('option');
        emptyOption2.value = '';
        emptyOption2.textContent = 'Select a role';
        emptyOption2.disabled = true;
        emptyOption2.selected = true;
        editSelect.appendChild(emptyOption2);

        // Для удаления не добавляем пустую опцию, так как она только для отображения
        if (allRoles.length === 0) {
            const option = document.createElement('option');
            option.textContent = 'No roles available';
            option.disabled = true;
            createSelect.appendChild(option);
            editSelect.appendChild(option.cloneNode(true));
            deleteSelect.appendChild(option.cloneNode(true)); // Для удаления
            return;
        }

        allRoles.forEach(role => {
            const option1 = document.createElement('option');
            option1.value = role.id;
            option1.textContent = role.name;
            createSelect.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = role.id;
            option2.textContent = role.name;
            editSelect.appendChild(option2);

            const option3 = document.createElement('option'); // Для удаления
            option3.value = role.id;
            option3.textContent = role.name;
            deleteSelect.appendChild(option3);
        });
    }


    // Настройка обработчиков событий
    function setupEventListeners() {
        // Создание пользователя
        document.getElementById('createUserForm').addEventListener('submit', handleCreateUser);

        // Редактирование пользователя
        document.getElementById('editUserForm').addEventListener('submit', handleEditUser);

        // Удаление пользователя
        document.getElementById('confirmDeleteBtn').addEventListener('click', handleDeleteUser);

        // Обработчики для динамических кнопок - делегирование событий
        document.addEventListener('click', function (e) {
            if (e.target.classList.contains('edit-user')) {
                const userId = e.target.getAttribute('data-user-id');
                console.log('Edit button clicked for user ID:', userId);
                openEditModal(userId);
            }

            if (e.target.classList.contains('delete-user')) {
                const userId = e.target.getAttribute('data-user-id');
                console.log('Delete button clicked for user ID:', userId);
                openDeleteModal(userId);
            }
        });

        console.log('Event listeners set up');
    }

    // Обработка создания пользователя
    async function handleCreateUser(e) {
        e.preventDefault();

        // Собираем данные вручную, а не через FormData
        const form = e.target;
        const userData = {
            username: form.username.value,
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            age: parseInt(form.age.value),
            password: form.password.value,
            roleId: parseInt(form.roleId.value) // ОДИНОЧНОЕ значение
        };

        console.log('Creating user:', userData);

        try {
            const response = await fetch('/api/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    [headerName]: token
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                const modal = bootstrap.Modal.getInstance(document.getElementById('createUserModal'));
                modal.hide();
                form.reset();
                await loadAllUsers();
                showAlert('User created successfully!', 'success');
            } else {
                const errorText = await response.text();
                throw new Error(`Failed to create user: ${errorText}`);
            }
        } catch (error) {
            console.error('Error creating user:', error);
            showAlert('Error creating user: ' + error.message, 'danger');
        }
    }

    // Открытие модального окна редактирования
    async function openEditModal(userId) {
        try {
            console.log('Opening edit modal for user ID:', userId);

            const user = allUsers.find(u => u.id == userId);

            if (!user) {
                throw new Error(`User with ID ${userId} not found in local data`);
            }

            console.log('Found user for editing:', user);

            // Заполняем форму данными пользователя
            document.getElementById('editUserId').value = user.id;
            document.getElementById('editUsername').value = user.username || '';
            document.getElementById('editFirstName').value = user.firstName || '';
            document.getElementById('editLastName').value = user.lastName || '';
            document.getElementById('editAge').value = user.age || '';

            // Установка выбранной роли (одиночное значение)
            const roleSelect = document.getElementById('editRoles');

            // Сбрасываем выбор
            roleSelect.value = '';

            // Устанавливаем выбранную роль пользователя (берем первую роль)
            if (user.roles && user.roles.length > 0) {
                roleSelect.value = user.roles[0].id;
            }

            const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
            modal.show();
        } catch (error) {
            console.error('Error loading user for edit:', error);
            showAlert('Error loading user data: ' + error.message, 'danger');
        }
    }

    // Обработка редактирования пользователя
    async function handleEditUser(e) {
        e.preventDefault();

        // Собираем данные вручную
        const form = e.target;
        const userData = {
            id: parseInt(form.id.value),
            username: form.username.value,
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            age: parseInt(form.age.value),
            password: form.password.value || null,
            roleId: parseInt(form.roleId.value) // ОДИНОЧНОЕ значение
        };

        console.log('Updating user:', userData);

        try {
            const response = await fetch(`/api/admin/users/${userData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    [headerName]: token
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
                modal.hide();
                await loadAllUsers();
                showAlert('User updated successfully!', 'success');
            } else {
                const errorText = await response.text();
                throw new Error(`Failed to update user: ${errorText}`);
            }
        } catch (error) {
            console.error('Error updating user:', error);
            showAlert('Error updating user: ' + error.message, 'danger');
        }
    }

    // Открытие модального окна удаления
    function openDeleteModal(userId) {
        try {
            console.log('Opening delete modal for user ID:', userId);

            const user = allUsers.find(u => u.id == userId);

            if (!user) {
                throw new Error(`User with ID ${userId} not found in local data`);
            }

            console.log('Found user for deletion:', user);

            // Заполняем форму данными пользователя
            document.getElementById('deleteUserId').value = user.id;
            document.getElementById('deleteUsername').value = user.username || '';
            document.getElementById('deleteFirstName').value = user.firstName || '';
            document.getElementById('deleteLastName').value = user.lastName || '';
            document.getElementById('deleteAge').value = user.age || '';

            // Установка выбранной роли (только для отображения)
            const roleSelect = document.getElementById('deleteRoles');

            // Сбрасываем выбор
            roleSelect.value = '';

            // Устанавливаем выбранную роль пользователя (берем первую роль)
            if (user.roles && user.roles.length > 0) {
                roleSelect.value = user.roles[0].id;
            }

            const modal = new bootstrap.Modal(document.getElementById('deleteUserModal'));
            modal.show();
        } catch (error) {
            console.error('Error loading user for deletion:', error);
            showAlert('Error loading user data: ' + error.message, 'danger');
        }
    }

    // Обработка удаления пользователя
    async function handleDeleteUser() {
        const userId = document.getElementById('deleteUserId').value;

        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    [headerName]: token
                }
            });

            if (response.ok) {
                const modal = bootstrap.Modal.getInstance(document.getElementById('deleteUserModal'));
                modal.hide();
                await loadAllUsers();
                showAlert('User deleted successfully!', 'success');
            } else {
                const errorText = await response.text();
                throw new Error(`Failed to delete user: ${errorText}`);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            showAlert('Error deleting user: ' + error.message, 'danger');
        }
    }

    // Вспомогательная функция для показа уведомлений
    function showAlert(message, type) {
        // Удаляем существующие уведомления
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());

        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
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
});