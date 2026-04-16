// Initial data from klub.txt
let clubs = [
    { id: 1, name: 'Vasas FC' },
    { id: 2, name: 'Ferencvárosi TC' },
    { id: 3, name: 'Puskás Akadémia FC' },
    { id: 4, name: 'Debreceni VSC' },
    { id: 5, name: 'Budapest Honvéd FC' },
    { id: 6, name: 'Szombathelyi Haladás' },
    { id: 7, name: 'Paksi FC' },
    { id: 8, name: 'Mezőkövesd Zsóry FC' },
    { id: 9, name: 'Diósgyőri VTK' },
    { id: 10, name: 'Újpest FC' },
    { id: 11, name: 'Balmazújváros FC' },
    { id: 12, name: 'Videoton FC' }
];

// Determine max ID for new insertions
let currentId = clubs.length > 0 ? Math.max(...clubs.map(c => c.id)) : 0;

// DOM Elements
const form = document.getElementById('crud-form');
const inputName = document.getElementById('club-name');
const inputId = document.getElementById('club-id');
const submitBtn = document.getElementById('submit-btn');
const tableBody = document.getElementById('table-body');

/**
 * Megjeleníti a csapatok listáját a HTML táblázatban.
 * Törli a táblázat jelenlegi tartalmát, majd újra feltölti azt
 * a `clubs` tömb aktuális állapota alapján.
 */
function renderTable() {
    tableBody.innerHTML = '';
    
    if (clubs.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding: 2rem;">Nincs megjeleníthető csapat.</td></tr>`;
        return;
    }

    clubs.forEach(club => {
        const tr = document.createElement('tr');
        
        // ID cell
        const tdId = document.createElement('td');
        tdId.textContent = club.id;
        
        // Name cell
        const tdName = document.createElement('td');
        tdName.textContent = club.name;
        
        // Actions cell
        const tdActions = document.createElement('td');
        tdActions.className = 'actions';
        tdActions.style.textAlign = 'right';
        tdActions.style.justifyContent = 'flex-end';
        
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Módosítás';
        editBtn.className = 'btn-edit';
        editBtn.onclick = () => loadClubForEdit(club.id);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Törlés';
        deleteBtn.className = 'btn-danger';
        deleteBtn.onclick = () => deleteClub(club.id);
        
        tdActions.appendChild(editBtn);
        tdActions.appendChild(deleteBtn);
        
        tr.appendChild(tdId);
        tr.appendChild(tdName);
        tr.appendChild(tdActions);
        
        tableBody.appendChild(tr);
    });
}

// Create & Update
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameValue = inputName.value.trim();
    if (!nameValue) return;

    if (inputId.value) {
        // Update existing
        const idToUpdate = parseInt(inputId.value);
        const clubIndex = clubs.findIndex(c => c.id === idToUpdate);
        if (clubIndex !== -1) {
            clubs[clubIndex].name = nameValue;
        }
    } else {
        // Create new
        currentId++;
        clubs.push({ id: currentId, name: nameValue });
    }
    
    // Reset form
    resetForm();
    renderTable();
});

/**
 * Betölti a kiválasztott csapat adatait az űrlapba módosítás céljából.
 * @param {number} id - A módosítandó csapat egyedi azonosítója.
 */
function loadClubForEdit(id) {
    const club = clubs.find(c => c.id === id);
    if (!club) return;
    
    inputId.value = club.id;
    inputName.value = club.name;
    submitBtn.textContent = 'Mentés';
}

/**
 * Töröl egy csapatot és frissíti a táblázatot.
 * Törlés előtt a felhasználó megerősítését kéri.
 * @param {number} id - A törlendő csapat egyedi azonosítója.
 */
function deleteClub(id) {
    if (confirm('Biztosan törölni szeretnéd ezt a csapatot?')) {
        clubs = clubs.filter(c => c.id !== id);
        // Ha az éppen szerkesztett elemet töröljük, ürítsük a formot
        if (inputId.value == id) {
            resetForm();
        }
        renderTable();
    }
}

/**
 * Visszaállítja az űrlap beviteli mezőit az alapértelmezett üres állapotba,
 * és az elküldés gomb feliratát.
 */
function resetForm() {
    inputId.value = '';
    inputName.value = '';
    submitBtn.textContent = 'Hozzáadás';
    inputName.focus();
}

// Initial render
document.addEventListener('DOMContentLoaded', renderTable);
