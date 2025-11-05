'use strict'

function fetchUsers() {
  const tbody = document.getElementById("userList");
  if (!tbody) return;

  fetch("http://localhost:5171/users")
    .then(response => response.json())
    .then(users => renderUsers(users))
    .catch(err => console.error(err));
}

function renderUsers(users) {
  const tbody = document.getElementById("userList");
  if (!tbody) return;

  tbody.innerHTML = "";
  users.forEach(user => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.surname}</td>
      <td>${user.dateOfBirth.slice(0,10)}</td>
      ${document.getElementById("userForm") ? `<td><button type="button" onclick="editUser(${user.id})">Izmijeni</button></td>` : ""}
    `;
    tbody.appendChild(tr);
  });
}

function fetchGroupUsers(groupId) {
  const tbody = document.getElementById("groupUserList");
  if (!tbody) return;

  fetch(`http://localhost:5171/users/group/${groupId}`)
    .then(response => {
      if (!response.ok) throw new Error("Nema korisnika u grupi");
      return response.json();
    })
    .then(users => renderGroupUsers(users))
    .catch(err => console.error(err));
}

function renderGroupUsers(users) {
  const tbody = document.getElementById("groupUserList");
  if (!tbody) return;

  tbody.innerHTML = "";
  users.forEach(user => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.surname}</td>
      <td>${user.dateOfBirth.slice(0,10)}</td>
    `;
    tbody.appendChild(tr);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("userList")) {
    fetchUsers();
  }

  const select = document.getElementById("groupId");
  if (select) {
    fetchGroupUsers(select.value);
    select.addEventListener("change", (e) => {
      fetchGroupUsers(e.target.value);
    });
  }

  const form = document.getElementById("userForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const id = document.getElementById("userId").value;
      const name = document.getElementById("name").value;
      const surname = document.getElementById("surname").value;
      const dob = document.getElementById("dob").value;

      const user = { name, surname, dateOfBirth: dob };

      if (id) {
        fetch(`http://localhost:5171/users/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user)
        })
        .then(() => {
          fetchUsers();
          form.reset();
          document.getElementById("userId").value = "";
        })
        .catch(err => console.error(err));
      } else {
        fetch("http://localhost:5171/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user)
        })
        .then(() => {
          fetchUsers();
          form.reset();
        })
        .catch(err => console.error(err));
      }
    });
  }
});

function editUser(id) {
  const form = document.getElementById("userForm");
  if (!form) return;

  fetch(`http://localhost:5171/users/${id}`)
    .then(res => res.json())
    .then(user => {
      document.getElementById("userId").value = user.id;
      document.getElementById("name").value = user.name;
      document.getElementById("surname").value = user.surname;
      document.getElementById("dob").value = user.dateOfBirth.slice(0,10);
    })
    .catch(err => console.error(err));
}
