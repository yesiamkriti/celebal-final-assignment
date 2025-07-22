const API_URL = 'http://springboot4api.eastus.azurecontainer.io:8080/users'
const form = document.getElementById('userForm')
const tableBody = document.querySelector('#userTable tbody')

let editUserId = null

// Load users on page load
async function loadUsers() {
  const res = await fetch(API_URL)
  const users = await res.json()
  tableBody.innerHTML = users
    .map(
      (user, index) => `
      <tr>
        <td>${index + 1}</td>
        <td><input class="form-control form-control-sm" value="${
          user.name
        }" id="name-${user.id}" /></td>
        <td><input class="form-control form-control-sm" value="${
          user.email
        }" id="email-${user.id}" /></td>
        <td>
          <button class="btn btn-sm btn-success" onclick="updateUser(${
            user.id
          })">Update</button>
          <button class="btn btn-sm btn-danger" onclick="deleteUser(${
            user.id
          })">Delete</button>
        </td>
      </tr>
    `
    )
    .join('')
}

// Add user
form.onsubmit = async (e) => {
  e.preventDefault()
  const name = document.getElementById('name').value.trim()
  const email = document.getElementById('email').value.trim()

  if (!name || !email) return alert('Please fill all fields')

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email }),
  })

  form.reset()
  loadUsers()
}

// Update user
async function updateUser(id) {
  const name = document.getElementById(`name-${id}`).value.trim()
  const email = document.getElementById(`email-${id}`).value.trim()

  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, name, email }),
  })

  loadUsers()
}

// Delete user
async function deleteUser(id) {
  if (!confirm('Are you sure you want to delete this user?')) return

  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  })

  loadUsers()
}

loadUsers()
