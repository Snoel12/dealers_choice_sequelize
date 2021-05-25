const Sequelize = require("sequelize");
const { STRING, UUID, UUIDV4, DATE, INTEGER } = Sequelize;
const conn = new Sequelize("postgres://localhost/heroesnvillains");

const heroes = [
  "Superman",
  "Batman",
  "Wonderwoman",
  "Superboy",
  "Robin",
  "Wondergirl",
];
const villains = ["Luthor", "Joker", "Cheetah", "Knockout", "Hawke", "Medusa"];

const Hero = conn.define("hero", {
  name: { type: STRING, allowNull: false, unique: true },
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
});

const Villain = conn.define("villain", {
  name: { type: STRING, allowNull: false, unique: true },
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
});

Hero.hasMany(Villain, { foreignKey: "rivalId" });
Villain.belongsTo(Hero, { as: "rival" });

Hero.hasMany(Hero, { foreignKey: "mentorId" });
Hero.belongsTo(Hero, { as: "mentor" });

const syncAndSeed = async () => {
  await conn.sync({ force: true });
  const [Superman, Batman, Wonderwoman, Superboy, Robin, Wondergirl] =
    await Promise.all(heroes.map((name) => Hero.create({ name })));

  const [Luthor, Joker, Cheetah, Knockout, Hawke, Medusa] = await Promise.all(
    villains.map((name) => Villain.create({ name }))
  );
  Superboy.mentorId = Superman.id;
  Robin.mentorId = Batman.id;
  Wondergirl.mentorId = Wonderwoman.id;

  Luthor.rivalId = Superman.id;
  Joker.rivalId = Batman.id;
  Cheetah.rivalId = Wonderwoman.id;
  Knockout.rivalId = Superboy.id;
  Hawke.rivalId = Robin.id;
  Medusa.rivalId = Wondergirl.id;

  await Promise.all([
    Superboy.save(),
    Robin.save(),
    Wondergirl.save(),
    Luthor.save(),
    Joker.save(),
    Cheetah.save(),
    Knockout.save(),
    Hawke.save(),
    Medusa.save(),
    ,
  ]);
};

module.exports = {
  syncAndSeed,
  models: {
    Hero,
    Villain,
  },
};
