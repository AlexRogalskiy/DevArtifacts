
window.onload = function() {
  if (document.getElementById("solution_string")) {
    fill_board_with_solution();
  }
  $(".cell").each(function() {
    $input_field = $(this).children()[0];
    $input_field.onfocus = function() {
      this.select();
    };
    $input_field.onkeyup = advanceCell;
  });
};

function advanceCell() {
  $cell = this;
  console.log($cell.value);
  if (/(\d|\s)/.test($cell.value)) {
    var next_cell = parseInt(this.parentNode.id) + 1;
    if (next_cell <= 81) {
      $("#" + next_cell).children()[0].select();
    }
  } else {
    $cell.value = "";
  }
}

function go() {
  var string = make_string();
  window.location.href = "/" + string;
  setTimeout(function() {
    if (!(document.getElementById("solution_string"))) {
      location.reload(true);
    }
  }, 6000);
}

function make_string() {
  user_string = "";
  for (i = 1; i <= 81; i++) {
    cell_value = $('#' + i + ' input').val();
    if (cell_value === "")
      cell_value = "0";
    user_string += cell_value;
  }
  console.log(user_string);
  return user_string;
}

function fill_board_with_solution() {
  for (i = 1; i <= 81; i++) {
    var cell = $('#' + i + ' input');
    $setCell = cell;
    value = $("#solution_string").text().charAt(i - 1);
    $setCell.val(value);
    cell.value = value;
  }
}
