/* All records are fictional. This is the single source of truth for the demo. */
window.GARA = (() => {
  const config = { towers: ['A', 'B'], floors: 18, residentialStart: 4, completion: 'Q4 2027', ceiling: 2.95, payment: { down: 30, months: 24 } };
  const apartments = [];
  for (const tower of config.towers) for (let floor = config.residentialStart; floor <= config.floors; floor++) for (let i = 0; i < 4; i++) {
    const letter = 'ABCD'[i], bedrooms = i === 0 ? 2 : i === 1 ? 3 : i === 2 ? 1 : floor >= 16 ? 4 : 2;
    const area = [94, 128, 67, bedrooms === 4 ? 176 : 102][i] + (tower === 'B' ? 3 : 0);
    const balcony = bedrooms === 4 ? 18 : [9, 12, 6, 11][i];
    const index = apartments.length, seed = (index * 47 + 13) % 120;
    const status = seed < 42 ? 'Available' : seed < 54 ? 'Reserved' : 'Sold';
    apartments.push({ id: `${tower}-${floor}${letter}`, number: `${String(floor).padStart(2,'0')}${letter}`, tower, floor, bedrooms, area, balcony, interior: area - balcony, view: ['City','Caspian','Courtyard','City'][i], orientation: ['W','E','S','W'][i], status, price: Math.round((area * 2320 + floor * 1800 + (tower === 'B' ? 4000 : 0)) / 1000) * 1000 });
  }
  const sample = {'A-12A': ['Available',245000], 'A-12B': ['Reserved',315000], 'A-12C':['Sold',179000], 'A-12D':['Available',269000]};
  for (const [id, [status, price]] of Object.entries(sample)) {
    const unit = apartments.find(a => a.id === id);
    if (unit.status !== status) { const swap = apartments.find(a => a.status === status && !sample[a.id]); swap.status = unit.status; }
    Object.assign(unit,{status,price});
  }
  const timeline = [
    { date:'JAN 2026', title:'The first chapter.', stage:'Site preparation', percent:100, detail:'Site planning, perimeter works and ground preparation complete.', image:'structure.jpg' },
    { date:'APR 2026', title:'Grounded in permanence.', stage:'Foundation', percent:100, detail:'Foundation and underground structure complete across both towers.', image:'structure.jpg' },
    { date:'JUL 2026', title:'A new silhouette.', stage:'Structure', percent:72, detail:'The structural frame continues upward. Floor slabs and cores take shape.', image:'tower.jpg' },
    { date:'SEP 2026', title:'Character, taking shape.', stage:'Facade', percent:18, detail:'Initial facade elements bring texture and depth to the lower levels.', image:'architecture.jpg' }
  ];
  return { config, apartments, timeline, money:n => new Intl.NumberFormat('en-US',{maximumFractionDigits:0}).format(n), floor:(tower,floor) => apartments.filter(a => a.tower === tower && a.floor === Number(floor)), counts:units => ['Available','Reserved','Sold'].map(status=>({status,count:units.filter(a=>a.status===status).length})) };
})();
