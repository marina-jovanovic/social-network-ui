'use strict'

function fetchUsers() {
  fetch("http://localhost:5171/users")
    .then(response => response.json())
    .then(users => renderUsers(users))
    .catch(err => console.error(err));
}

function renderUsers(users) {
  const tbody = document.getElementById("userList");
  tbody.innerHTML = "";
  users.forEach(user => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.surname}</td>
      <td>${user.dateOfBirth}</td>
    `;
    tbody.appendChild(tr);
  });
}

window.addEventListener("DOMContentLoaded", fetchUsers);


function fetchGroupUsers(groupId) {
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
  tbody.innerHTML = "";
  users.forEach(user => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.surname}</td>
      <td>${user.dateOfBirth}</td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById("groupId").addEventListener("change", (e) => {
  fetchGroupUsers(e.target.value);
});

window.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("groupId");
  fetchGroupUsers(select.value);
});
