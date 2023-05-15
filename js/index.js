const createField = (isCross = true) => {
    deleteField();

    const root = document.getElementById("root");

    const field = document.createElement("table");
    field.id = "field";
    field.classList.add("field");
    root.appendChild(field);

    for (let r = 0; r < 3; ++r) {
        const row = document.createElement("tr");
        field.appendChild(row);

        for (let c = 0; c < 3; ++c) {
            const cell = document.createElement("td");
            cell.id = String(3 * r + c);
            cell.classList.add("cell");
            row.appendChild(cell);
        }
    }

    initField(isCross);
}

const deleteField = () => {
    const field = document.getElementById("field");

    if (field != null) {
        field.remove();
    }
}

const initField = (isCross) => {
    const cells = document.getElementsByClassName("cell");

    let isCrossStep = isCross;

    for (let cell of cells) {
        changeActive(isCrossStep);

        cell.addEventListener("click", function init() {
            this.innerText = ["X", "0"][isCrossStep ? 0 : 1];

            this.removeEventListener("click", init);

            if (isVictory(cells)) {
                deinitField(cells);

                victory(this.innerText, isVictory(cells));
            } else if (isDraw(cells)) {
                deinitField(cells);

                setTimeout(() => {
                    createField(!isCross);
                }, 500);
            }

            isCrossStep = !isCrossStep;

            changeActive(isCrossStep);
        });
    }

    document.getElementById("revenge").addEventListener("click", function revenge() {
        createField(!isCross);
    });
}

const deinitField = (cells) => {
    for (let cell of cells) {
        cell.classList.add("disabled");
    }
}

const isVictory = (cells) => {
    const combs = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let comb of combs) {
        if (cells[comb[0]].innerText === cells[comb[1]].innerText &&
            cells[comb[1]].innerText === cells[comb[2]].innerText &&
            cells[comb[0]].innerText !== "") {
            return [cells[comb[0]], cells[comb[1]], cells[comb[2]]];
        }
    }

    return false;
}

const victory = (character, cells) => {
    if (!isMute) {
        soundPlay("./audio/victory-sound.mp3");
    }

    const playerX = document.getElementById("player-X");
    const player0 = document.getElementById("player-0");

    cells.forEach((cell) => {
        cell.style.backgroundColor = "#ffc107";
    });

    if (character === "X") {
        playerX.innerText = playerX.innerText === "-" ? 1 : String(Number(playerX.innerText) + 1);
    } else {
        player0.innerText = player0.innerText === "-" ? 1 : String(Number(player0.innerText) + 1);
    }
}

const isDraw = (cells) => {
    for (let cell of cells) {
        if (cell.innerText === "") {
            return false;
        }
    }

    return true;
}

const changeActive = (isCrossStep) => {
    const playerX = document.getElementById("player-X");
    const player0 = document.getElementById("player-0");

    if (isCrossStep) {
        playerX.classList.add("active");
        player0.classList.remove("active");
    } else {
        player0.classList.add("active");
        playerX.classList.remove("active");
    }
}

const changeTheme = () => {
    const icon = document.getElementById("theme-icon");
    const button = document.getElementById("theme");

    if (icon.classList.contains("fa-moon")) {
        button.innerHTML = `<i class="fa-solid fa-sun" id="theme-icon"></i>`;

        document.body.style.setProperty("--color", "#212529");
        document.body.style.setProperty("--background-color", "#f8f9fa");
        document.body.style.setProperty("--path", `url("../img/background_negate.jpg")`);
    } else {
        button.innerHTML = `<i class="fa-solid fa-moon" id="theme-icon"></i>`;

        document.body.style.setProperty("--color", "#f8f9fa");
        document.body.style.setProperty("--background-color", "#212529");
        document.body.style.setProperty("--path", `url("../img/background.jpg")`);
    }
}

const changeMute = () => {
    const icon = document.getElementById("mute-icon");
    const button = document.getElementById("mute");

    if (icon.classList.contains("fa-volume-low")) {
        button.innerHTML = `<i class="fa-solid fa-volume-xmark" id="mute-icon"></i>`;

        isMute = true;
    } else {
        button.innerHTML = `<i class="fa-solid fa-volume-low" id="mute-icon"></i>`;

        isMute = false;
    }
}

const soundPlay = (path) => {
    const audio = new Audio();
    audio.src = path;
    audio.autoplay = true;
}

let isMute = false;

window.addEventListener("load", () => {
    createField();

    document.getElementById("theme").addEventListener("click", () => {
        changeTheme();
    });

    document.getElementById("mute").addEventListener("click", () => {
        changeMute();
    });
});