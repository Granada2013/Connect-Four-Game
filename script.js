var playerOne;
var playerTwo;
var isTurn = 1; // номер игрока, имеющего активный статус в начале игрыы
var boardArray =[[0,0,0,0,0,0,0],
                 [0,0,0,0,0,0,0],
                 [0,0,0,0,0,0,0],
                 [0,0,0,0,0,0,0],
                 [0,0,0,0,0,0,0],
                 [0,0,0,0,0,0,0]]

$("#start-button").on("click", reloadGame);
$("#start-button").on("click", clearBoardArray);
$("#start-button").on("click", promptNames);
$("#start-button").on("click", showGreeting);
$("#start-button").on("click", fillBar);
$("#start-button").on("click", showActivePlayer);
$("#start-button").on("click", function() {$(this).val("Play again")});


//Перезагружает поле перед новой игрой
function reloadGame(){
  $(".circle").removeClass("paint-red");
  $(".circle").removeClass("paint-blue");
  $("#lc1").removeClass("is-active-circle-lc1");
  $("#lc2").removeClass("is-active-circle-lc2");
  $(".player-name").removeClass("is-active-name");
  isTurn = 1;
}

//Обнуляет массив BoardArray перед новой игрой
function clearBoardArray(){
  for (let row of boardArray) {
    for (let i = 0; i < row.length; i++) {
      row[i] = 0;
    }
  }
}

//Просит ввести имена игроков
function promptNames(){
  playerOne = prompt("Name of Player One:");
  playerTwo = prompt("Name of Player Two:");
}

//Выводит сообщение о первом ходе
function showGreeting() {
  (playerOne && playerTwo) ? alert(`${playerOne} starts with red chips`):
                             alert("You should name the players. Try again.")
}

//Выводит имена игроков на экране
function fillBar(){
  if(playerOne && playerTwo){
    $("#player-one").text(playerOne);
    $("#player-two").text(playerTwo);
  }
}

//Включает индикатор активного игрока на экране
function showActivePlayer() {
  if(playerOne && playerTwo){
    $("#player-one").addClass("is-active-name");
    $("#lc1").addClass("is-active-circle-lc1");
  }
}


$(".circle").on("click", makeTurn);
$(".circle").on("click", checkWinner);
$(".circle").on("click", showWinAlert);
$(".circle").on("click", showDrawAlert);
$(".circle").on("click", switchTurn);
$(".circle").on("click", switchIndicators);

//Реализация одного хода
function makeTurn(event){
  if (!playerOne || !playerTwo) {
    alert(`Click "Let's play" to start`);
    return;
  }

  if(checkWinner()) return;

  let currentCircle = returnCurrCicle();
  let row = +$(currentCircle).parent().parent().attr("class")[3]; //Последняя цифра класса <tr>
  let column = +$(currentCircle).attr("class")[10]; //Последняя цифра класса <div>

  makeBoardArray();
  switchColor();

  // Возвращает фишку, которая будет закрашена на текущем ходе
  //(нижняя незакрашенная фишка в столбце, на который указал игрок)
  function returnCurrCicle() {
    let column = [];
    for (let cell of $(".circle")) {
      if ($(cell).attr("class") !== event.currentTarget.getAttribute("class")) continue;
      column.push(cell);
    }
    for (let i = column.length-1; i >= 0; i--){
      if ($(column[i]).css("background-color") === "rgb(219, 216, 206)"){
        return column[i]};
    }
  }

  //Закрашивает выбранную фишку в цвет активного игрока
  function switchColor(){
    (isTurn === 1) ? $(currentCircle).toggleClass("paint-red"):
                     $(currentCircle).toggleClass("paint-blue");
  }

  //Формирует массив boardArray по итогам каждого хода
  //("R" - красная фишка; "B" - синяя фишка)
  function makeBoardArray(){
    boardArray[row][column] = (isTurn === 1) ?  "R":"B"
  }
}

//Проверяет наличие победителя по итогам хода
function checkWinner() {
  return (checkHorizontal() || checkVertical() ||
          checkUpDiagonal() || checkDownDiagonal())

  //Проверяет наличие вертикального ряда из 4 и более фишек
  function checkVertical(){
    for (var j = 0; j < 7; j++) {
      let line = "";
      for (var i = 0; i < 6; i++) {
        line += boardArray[i][j];
      }
      if (line.indexOf("RRRR") !== -1  || line.indexOf("BBBB") !== -1) {
        return true};
    }
    return false
  }

  //Проверяет наличие горизонтального ряда из 4 и более фишек
  function checkHorizontal(){
    for(let row of boardArray){
      let line = "";
      for(j = 0; j < 7; j++) {
         line += row[j];}
      if (line.indexOf("RRRR") !== -1 || line.indexOf("BBBB") !== -1) {
        return true};
    }
    return false
  }

  //Проверяет наличие ряда из 4 и более фишек на восходящей диагонали
    function checkUpDiagonal() {
      for (let s = 3; s < 9; s++){
        let line = "";
        for (let i = 0; i < 6; i++){
          for (let j = 0; j < 7; j++) {
            if (i + j === s){
               line += boardArray[i][j];
            }
          }
        }
        if (line.indexOf("RRRR") !== -1 || line.indexOf("BBBB") !== -1){
          return true;
        }
      }
      return false;
    }

  //Проверяет наличие ряда из 4 и более фишек на нисходящей диагонали
  function checkDownDiagonal() {
    for (let d = -3; d < 3; d++){
      let line = "";
      for (let i = 0; i < 6; i++){
        for (let j = 0; j < 7; j++){
          if (i - j === d){
            line += boardArray[i][j]
          }
        }
      }
      if (line.indexOf("RRRR") !== -1 || line.indexOf("BBBB") !== -1){
        return true;
      }
    }
    return false;
  }

}

//Вызывает сообщение о победе
function showWinAlert() {
  if (checkWinner()) {
   alert(`FOUR IN A ROW!\n${(isTurn===1)? playerOne:playerTwo} is a winner!`);
 }
}

//Вызывает сообщение о ничьей
function showDrawAlert(){
  for (let cell of $(".circle")){
    if ($(cell).css("background-color") === "rgb(219, 216, 206)") return;
  }
  if (!checkWinner()) return alert("It's a draw!");
}

// Передает ход от одного игрока другому
function switchTurn(){
  if(checkWinner()) return;
  isTurn = (isTurn === 1) ? 2:1;
}

//Переключает индикатор активного игрока на экране
function switchIndicators(){
  if(checkWinner()) return;
  if(playerOne && playerTwo){
    $(".player-name").toggleClass("is-active-name");
    $("#lc1").toggleClass("is-active-circle-lc1");
    $("#lc2").toggleClass("is-active-circle-lc2");
  }
}
