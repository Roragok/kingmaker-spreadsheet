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
  let data ={
    alignment: sheet.getCellByA1("D1").value + sheet.getCellByA1("E1").value,
    size: sheet.getCellByA1("H14").value,
    control_dc: controlDC,
    population: sheet.getCellByA1("B1").value,
    stability: {
      value: sheet.getCellByA1("B4").value,
      class: "warning",
    },
    economy: {
      value: sheet.getCellByA1("B5").value,
      class: "warning",
    },
    loyalty: {
      value: sheet.getCellByA1("B6").value,
      class: "danger",
    },
    unrest: sheet.getCellByA1("H18").value,
    consumption: sheet.getCellByA1("H19").value,
    roads: sheet.getCellByA1("H17").value,
    farms: sheet.getCellByA1("H16").value,
    build_points: sheet.getCellByA1("H20").value,
  };


  return data;
}




// If stability/economy/loyalty are > DC success, within 20 warning, more than
// 20 behind DC danger.
// let stats = {
//   alignment: "CG",
//   size: "40",
//   control_dc: "65",
//   population: "",
//   stability: {
//     value: "49",
//     class: "warning",
//   },
//   economy: {
//     value: "47",
//     class: "warning",
//   },
//   loyalty: {
//     value: "44",
//     class: "danger",
//   },
//   unrest: "0",
//   consumption: "0",
//   roads: "",
//   farms: "",
//   build_points: "",
//
// };

let leadership = {
    ruler: "Demios Allencast III",
    councler: "",
    grand_diplomat: "",
    high_priest: "",
    magister: "",
    marshal: "",
    royal_assassin: "Roy Jones",
    spymaster: "",
    treasurrer: "",
    warden: ""
};

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
        leadership: leadership
      });
    },
    function(error) {
      console.log("Test");
    }
  );
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
