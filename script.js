const n = 10;
const array = [];

init();

let audioCtx = null;

function playNote(freq) {
  if (audioCtx == null) {
    audioCtx = new (AudioContext ||
      webkitAudioContext ||
      window.webkitAudioContext)();
  }
  const dur = 0.1;
  const osc = audioCtx.createOscillator();
  osc.frequency.value = freq;
  osc.start();
  osc.stop(audioCtx.currentTime + dur);
  const node = audioCtx.createGain();
  node.gain.value = 0.1;
  node.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur);
  osc.connect(node);
  node.connect(audioCtx.destination);
}

function init() {
  //Randomly creating an array from 1 through 10
  for (let i = 0; i < n; i++) {
    array[i] = Math.random();
  }
  showBars();
}

//IMPLEMENTING THE SORTING ALGORITHM: BUBBLE SORT
function bubbleSort(array) {
  const moves = [];
  do {
    var swapped = false;
    for (let i = 1; i < array.length; i++) {
      moves.push({
        indices: [i - 1, i],
        type: "comparison",
      });
      if (array[i - 1] > array[i]) {
        //let temp = array[i];
        //   array[i] = array[i + 1];
        //   array[i + 1] = temp;
        //   swapped = true;
        swapped = true;
        moves.push({
          indices: [i - 1, i],
          type: "swap",
        });
        [array[i - 1], array[i]] = [array[i], array[i - 1]]; //Destructuring Assignment
      }
    }
  } while (swapped);
  return moves;
}

function play() {
  const copy = [...array]; //this step is done to avoid a problem. If we click on the play button the sorted array will be shown already due to which the animation will not appear therefore we need to make a copy of the array using the spread operator where we will sort and animate the copy of the actual array rather than the original array
  const moves = bubbleSort(copy); //access the moves
  animate(moves);
  //showBars();
}

function animate(moves) {
  if (moves.length == 0) {
    showBars();
    //no animation if there are no moves
    return;
  }
  const move = moves.shift(); //the shift method will remove the first element and return it. i-1 and i will now be referred to as i and j
  const [i, j] = move.indices;
  if (move.type == "swap") {
    [array[i], array[j]] = [array[j], array[i]];
  }

  playNote(200 + array[i] * 500); //Interpolation
  playNote(200 + array[j] * 500);
  showBars(move);
  setTimeout(function () {
    animate(moves);
  }, 50);
}

function showBars(move) {
  container.innerHTML = ""; //empty the array so that every time we press the button it does not repeat the pattern
  //For creating individual bars for the array
  for (let i = 0; i < array.length; i++) {
    const bar = document.createElement("div");
    bar.style.height = array[i] * 100 + "%";
    bar.classList.add("bar");

    if (move && move.indices.includes(i)) {
      bar.style.backgroundColor = move.type == "swap" ? "red" : "blue";
    }
    container.appendChild(bar);
  }
}
