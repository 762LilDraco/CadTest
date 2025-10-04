const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const db = new sqlite3.Database('./db.sqlite');
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS people (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT,
    last_name TEXT,
    dob TEXT,
    gender TEXT,
    notes TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS calls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    location TEXT,
    description TEXT,
    assigned_unit TEXT,
    status TEXT
  )`);
});

app.get('/api/people', (req, res) => {
  db.all('SELECT * FROM people', [], (err, rows) => {
    if (err) res.status(500).send(err);
    else res.json(rows);
  });
});

app.post('/api/people', (req, res) => {
  const { first_name, last_name, dob, gender, notes } = req.body;
  db.run(
    `INSERT INTO people (first_name, last_name, dob, gender, notes) VALUES (?, ?, ?, ?, ?)`,
    [first_name, last_name, dob, gender, notes],
    function (err) {
      if (err) res.status(500).send(err);
      else res.json({ id: this.lastID });
    }
  );
});

app.get('/api/calls', (req, res) => {
  db.all('SELECT * FROM calls', [], (err, rows) => {
    if (err) res.status(500).send(err);
    else res.json(rows);
  });
});

app.post('/api/calls', (req, res) => {
  const { type, location, description, assigned_unit, status } = req.body;
  db.run(
    `INSERT INTO calls (type, location, description, assigned_unit, status) VALUES (?, ?, ?, ?, ?)`,
    [type, location, description, assigned_unit, status],
    function (err) {
      if (err) res.status(500).send(err);
      else res.json({ id: this.lastID });
    }
  );
});

app.listen(PORT, () => console.log(`CAD running at http://localhost:${PORT}`));
