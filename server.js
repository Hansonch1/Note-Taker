const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // uuid module to generate unique ids
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// GET /api/notes - reads the db.json file and returns all saved notes as JSON
app.get('/api/notes', (req, res) => {
  // Read the existing notes
  fs.readFile('db/db.json', 'utf8', (err, data) => {
    if (err) throw err;

    const notes = JSON.parse(data);

    // Send the notes back to the client
    res.json(notes);
  });
});

// POST /api/notes - saves a new note to the db.json file, then returns the new note to the client
app.post('/api/notes', (req, res) => {
  fs.readFile('db/db.json', 'utf8', (err, data) => {
    if (err) throw err;

    const notes = JSON.parse(data);

    // Create a new note
    const newNote = req.body;

    // Assign a unique id to the new note
    newNote.id = uuidv4();

    notes.push(newNote);

    // Write the updated notes back to db.json
    fs.writeFile('db/db.json', JSON.stringify(notes, null, 2), (err) => {
      if (err) throw err;
      res.status(200).send(newNote);
    });
  });
});

// DELETE /api/notes/:id - deletes the note with an id 
app.delete('/api/notes/:id', (req, res) => {
  fs.readFile('db/db.json', 'utf8', (err, data) => {
    if (err) throw err;

    const notes = JSON.parse(data);

    // Remove the note with the given id
    const updatedNotes = notes.filter((note) => note.id !== req.params.id);

    // Write the updated notes back to db.json
    fs.writeFile('db/db.json', JSON.stringify(updatedNotes, null, 2), (err) => {
      if (err) throw err;
      res.status(200).send({});
    });
  });
});

// Start the server on the port 3000
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});