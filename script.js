const textLines = [
  "¡Hola!, ¿que tal?\n\n",
  "Soy Rafael García Ávila \n\n",
  "y, como puede apreciarse, Desarrollador Web,  \n\n",
  "¡BIENVENID@!"
];

const typedTextEl = document.getElementById("typed-text");
const confettiCanvas = document.getElementById("confetti-canvas");
const profileImg = document.getElementById("profile-img");

profileImg.style.display = 'none';

// Variables para la máquina de escribir con errores
const typingSpeed = 80;
const errorChance = 0.05; // 5% de posibilidad de error en cada caracter
const errorBackspaceDelay = 400;
const betweenLinesDelay = 800;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeLine(line) {
  for (let i = 0; i < line.length; i++) {
    // Decide si cometer error
    if (Math.random() < errorChance && line[i] !== '\n' && line[i] !== ' ') {
      // Teclea un caracter errado
      const wrongChar = randomCharDifferentFrom(line[i]);
      typedTextEl.textContent += wrongChar;
      await sleep(typingSpeed);
      // Borra el error
      typedTextEl.textContent = typedTextEl.textContent.slice(0, -1);
      await sleep(errorBackspaceDelay);
      // Ahora escribe el caracter correcto
      typedTextEl.textContent += line[i];
      await sleep(typingSpeed);
    } else {
      typedTextEl.textContent += line[i];
      await sleep(typingSpeed);
    }
  }
}

function randomCharDifferentFrom(char) {
  const letters = "abcdefghijklmnopqrstuvwxyzáéíóúüñ,.!¡¿? ";
  let c;
  do {
    c = letters.charAt(Math.floor(Math.random() * letters.length));
  } while (c === char);
  return c;
}

async function typeWriter() {
  typedTextEl.textContent = "";
  for (const line of textLines) {
    await typeLine(line);
    await sleep(betweenLinesDelay);
  }
}

let confettiParticles = [];
const colors = ['#f94144', '#f3722c', '#f9844a', '#f9c74f', '#90be6d', '#43aa8b', '#577590'];

class ConfettiParticle {
  constructor(canvasWidth, canvasHeight) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * -canvasHeight;
    this.size = Math.random() * 8 + 4;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.speedY = Math.random() * 3 + 2;
    this.speedX = (Math.random() - 0.5) * 2;
    this.tilt = Math.random() * 10;
    this.tiltSpeed = Math.random() * 0.1 + 0.05;
  }
  update(canvasWidth, canvasHeight) {
    this.y += this.speedY;
    this.x += this.speedX;
    this.tilt += this.tiltSpeed;

    if (this.y > canvasHeight) {
      this.x = Math.random() * canvasWidth;
      this.y = -10;
      this.speedY = Math.random() * 3 + 2;
      this.speedX = (Math.random() - 0.5) * 2;
      this.size = Math.random() * 8 + 4;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.tilt = Math.random() * 10;
      this.tiltSpeed = Math.random() * 0.1 + 0.05;
    }
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.lineWidth = this.size / 2;
    ctx.strokeStyle = this.color;
    ctx.moveTo(this.x + this.tilt, this.y);
    ctx.lineTo(this.x + this.tilt + this.size / 2, this.y + this.tilt + this.size / 2);
    ctx.stroke();
  }
}

function initConfetti() {
  confettiParticles = [];
  const count = 150;
  for (let i = 0; i < count; i++) {
    confettiParticles.push(new ConfettiParticle(confettiCanvas.width, confettiCanvas.height));
  }
}

function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}

function animateConfetti() {
  const ctx = confettiCanvas.getContext('2d');
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  for (const p of confettiParticles) {
    p.update(confettiCanvas.width, confettiCanvas.height);
    p.draw(ctx);
  }

  requestAnimationFrame(animateConfetti);
}

function startConfetti() {
  confettiCanvas.style.display = 'block';
  resizeCanvas();
  initConfetti();
  animateConfetti();
}

window.addEventListener('resize', () => {
  resizeCanvas();
});

async function startSequence() {
  await typeWriter();
  startConfetti();
  profileImg.style.display = 'block';
  confettiCanvas.style.display = 'block';
  // No ocultamos nada ni limitamos scroll
}

startSequence();

// Opcional: manejo formulario contacto (solo ejemplo para evitar recarga)
document.getElementById('contact-form').addEventListener('submit', function(e){
  e.preventDefault();
  alert('Mensaje enviado. ¡Gracias!');
  this.reset();
});
