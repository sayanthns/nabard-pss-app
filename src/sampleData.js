// Realistic Kerala FPO soil sensor data — mirrors original dashboard
const FPOS = ['Mayyil', 'Kuttiatoor', 'Cheruthazham', 'Anthoor', 'Thalassery', 'Paithal Hills']

const FARMERS = {
  Mayyil:       ['Rajan P', 'Suresh K', 'Mohan V', 'Prakash N', 'Balan R'],
  Kuttiatoor:   ['Krishnan M', 'Sathyan T', 'Biju A', 'Anil P', 'Vinod K'],
  Cheruthazham: ['Raveendran E', 'Sudhakaran C', 'Sabu J', 'Manoj T', 'Rajesh N'],
  Anthoor:      ['Vijayan P', 'Soman K', 'Pradeep R', 'Gopi M', 'Anoop C'],
  Thalassery:   ['Muraleedharan T', 'Jayakumar P', 'Shaji V', 'Bino K', 'Roshan M'],
  'Paithal Hills': ['Thomas K', 'Mathew J', 'George P', 'Jose A', 'Benny T'],
}

const CROPS = ['Coconut', 'Banana', 'Pepper', 'Ginger', 'Areca Nut', 'Paddy', 'Tapioca']

function rand(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
}

function daysBefore(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(Math.floor(Math.random() * 12) + 6)
  d.setMinutes(Math.floor(Math.random() * 60))
  return d.toISOString()
}

let id = 1
const TOTAL = 2000

export function generateSampleData() {
  const metrics = []
  const perFpo = Math.floor(TOTAL / FPOS.length)

  FPOS.forEach((fpo, fi) => {
    const farmers = FARMERS[fpo]
    // pH baseline varies by FPO — Kerala soils mostly acidic
    const phBase = 4.8 + fi * 0.18

    for (let i = 0; i < perFpo; i++) {
      const farmer = farmers[i % farmers.length]
      const daysAgo = Math.floor(Math.random() * 90)
      metrics.push({
        id: id++,
        fpo,
        farmerName: farmer,
        plotName: `${CROPS[i % CROPS.length]} Plot ${(i % 4) + 1}`,
        time: daysBefore(daysAgo),
        soil_ph: rand(phBase - 0.3, phBase + 0.5),
        soil_humidity: rand(28, 68),
        nitrogen: rand(18, 52),
        phosphorus: rand(60, 130),
        potassium: rand(40, 95),
        soil_electricity_conductivity: rand(150, 550),
        soil_temperature: rand(24, 34),
      })
    }
  })

  // Sort by time desc
  metrics.sort((a, b) => new Date(b.time) - new Date(a.time))
  return { metrics, fpos: FPOS }
}
