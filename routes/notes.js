const fb = require("express").Router();
const { readFromFile, writeToFile, readAndAppend } = require("../helpers/fsUtils");
const uuid = require("../helpers/uuid");

// GET Route for reading from the db.json file
fb.get("/", (req, res) =>
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)))
);

// POST Route for adding a new note
fb.post("/", (req, res) => {
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save, adding a unique id with uuid package
    const newNote = {
      id: uuid(),
      title,
      text,
    };

    readAndAppend(newNote, "./db/db.json");

    const response = {
      status: "success",
      body: newNote,
    };

    res.json(response);
  } else {
    res.json("Error in POSTing notes");
  }
});

// DELETE Route to remove a note with a specific id
fb.delete("/:id", (req, res) => {
  const noteId = req.params.id;

  readFromFile("./db/db.json")
    .then((data) => JSON.parse(data))
    .then((json) => {
      // If note.id exists in json, remove it
      if (json.some((note) => note.id === noteId)) {
        // remove the item from the array
      const result = json.filter((note) => note.id !== noteId);
      // write the new array to the file using writeToFile
      writeToFile("./db/db.json", result);
        const response = {
          status: "success",
          body: result,
        };
    
        res.json(response);
      } else {
        res.json("Error in deleting note");
      }
    });
});

module.exports = fb;
