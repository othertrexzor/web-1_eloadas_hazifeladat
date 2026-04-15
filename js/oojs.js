//Alap menüelem osztály
class MenuButton {
    constructor(label, fileName) {
        this.label = label;
        this.fileName = fileName;

        this.button = document.createElement("button");
        this.button.textContent = this.label;
        this.button.className = "menu-btn";
    }

    onClick(callback) {
        this.button.addEventListener("click", () => callback(this.fileName));
    }

    render(parent) {
        parent.appendChild(this.button);
    }
}

//Kiemelt menüelem (öröklődés)
class HighlightMenuButton extends MenuButton {
    constructor(label, fileName, color) {
        super(label, fileName);
        this.button.style.border = `2px solid ${color}`;
    }
}

//Menü osztály
class Menu {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.items = [];
        this.activeButton = null;
    }

    setActive(button) {
        if (this.activeButton) {
            this.activeButton.button.classList.remove("active");
        }
        this.activeButton = button;
        this.activeButton.button.classList.add("active");
    }

    addItem(item) {
        this.items.push(item);
        item.render(this.container);
    }
}

//Táblázat osztály
class DataTable {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

   render(dataArray) {
    this.container.innerHTML = "";

    if (dataArray.length === 0) {
        this.container.innerHTML = "<p>Nincs megjeleníthető adat.</p>";
        return;
    }

    const table = document.createElement("table");
    table.className = "data-table";

    //Fejléc feldolgozása
    const headerColumns = dataArray[0].split("\t");
    const headerRow = document.createElement("tr");

    headerColumns.forEach(col => {
        const th = document.createElement("th");
        th.textContent = col;
        headerRow.appendChild(th);
    });

    table.appendChild(headerRow);

    //Adatsorok
    for (let i = 1; i < dataArray.length; i++) {
        const row = dataArray[i].split("\t");
        const tr = document.createElement("tr");

        row.forEach((cell, index) => {
            const td = document.createElement("td");

            // Magyar / Külföldi átalakítás
            const colName = headerColumns[index].toLowerCase();

            if (colName === "magyar" || colName === "kulfoldi") {
                if (cell.trim() === "-1") td.textContent = "Igen";
                else if (cell.trim() === "0") td.textContent = "Nem";
                else td.textContent = cell;
            } else {
                td.textContent = cell;
            }

            tr.appendChild(td);
        });

        table.appendChild(tr);
    }

    this.container.appendChild(table);
}


}

//Fájl betöltése
async function loadFile(fileName) {
    const response = await fetch("data/" + fileName);
    const text = await response.text();
    return text.split("\n").filter(x => x.trim() !== "");
}

//Alkalmazás indítása
const menu = new Menu("menu-container");
const table = new DataTable("table");

// Három menüelem
const csapatBtn = new MenuButton("Csapatok", "klub.txt");
const posztBtn = new MenuButton("Posztok", "poszt.txt");
const jatekosBtn = new HighlightMenuButton("Játékosok", "labdarugo.txt");

// Kattintás események
csapatBtn.onClick(async (file) => {
    menu.setActive(csapatBtn);
    table.render(await loadFile(file));
});

posztBtn.onClick(async (file) => {
    menu.setActive(posztBtn);
    table.render(await loadFile(file));
});

jatekosBtn.onClick(async (file) => {
    menu.setActive(jatekosBtn);
    table.render(await loadFile(file));
});

// Menü megjelenítése
menu.addItem(csapatBtn);
menu.addItem(posztBtn);
menu.addItem(jatekosBtn);
