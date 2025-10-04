function showTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
  document.getElementById(tabName).style.display = 'block';
}

const personForm = document.getElementById('personForm');
const peopleTableBody = document.querySelector('#peopleTable tbody');
function loadPeople() {
  fetch('/api/people').then(r => r.json()).then(data => {
    peopleTableBody.innerHTML = '';
    data.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${p.id}</td><td>${p.first_name} ${p.last_name}</td><td>${p.dob}</td><td>${p.gender}</td><td>${p.notes || ''}</td>`;
      peopleTableBody.appendChild(tr);
    });
  });
}
personForm.addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(personForm);
  const obj = Object.fromEntries(formData.entries());
  fetch('/api/people', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(obj)})
    .then(() => { personForm.reset(); loadPeople(); });
});

const callForm = document.getElementById('callForm');
const callsTableBody = document.querySelector('#callsTable tbody');
function loadCalls() {
  fetch('/api/calls').then(r => r.json()).then(data => {
    callsTableBody.innerHTML = '';
    data.forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${c.id}</td><td>${c.type}</td><td>${c.location}</td><td>${c.description}</td><td>${c.assigned_unit || ''}</td><td>${c.status}</td>`;
      callsTableBody.appendChild(tr);
    });
  });
}
callForm.addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(callForm);
  const obj = Object.fromEntries(formData.entries());
  fetch('/api/calls', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(obj)})
    .then(() => { callForm.reset(); loadCalls(); });
});

loadPeople();
loadCalls();