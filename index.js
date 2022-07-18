let allCharacters = [];
let data = [];
let characterToUse;

let totalSeen = 0;
let correct = 0;

window.onload = (ev) => {
  const start = document.getElementById("start");
  const stats = document.getElementById("stats");

  stats.onclick = (e) => {
    e.preventDefault();
    const averagesElement = document.getElementById("averages");
    const classes = averagesElement.classList;
    if (classes.contains("hidden")) averagesElement.classList.remove("hidden");
    else averagesElement.classList.add("hidden");
  }

  start.onclick = (e) => {
    e.preventDefault();
    const averagesEl = document.getElementById("averages");
    let hir = document.getElementById("hiragana").checked;
    let kat = document.getElementById("katakana").checked;

    if (!hir && !kat) hir = true;

    document.getElementById("main").style.display = "none";
    document.getElementById("secondary").style.display = "flex";

    document.getElementsByClassName("input")[0].focus();

    const character = document.getElementById("character");
    if (hir) allCharacters = allCharacters.concat(hiragana);
    if (kat) allCharacters = allCharacters.concat(katakana);

    characterToUse = randomCharacter(allCharacters);

    character.innerText = characterToUse.char;
    let start = Date.now();

    const sub = document.getElementsByClassName("submit")[0];
    const inputBeforeClick = document.getElementsByClassName("input")[0];
    inputBeforeClick.value = "";

    sub.onclick = (ev) => {
      averagesEl.classList.add("hidden");
      const inputOnClick = document.getElementsByClassName("input")[0];
      console.log(inputOnClick);
      totalSeen++;
      let end = Date.now();
      ev.preventDefault();

      const answer = inputOnClick.value.toLowerCase().trim();
      const correctAnswers = characterToUse.sound.split(", ");
      const c = correctAnswers.includes(answer);
      if (c) correct++;
      if (!c) {
        inputOnClick.style.borderColor = "red";
        setTimeout(() => inputOnClick.style.borderColor = "transparent", 500);
        
      }
      
      data.push({
        char: characterToUse.char,
        sound: characterToUse.sound,
        correct: c ? 1 : 0,
        seen: 1,
        time: end - start,
      });

      inputOnClick.value = "";
      document.getElementById("counter").innerText = `${correct}/${totalSeen} Correct`;
      characterToUse = randomCharacter(allCharacters);
      character.innerText = characterToUse.char;

      const averages = calcAverages(data);
      averagesEl.innerHTML = "";

      for (const val of averages) {
        const characterAverage = document.createElement("div");
        characterAverage.className = `${val.sound} average`;

        const kanaCharacter = document.createElement("h1");
        kanaCharacter.className = `${val.sound} character`;
        kanaCharacter.innerText = val.char;

        const sound = document.createElement("h2");
        sound.className = `${val.sound} sound`;
        sound.innerText = val.sound;

        const correctVals = document.createElement("h3");
        correctVals.className = `${val.sound} correct`;
        correctVals.innerText = `${val.correct}/${val.seen} ~ ${(val.correct / val.seen * 100).toPrecision(3)}%`;

        const averageTime = document.createElement("h3");
        averageTime.className = `${val.sound} time`;
        averageTime.innerText = `Average Time: ${val.time / 1000} seconds`;

        characterAverage.appendChild(kanaCharacter);
        characterAverage.appendChild(sound);
        characterAverage.appendChild(correctVals);
        characterAverage.appendChild(averageTime);
        
        averagesEl.appendChild(characterAverage);

      }
      start = Date.now();
    }
  }
}

function calcAverages(data) {
  let returnMe = [];

  for (const v of data) {
    const found = returnMe.find(val => val.sound === v.sound);
    const index = returnMe.findIndex(val => val.sound === v.sound);
    if (found) {
      const allOcc = data.filter(val => val.sound === v.sound);
      const totalTime = allOcc.reduce((pv, cv) => pv + cv.time, 0);
      const totalCorrect = allOcc.reduce((pv, cv) => pv + cv.correct, 0);
      const totalSeen = allOcc.length;
      console.log(totalSeen);
      const averageTime = totalTime / allOcc.length;
      returnMe.splice(index, 1, { char: v.char, sound: v.sound, correct: totalCorrect, time: averageTime, seen: totalSeen });
    } else returnMe.push(v);
  }
  return returnMe;
}
function randomCharacter(all) {
  return all[Math.floor(Math.random() * all.length)];
}