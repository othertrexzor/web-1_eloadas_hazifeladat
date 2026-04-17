import { useEffect, useState } from "react";
import axios from "axios";
import './App.css'

function App() {
  const [teams, setTeams] = useState([]);
  const [newTeam, setNewTeam] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    axios
      .get("/axios-api/get.php")
      .then((res) => {
        setTeams(res.data);
      })
      .catch((err) => {
        console.error("Hiba a lekérésnél:", err);
      });
  }, []);

  const handleCreate = () => {
    if (newTeam.trim() === "") {
      alert("A csapatnév nem lehet üres!");
      return;
    }
    axios
      .post("/axios-api/create.php",
        { csapatnev: newTeam },
        { headers: { "Content-Type": "application/json" } })
      .then((res) => {
        if (res.data.success) {
          // újra lekérjük az adatokat
          axios.get("/axios-api/get.php").then((r) => setTeams(r.data));
          setNewTeam(""); // input ürítése
        } else {
          alert("Hiba: " + res.data.error);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Hiba történt a hozzáadás során.");
      });
  };

  const startEdit = (team) => {
    setEditId(team.id);
    setEditName(team.csapatnev);
    setNewTeam("");
  };

  const handleUpdate = () => {
    axios.post("/axios-api/update.php",
      { id: editId, csapatnev: editName },
      { headers: { "Content-Type": "application/json" } }
    )
      .then((res) => {
        if (res.data.success) {
          axios.get("/axios-api/get.php").then((r) => setTeams(r.data));
          setEditId(null);
          setEditName("");
        } else {
          alert("Hiba: " + res.data.error);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Hiba történt a frissítés során.");
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Biztosan törlöd ezt a csapatot?")) return;

    axios.post(
      "/axios-api/delete.php",
      { id },
      { headers: { "Content-Type": "application/json" } }
    )
      .then((res) => {
        if (res.data.success) {
          axios.get("/axios-api/get.php").then((r) => setTeams(r.data));
        } else {
          alert("Hiba: " + res.data.error);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Hiba történt a törlés során.");
      });
  };

  return (
    <section class="glass-panel">
      <h2>NB1 Csapatok</h2>

      <div className="crud-form">
        {editId ? (
          <>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <button onClick={handleUpdate}>Mentés</button>
            <button
              className="btn-danger"
              onClick={() => {
                setEditId(null);
                setEditName("");
              }}
            >
              Mégse
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Új csapat neve..."
              value={newTeam}
              onChange={(e) => setNewTeam(e.target.value)}
            />
            <button onClick={handleCreate}>Hozzáadás</button>
          </>
        )}
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Csapatnév</th>
              <th className="th-action">Műveletek</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.csapatnev}</td>
                <td className="td-acton">
                  <div className="axios-actions">
                    <button className="btn-edit" onClick={() => startEdit(t)}>
                      Szerkesztés
                    </button>
                    <button className="btn-danger" onClick={() => handleDelete(t.id)}>
                      Törlés
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default App
