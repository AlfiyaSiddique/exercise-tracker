$(document).ready(function () {
  // Navbar Color
  $(window).scroll(() => {
    console.log("yes");
    if ($(this).scrollTop() > 450) {
      $("#mainBar").addClass("scrolled");
    } else {
      $("#mainBar").removeClass("scrolled");
    }
  });

  // Links active style - Fail
  const links = [...$("nav ul li a")];

  links.forEach((link) => {
    $(link).click(() => onClickLink(link));
  });

  function onClickLink(link) {
    for (let index = 0; index < links.length; index++) {
      $(links[index]).removeClass("linkActive");
    }
    $(link).addClass("linkActive");
  }

  // Humburger Menu Functionality
  const menu = $("#burger");
  const ul = $("nav ul");
  const cross = $("#cross");

  menu.click(() => {
    ul.addClass("burgerStyle");
    ul.css("display", "flex");
    cross.removeClass("display");
  });

  cross.click(() => {
    ul.removeClass("burgerStyle");
    ul.css("display", "none");
    cross.addClass("display");
  });

  // Add Exercise prompt
  $("#addexer").click(() => {
    $("#addform").removeClass("hidden");
  });
});

function closeAddExercise() {
  $("#addform").addClass("hidden");
}

//Delete Excercise
function deleteExercise(data) {
  data = JSON.parse(data);
  const finaldata = { ...data, _id: data._id };
  fetch("/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(finaldata),
  }).then(()=>{
    location.reload();
  });
}
