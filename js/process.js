const alertChoose = document.getElementById("alert-choose");
const showMenu = document.getElementById("show-menu");
const showMay = document.getElementById("show-may");
const showNguoi = document.getElementById("show-nguoi");
const content = document.getElementById("content");

$(document).ready(function () {
  showMenu.style.display = "none";

  $("#nguoi").click(function () {
    alertChoose.style.display = "none";
    showNguoi.style.display = "none";
    showMay.style.display = "block";
    showMenu.style.display = "block";
  });

  $("#may").click(function () {
    alertChoose.style.display = "none";
    showNguoi.style.display = "block";
    showMay.style.display = "none";
    showMenu.style.display = "block";
  });

  $("#reload").click(function () {
    if (confirm("Bạn có chắc là mình muốn chọn lại chế độ ?")) {
      location.reload();
    }
  });
});
