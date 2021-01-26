const colorSquare = document.querySelector(".color-square");
const colorBg = document.querySelector("body");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHex = document.querySelector(".name");
const popup = document.querySelector(".copy-container");
const adjust = document.querySelector(".adjust-container");
const closeAdjust = document.querySelector(".close-adjust");
const libraryBtn = document.querySelector(".lib-btn");
const library = document.querySelector(".library-container");
const closeLibraryBtn = document.querySelector(".close-library");

let initialColor;

//Event Listeners
sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});

sliders.forEach((slider) => {
  slider.addEventListener("change", updateTextUI);
});

currentHex.addEventListener("click", copyToClipboard);
popup.addEventListener("transitionend", () => {
  const popupBox = popup.children[0];
  popup.classList.remove("active");
  popupBox.classList.remove("active");
});

colorSquare.addEventListener("click", showAdjustments);

closeAdjust.addEventListener("click", () => {
  const adjustBox = adjust.children[0];
  adjust.classList.remove("active");
  adjustBox.classList.remove("active");
});

libraryBtn.addEventListener("click", () => {
  const libraryBox = library.children[0];
  library.classList.add("active");
  libraryBox.classList.add("active");
});

closeLibraryBtn.addEventListener("click", () => {
  library.classList.remove("active");
  libraryBox.classList.remove("active");
});

//Functions

function generateHex() {
  const hexColor = chroma.random();

  return hexColor;
}

function randomColor() {
  initialColor = "";

  const randomColor = generateHex();
  const dropperIco = colorSquare.children[0];
  const colorBox = document.querySelector(".color-box");
  const colorName = document.querySelector(".color-name span");

  initialColor = chroma(randomColor).hex();
  //Add the color to the bg
  colorBg.style.backgroundColor = randomColor;
  currentHex.innerText = randomColor;
  colorSquare.style.backgroundColor = randomColor;
  colorName.innerText = randomColor;
  colorBox.style.backgroundColor = randomColor;
  //Check text contrast
  checkTextContrast(randomColor, dropperIco);
  //Initial Colorize Sliders
  const color = chroma(randomColor);
  const sliders = document.querySelectorAll(".slider-box input");
  const hue = sliders[0];
  const brightness = sliders[1];
  const saturation = sliders[2];

  colorizeSliders(color, hue, brightness, saturation);
  //Reset Inputs
  resetInputs();
}

function checkTextContrast(color, text) {
  const luminance = chroma(color).luminance();

  if (luminance > 0.3) {
    text.style.color = "black";
  } else {
    text.style.color = "white";
  }
}

function colorizeSliders(color, hue, brightness, saturation) {
  //Scale Saturation
  const noSat = color.set("hsl.s", 0);
  const fullSat = color.set("hsl.s", 1);
  const scaleSat = chroma.scale([noSat, color, fullSat]);
  //Scale Brightness
  const midBright = color.set("hsl.l", 0.5);
  const scaleBright = chroma.scale(["black", midBright, "white"]);

  //Update Input Colors
  saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(
    0
  )}, ${scaleSat(1)}`;
  brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(
    0
  )}, ${scaleBright(0.5)}, ${scaleBright(1)})`;
  hue.style.backgroundImage = `linear-gradient(to right, rgba(204,75,75), rgb(204,204,75), rgb(75,204,75), rgb(75,204,204), rgb(75,75,204), rgb(204,75,204), rgb(204,75,75))`;
}

function hslControls(e) {
  let sliders = document.querySelectorAll('input[type="range"]');
  const hue = sliders[0];
  const brightness = sliders[1];
  const saturation = sliders[2];

  const bgColor = initialColor;
  const colorBox = document.querySelector(".color-box");
  const colorName = document.querySelector(".color-name span");

  let color = chroma(bgColor)
    .set("hsl.s", saturation.value)
    .set("hsl.l", brightness.value)
    .set("hsl.h", hue.value);

  colorBg.style.backgroundColor = color;
  colorSquare.style.backgroundColor = color;
  colorBox.style.backgroundColor = color;

  //Colorize Inputs
  colorizeSliders(color, hue, brightness, saturation);
}

function updateTextUI() {
  const color = chroma(colorSquare.style.backgroundColor);
  const textHex = currentHex;
  const icon = colorSquare.children[0];
  textHex.innerText = color.hex();
  //Check contrast
  checkTextContrast(color, icon);
}

function resetInputs() {
  const sliders = document.querySelectorAll(".slider-box input");
  sliders.forEach((slider) => {
    if (slider.name === "hue") {
      const hueValue = chroma(initialColor).hsl()[0];
      slider.value = Math.floor(hueValue);
    }
    if (slider.name === "brightness") {
      const brightValue = chroma(initialColor).hsl()[2];
      slider.value = Math.floor(brightValue * 100) / 100;
    }
    if (slider.name === "saturation") {
      const satValue = chroma(initialColor).hsl()[1];
      slider.value = Math.floor(satValue * 100) / 100;
    }
  });
}

function copyToClipboard() {
  const el = document.createElement("textarea");
  el.value = currentHex.innerText;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  //Popup animation
  const popupBox = popup.children[0];
  popupBox.classList.add("active");
  popup.classList.add("active");
}

function showAdjustments() {
  adjustBox = adjust.children[0];
  adjust.classList.add("active");
  adjustBox.classList.add("active");
}

function openLibrary() {}

randomColor();
