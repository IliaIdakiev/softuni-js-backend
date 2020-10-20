const userUl = document.getElementById('users');
const registerBtn = document.getElementById('register-btn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const saveBtn = document.getElementById('save-btn');

function apiRequest(part) {
  return `/api/v1/${part}`;
}

function createUserListItem(user) {
  const li = document.createElement('li');
  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.addEventListener('click', function () {
    fetch(apiRequest(`users/${user._id}`), {
      method: 'DELETE'
    }).then(res => res.json()).then(() => { loadAndRenderUsers(); })
  });
  deleteButton.textContent = 'Delete';

  const editButton = document.createElement('button');
  editButton.type = 'button';
  editButton.addEventListener('click', function () {
    emailInput.value = user.email;
    passwordInput.value = user.password;

    registerBtn.style.display = 'none';
    saveBtn.style.display = 'inline';

    function saveHandler() {
      const email = emailInput.value;
      const password = passwordInput.value;
      fetch(apiRequest(`users/${user._id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      }).then(res => res.json()).then(() => {
        emailInput.value = '';
        passwordInput.value = '';
        loadAndRenderUsers();
        saveBtn.style.display = 'none';
        registerBtn.style.display = 'inline';
        saveBtn.removeEventListener('click', saveHandler);
      })
    }

    saveBtn.addEventListener('click', saveHandler);
  });
  editButton.textContent = 'Edit';

  li.textContent = user.email;
  li.appendChild(deleteButton)
  li.appendChild(editButton);
  userUl.appendChild(li);
  return li;
}

function loadAndRenderUsers() {
  userUl.innerHTML = '';
  fetch(apiRequest('users')).then(res => res.json()).then(users => {
    users.forEach(createUserListItem);
  });
}

loadAndRenderUsers();

registerBtn.addEventListener('click', function () {
  const email = emailInput.value;
  const password = passwordInput.value;
  if (!email || !password) {
    alert('Missing data!');
    return;
  }

  fetch(apiRequest('users'), {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  }).then(res => res.json()).then(() => {
    emailInput.value = '';
    passwordInput.value = '';
    loadAndRenderUsers();
  })
});