
document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
})
let originalOnclickState;
function toggleFlagMarkCell(cell) {
    cell.classList.toggle('flag-mark');
    if (cell.onclick == null) {
        console.log("hereee");
        cell.onclick=originalOnclickState;
    } else {
        originalOnclickState = cell.onclick;
        cell.onclick = null;
    }

}

function toggleclickedCell(cell) {

    cell.classList.toggle('clickedCell');
    cell.onclick = null;
    cell.oncontextmenu = null;

}


function restartGame() {
    location.reload();
}

