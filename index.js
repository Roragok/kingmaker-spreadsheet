const express = require('express')
const path = require('path')
const dotenv = require('dotenv');

const { GoogleSpreadsheet } = require('google-spreadsheet');
dotenv.config();


const doc = new GoogleSpreadsheet('1xU894EjVHLWTeZOEXXiDkdyCiM8-tY6S_3EP6YNaSpo');

async function getInfo() {

  await doc.useApiKey(process.env.API_KEY);
  await doc.loadInfo();
  let sheet = await doc.sheetsByIndex[0];
  await sheet.loadCells('B1:H23')

  let controlDC = sheet.getCellByA1("H13").value;
  let kingdomStability = sheet.getCellByA1("B4").value;
  let kingdomEconomy = sheet.getCellByA1("B5").value;
  let kingdomLoyalty = sheet.getCellByA1("B6").value;

  let data ={
    alignment: sheet.getCellByA1("D1").value + sheet.getCellByA1("E1").value,
    size: sheet.getCellByA1("H14").value,
    control_dc: controlDC,
    population: sheet.getCellByA1("B1").value,
    stability: {
      value: kingdomStability,
      class: kingdomHealthCheck(kingdomStability,controlDC),
    },
    economy: {
      value: kingdomEconomy,
      class: kingdomHealthCheck(kingdomEconomy,controlDC),
    },
    loyalty: {
      value: kingdomLoyalty,
      class: kingdomHealthCheck(kingdomLoyalty,controlDC),
    },
    unrest: sheet.getCellByA1("H18").value,
    consumption: sheet.getCellByA1("H19").value,
    roads: sheet.getCellByA1("H17").value,
    farms: sheet.getCellByA1("H16").value,
    build_points: sheet.getCellByA1("H20").value,
  };


  return data;
}

async function getLeadership() {

  await doc.useApiKey(process.env.API_KEY);
  await doc.loadInfo();
  let sheet = await doc.sheetsByIndex[0];
  await sheet.loadCells('A13:D23')

  let leadership = {
    ruler: {
      title: "Duke",
      name: sheet.getCellByA1("B13").value,
      mod: sheet.getCellByA1("C13").value,
      stat: sheet.getCellByA1("D13").value,
      img: "/images/leaders/deimos.png",
      description: "The ruler is the primary leader of the kingdom.",
      benefit: "A baron or baroness chooses one of a nation’s statistics (Economy, Loyalty, or Stability) and modifies that score by a value equal to the character’s Charisma modifier. A duke or duchess chooses two of these values to modify. A king or queen modifies all three values.",
      penalty: "A kingdom without a ruler cannot claim new hexes, create Farms, build Roads, or purchase settlement districts. Unrest increases by 4 during the kingdom’s Upkeep Phase.",

    },
    councilor:{
      title: "Councilor",
      name: sheet.getCellByA1("B14").value,
      mod: sheet.getCellByA1("C14").value,
      stat: sheet.getCellByA1("D14").value,
      img: "/images/leaders/ameila.png",
      description: "The councilor ensures that the will of the citizenry is represented.",
      benefit: "Increase Loyalty by a value equal to the Councilor’s Wisdom or Charisma modifier",
      penalty: "Decrease Loyalty by 2; the kingdom cannotgain benefits from festivals. Increase Unrest by 1 during each Upkeep phase in which the kingdom has no Councilor."

    },
    general:{
      title: "General",
      name: sheet.getCellByA1("B15").value,
      mod: sheet.getCellByA1("C15").value,
      stat: sheet.getCellByA1("D15").value,
      img: "/images/leaders/bebrudd.png",
      description: "The General commands the kingdom’s armies and is a public hero.",
      benefit: "Increase Stability by a value equal to the General’s Strength or Charisma modifier.",
      penalty: "Stability decreases by 4."

    },
    grandDiplomat:{
      title: "Grand Diplomat",
      name: sheet.getCellByA1("B16").value,
      mod: sheet.getCellByA1("C16").value,
      stat: sheet.getCellByA1("D16").value,
      img: "/images/leaders/Ja_Rule.png",
      description: "The Grand Diplomat oversees international relations.",
      benefit: "Increase Stability by a value equal to the Grand Diplomat’s Intelligence or Charisma modifier",
      penalty: "Decrease Stability by 2; the kingdom cannot issue Promotion Edicts."

    },
    highPriest:{
      title: "High Priest",
      name: sheet.getCellByA1("B17").value,
      mod: sheet.getCellByA1("C17").value,
      stat: sheet.getCellByA1("D17").value,
      img: "/images/leaders/jhod.png",
      description: "The high priest guides the kingdom’s religious needs and growth.",
      benefit: "Increase Stability by a value equal to the High Priest’s Wisdom or Charisma modifier.",
      penalty: "Stability and Loyalty decrease by 2. During the Upkeep Phase, Unrest increases by 1."

    },
    magister:{
      title: "Magister",
      name: sheet.getCellByA1("B18").value,
      mod: sheet.getCellByA1("C18").value,
      stat: sheet.getCellByA1("D18").value,
      img: "/images/leaders/nelson.png",
      description: "The Magister guides a kingdom’s higher learning and magic.",
      benefit: "Increase Economy by a value equal to the Magister’s Intelligence or Charisma modifier.",
      penalty: "Economy decreases by 4."

    },
    marshal:{
      title: "Marshal",
      name: sheet.getCellByA1("B19").value,
      mod: sheet.getCellByA1("C19").value,
      stat: sheet.getCellByA1("D19").value,
      img: "/images/leaders/wallace.png",
      description: "The Marshal helps organize patrols and enforces justice in rural and wilderness regions",
      benefit: "Increase Economy by a value equal to the Marshal’s Dexterity or Wisdom modifier.",
      penalty: "Economy decreases by 4."

    },
    royalAssassin:{
      title: "Royal Assassin",
      name: sheet.getCellByA1("B20").value,
      mod: sheet.getCellByA1("C20").value,
      stat: sheet.getCellByA1("D20").value,
      img: "/images/leaders/Gir_Mock.jpeg",
      description: "The Royal Assassin can serve as a public executioner, a headsman, or a shadowy assassin.",
      benefit: "Increase Loyalty by a value equal to the Royal Assassin’s Strength or Dexterity modifier. Fear inspired by the Royal Assassin reduces Unrest by 1 during each Upkeep phase.",
      penalty: "None."

    },
    spymaster:{
      title: "Spymaster",
      name: sheet.getCellByA1("B21").value,
      mod: sheet.getCellByA1("C21").value,
      stat: sheet.getCellByA1("D21").value,
      img: "/images/leaders/lander.png",
      description: "The Spymaster observes the kingdom’s underworld and criminal elements and spies on other kingdoms.",
      benefit: "Increase Loyalty, Economy, or Stability (Spymaster’s choice) by a value equal to the Spymaster’s Dexterity or Intelligence modifier. The Spymaster can change which value he modifies during the kingdom’s Improvement phase (but only once per phase)",
      penalty: "Reduce Economy by 4 because of out-of-control crime. Increase Unrest by 1 during each Upkeep phase in which the kingdom has no Spymaster."

    },
    treasurer:{
      title: "Treasurer",
      name: sheet.getCellByA1("B22").value,
      mod: sheet.getCellByA1("C22").value,
      stat: sheet.getCellByA1("D22").value,
      img: "/images/leaders/roy_jones.png",
      description: "The Treasurer organizes tax collection, and manages the treasury.",
      benefit: "Increase Economy by a value equal to the Treasurer’s Intelligence or Wisdom modifier.",
      penalty: "Reduce Economy by 4; the kingdom cannot collect taxes."

    },
    warden:{
      title: "Warden",
      name: sheet.getCellByA1("B23").value,
      mod: sheet.getCellByA1("C23").value,
      stat: sheet.getCellByA1("D23").value,
      img: "/images/leaders/kresten.png",
      description: "The Warden leads the kingdom’s defense and city guards.",
      benefit: "Increase Loyalty by a value equal to the Warden’s Strength or Constitution modifier",
      penalty: "Reduce Loyalty by 4 and Stability by 2.",

    },
  }
  return leadership;
}

async function getCity(index) {

  await doc.useApiKey(process.env.API_KEY);
  await doc.loadInfo();
  let sheet = await doc.sheetsByIndex[index];
  await sheet.loadCells('A2:H30')

  let buildings = [];

  for(let x = 8; x < 30; x++){
    let building = sheet.getCellByA1("A"+x).value;

    if(building){
      let improvment = {
        name: building,
        cost: sheet.getCellByA1("B"+x).value,
        stat: sheet.getCellByA1("D"+x).value,
        bonus: sheet.getCellByA1("E"+x).value
      }
      buildings.push(improvment);
    }
  }

  let magicItems = [];
  for(let x = 8; x < 30; x++){
    let item = sheet.getCellByA1("F"+x).value;

    if(item){
      let magicItem = {
        name: item,
        type: sheet.getCellByA1("G"+x).value,
      }
      magicItems.push(magicItem);
    }
  }

  let city  = {
    name: sheet.getCellByA1("A2").value,
    baseValue: sheet.getCellByA1("B2").value,
    purchaseLimit: sheet.getCellByA1("C2").value,
    defense: sheet.getCellByA1("D2").value,
    population: sheet.getCellByA1("E2").value,
    economy: sheet.getCellByA1("F2").value,
    loyalty: sheet.getCellByA1("G2").value,
    stability: sheet.getCellByA1("H2").value,
    buildings: buildings,
    magicShop: magicItems
  };

  return city;
}

// If stability/economy/loyalty are > DC success, within 20 warning, more than
// 20 behind DC danger.
function kingdomHealthCheck(stat, controlDC){

  if(stat > controlDC){
    return "success";
  }

  if((stat+20) >= controlDC){
    return "warning";
  }

  return "danger";
}

const app = express()
const port = 3031

app.set('view engine', 'pug')
app.use(express.static('public'));

app.get('/', (req, res) => {

  data = getInfo();

  data.then(
    function(value) {
      res.render('index',{
        title: "Home",
        stats: value,
      });
    },
  );
})

app.get('/leadership', (req, res) => {
  data = getLeadership();
  data.then(
    function(value) {
      res.render('leadership',{
        title: "Leadership Roles",
        leadership: value,
        vacant: "/images/leaders/vacant.jpeg",
      });
    },
  );
})

app.get('/*', (req, res) => {
  let url = req.originalUrl;
  let city = null;

  switch(url){
    case url = "/stags-end":
      city = 1;
      break;
    case url = "/tatlzford":
      city = 2;
      break;
    case url = "/san-oleg":
      city = 3;
      break;
    case url = "/varnhold":
      city = 4;
      break;
    case url = "/plissken":
      city = 5;
      break;
    case url = "/silverstep":
      city = 6;
      break;

  }

  if(city){
    data = getCity(city);
    data.then(
      function(value) {
        res.render('city',{
          title: value.name,
          city:  value
        });
      },
    );
  }
  else{
    res.status(404).send('Page not Found');
  }
})




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
