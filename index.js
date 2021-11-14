const app = require("express")();
const fetch = require("node-fetch");
const PORT = 8080;
var re = /[0-9A-Fa-f]{6}/g;

/*
  Functions
*/ 

function genRandom() {
  return ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
}

function hexToRgbRaw(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function hexToRgb(hex) {
  var bigint = parseInt(hex, 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;

  return `${r}, ${g}, ${b}`;
}

/*
  Start Website
*/

app.listen(PORT, () => console.log(`API Online (http://localhost:${PORT})`));

/* 
  Main Page
*/

app.get("/", (req, res) => {
  res.status(200).send({
    status: "ONLINE",
  });
});

/*
  Generate random hex code
*/

app.get("/random", (req, res) => {
  let random = genRandom();
  res.status(200).send({
    hex: {
      color: `#${random}`,
      raw: random,
    },
    rgb: {
      value: `rgb(${hexToRgb(random)})`,
      r: hexToRgbRaw(`#${random}`).r,
      g: hexToRgbRaw(`#${random}`).g,
      b: hexToRgbRaw(`#${random}`).b,
    },
  });
});

/*
  Specfic page for hex codes
*/

app.get("/:id", (req, res) => {
  let code = req.url.substring(1);
  if (re.test(code)) {
    res.status(200).send({
      hex: {
        color: `#${code}`,
        raw: code,
      },
      rgb: {
        value: `rgb(${hexToRgb(code)})`,
        r: hexToRgbRaw(`#${code}`).r,
        g: hexToRgbRaw(`#${code}`).g,
        b: hexToRgbRaw(`#${code}`).b,
      },
    });
  } else {
    res.status(200).send({
      message: "Invalid hex code.",
    });
  }
});

/*
 Check Status (Likely to be used for something else in the future)
*/

setInterval(() => {
  fetch("http://localhost:8080", { mode: "GET" })
    .then((r) => {
      console.log("API Online");
    })
    .catch((e) => {
      console.log("API Not Online");
    });
}, 25000); // 25 seconds
