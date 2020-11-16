const alertChoose = document.getElementById("alert-choose");
const showMenu = document.getElementById("show-menu");
const showAI = document.getElementById("show-ai");
const showHuman = document.getElementById("show-human");
const btnSelectGameMode = document.getElementById("reload-human");
const selectMode = document.getElementById("selectMode");

$(document).ready(function () {
  showMenu.style.display = "none";

  $("#human").click(function () {
    alertChoose.style.display = "none";
    showHuman.style.display = "block";
    showAI.style.display = "none";
    showMenu.style.display = "block";
    selectMode.innerHTML = "PvP";
  });

  $("#ai").click(function () {
    alertChoose.style.display = "none";
    showHuman.style.display = "none";
    showAI.style.display = "block";
    showMenu.style.display = "block";
    selectMode.innerHTML = "PvC";
  });

  $("#reload").click(function () {
    if (confirm("Bạn có chắc là mình muốn chọn lại chế độ ?")) {
      location.reload();
    }
  });

  btnSelectGameMode.addEventListener("click", function () {
    if (confirm("Bạn có chắc là mình muốn chọn lại chế độ ?")) {
      location.reload();
    }
  });
});
