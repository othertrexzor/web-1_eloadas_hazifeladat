import React, { useState, useEffect } from 'react';

export default function ReactCrud() {
    const [players, setPlayers] = useState([]);
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        // Feltételezzük, hogy a public mappában van a labdarugo.txt
        fetch('/labdarugo.txt')
            .then(res => res.text())
            .then(text => {
                const lines = text.trim().split('\n');
                const loadedPlayers = lines.map(line => {
                    const [id, name, number] = line.split(';');
                    return { id: parseInt(id, 10), name: name.trim(), number: parseInt(number, 10) };
                }).filter(p => !isNaN(p.id));
                setPlayers(loadedPlayers);
            })
            .catch(err => console.error('Hiba a labdarugo.txt betöltésekor:', err));
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const trimmedName = name.trim();
        const numVal = parseInt(number, 10);

        if (!trimmedName || isNaN(numVal)) return;

        const nameParts = trimmedName.split(/\s+/);
        if (nameParts.length !== 2) {
            alert('Hibás formátum! A névnek pontosan két szóból kell állnia (Vezetéknév és Keresztnév szóközzel elválasztva).');
            return;
        }

        if (numVal < 0 || numVal > 99) {
            alert('Hibás mezszám! Kérlek 0 és 99 közötti számot adj meg.');
            return;
        }

        if (editId) {
            setPlayers(players.map(p => p.id === editId ? { ...p, name: trimmedName, number: numVal } : p));
            setEditId(null);
        } else {
            const maxId = players.length > 0 ? Math.max(...players.map(p => p.id)) : 0;
            setPlayers([...players, { id: maxId + 1, name: trimmedName, number: numVal }]);
        }
        setName('');
        setNumber('');
    };

    const handleEdit = (player) => {
        setName(player.name);
        setNumber(player.number.toString());
        setEditId(player.id);
        const input = document.getElementById('spa-player-name');
        if (input) input.focus();
    };

    const handleDelete = (id) => {
        if (window.confirm('Biztosan törölni szeretnéd ezt a játékost?')) {
            setPlayers(players.filter(p => p.id !== id));
            if (editId === id) {
                setName('');
                setNumber('');
                setEditId(null);
            }
        }
    };

    return (
        <div>
            <h2>Játékosok Kezelése (React CRUD)</h2>
            <form className="crud-form" onSubmit={handleSubmit} id="spa-crud-form">
                <input
                    type="text"
                    id="spa-player-name"
                    placeholder="Vezetéknév Keresztnév"
                    value={name}
                    pattern="^[A-ZÁÉÍÓÖŐÚÜŰa-záéíóöőúüű\-]+\s[A-ZÁÉÍÓÖŐÚÜŰa-záéíóöőúüű\-]+$"
                    title="Kérjük, pontosan két szót adjon meg (pl. Németh Márió)!"
                    onChange={(evt) => setName(evt.target.value)}
                    autoComplete="off"
                    required
                />
                <input
                    type="number"
                    id="spa-player-number"
                    placeholder="Mezszám (0-99)"
                    value={number}
                    min="0"
                    max="99"
                    onChange={(evt) => setNumber(evt.target.value)}
                    style={{ minWidth: '90px', flex: '0.5' }}
                    required
                />
                <button type="submit">{editId ? 'Mentés' : 'Hozzáadás'}</button>
            </form>

            <div className="table-container" style={{ marginTop: '1rem' }}>
                <table id="spa-players-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '10%', borderBottom: '1px solid #dee2e6', padding: '0.5rem' }}>ID</th>
                            <th style={{ borderBottom: '1px solid #dee2e6', padding: '0.5rem' }}>Játékos Név</th>
                            <th style={{ width: '15%', borderBottom: '1px solid #dee2e6', padding: '0.5rem' }}>Mezszám</th>
                            <th style={{ width: '20%', textAlign: 'right', borderBottom: '1px solid #dee2e6', padding: '0.5rem' }}>Műveletek</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>Nincs megjeleníthető játékos.</td>
                            </tr>
                        ) : (
                            players.map(player => (
                                <tr key={player.id}>
                                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>{player.id}</td>
                                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>{player.name}</td>
                                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>{player.number}</td>
                                    <td className="actions" style={{ textAlign: 'right', justifyContent: 'flex-end', padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>
                                        <button type="button" className="btn-edit" onClick={() => handleEdit(player)}>Módosítás</button>
                                        <button type="button" className="btn-danger" onClick={() => handleDelete(player.id)}>Törlés</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
