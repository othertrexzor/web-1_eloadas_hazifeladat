const tbody = document.getElementById("posztTableBody");
const submitBtn = document.getElementById('submit-btn');
const inputId = document.getElementById('poszt-id');
const inputName = document.getElementById('poszt-name');
const form = document.getElementById("crud-form");

console.log('MAIN JS FUT');

function TbShowData() {
    let maxId = 0;
    fetch("/fetchapi/php/crud/getposts.php")
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                tbody.innerHTML = "";
                data.posztok.forEach(row => {

                    const idNum = Number(row.id);
                    if (idNum > maxId) maxId = idNum;

                    const tr = document.createElement("tr");

                    const tdId = document.createElement("td");
                    tdId.textContent = row.id;

                    const tdPoszt = document.createElement('td');
                    tdPoszt.textContent = row.nev;

                    const tdActions = document.createElement('td');
                    tdActions.className = 'actions';
                    tdActions.style.textAlign = 'right';
                    tdActions.style.justifyContent = 'flex-end';

                    const editBtn = document.createElement('button');
                    editBtn.type = "button";
                    editBtn.textContent = 'Módosítás';
                    editBtn.className = 'btn-edit';
                    editBtn.onclick = () => btEdit_Click(row.id, row.nev);

                    const deleteBtn = document.createElement('button');
                    deleteBtn.type = 'button';
                    deleteBtn.textContent = 'Törlés';
                    deleteBtn.className = 'btn-danger';
                    deleteBtn.onclick = () => btDanger_Click(row.id);

                    tdActions.appendChild(editBtn);
                    tdActions.appendChild(deleteBtn);

                    tr.appendChild(tdId);
                    tr.appendChild(tdPoszt);
                    tr.appendChild(tdActions);
                    tbody.appendChild(tr);
                });
                const nextId = maxId + 1;


            } else {
                tbody.innerHTML = `<tr><td colspan="5" style="color:red">${data.message}</td></tr>`;
            }
        })
        .catch(err => {
            tbody.innerHTML = `<tr><td colspan="5" style="color:red">Network error: ${err}</td></tr>`;
        });

}

function btEdit_Click(id, nev) {
    inputId.value = id;
    inputName.value = nev;
    submitBtn.textContent = 'Mentés'
}

function btDanger_Click(id) {
    if (!confirm("Biztosan törölni szeretnéd ezt a posztot?")) {
        return; // ha nem, akkor kilépünk
    }

    // ha igen, akkor törlés
    fetch("/fetchapi/php/crud/delete.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "id=" + encodeURIComponent(id)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            TbShowData(); // frissítjük a táblázatot
        } else {
            alert("Hiba történt törlés közben!");
        }
    })
    .catch(err => {
        alert("Hálózati hiba történt!");
    });
}




form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const id = formData.get("poszt-id");
    const name = formData.get("poszt-name");

    if (id && id.trim() !== "") {
        fetch("/fetchapi/php/crud/modify.php", {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    submitBtn.textContent = "Hozzáadás";   // <<< EZ A LÉNYEG
                    inputId.value = "";                   // <<< Ürítjük az ID-t
                    inputName.value = "";
                    setTimeout(() => {
                        TbShowData();
                    }, 50);
                } else {
                    alert("Something Wrong");
                }
            })
            .catch(err => {
                alert("Network alert!");
            });

    } else {
        fetch("/fetchapi/php/crud/new.php", {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    TbShowData();
                } else {
                    alert("Something Wrong");
                }
            })
            .catch(err => {
                alert("Network alert!");
            });
    }

});

document.addEventListener('DOMContentLoaded', TbShowData);
