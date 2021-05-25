const express = require("express");
const app = express();
const {
  conn,
  syncAndSeed,
  models: { Hero, Villain },
} = require("./db");

app.get("/heroes", async (req, res) => {
  res.send(
    await Hero.findAll({
      include: [
        Villain,
        {
          model: Hero,
          as: "mentor",
        },
      ],
    })
  );
});

app.get("/villains", async (req, res) => {
  res.send(
    await Villain.findAll({
      include: [
        {
          model: Hero,
          as: "rival",
        },
      ],
    })
  );
});

const doIt = async () => {
  await syncAndSeed();
  const port = 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
};

doIt();
