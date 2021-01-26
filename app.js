const colorSquare = document.querySelector(".color-square");
const colorBg = document.querySelector("body");
const sliders = document.querySelector('input[type="range"]');
const currentHex = document.querySelector(".name");
let initialColor;

//Functions

function generateHex() {
  const hexColor = chroma.random();

  return hexColor;
}

function randomColor() {
  const randomColor = generateHex();

  //Add the color to the bg
  colorBg.style.backgroundColor = randomColor;
  currentHex.innerText = randomColor;
  colorSquare.style.backgroundColor = randomColor;
}

randomColor();
