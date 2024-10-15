const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Enable CORS
app.use(cors());

const dataFilePath = 'data.json';

// Helper function to generate a unique ID
function generateId() {
  const currentData = fs.readFileSync(dataFilePath, 'utf8');
  const jsonData = JSON.parse(currentData);
  const lastEntry = jsonData[jsonData.length - 1];
  const lastId = lastEntry ? lastEntry.id : 1000;
  return lastId + 1;
}

// GET endpoint for retrieving data
app.get('/getData', function(req, res) {
  // Read data from the JSON file
  fs.readFile(dataFilePath, 'utf8', function(err, data) {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading data.');
    } else {
      const jsonData = JSON.parse(data);
      res.status(200).json(jsonData);
    }
  });
});

// POST endpoint for saving data
app.post('/saveData', function(req, res) {
  const formData = req.body;

  try {
    // Generate a unique ID
    const id = generateId();

    // Assign the ID to the form data
    formData.id = id;

    // Read existing data from the JSON file
    let jsonData = [];
    let data = fs.readFileSync(dataFilePath, 'utf8');

    if (data) {
      jsonData = JSON.parse(data);
    }

    // Push the new form data into the existing JSON data array
    jsonData.push(formData);

    // Write the updated data back to the JSON file
    fs.writeFileSync(dataFilePath, JSON.stringify(jsonData));

    console.log('Data saved successfully.');
    res.status(200).send('Data saved successfully.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving data.');
  }
});

// DELETE endpoint for deleting data
app.delete('/deleteData', function(req, res) {
  // Delete the JSON file
  fs.unlink(dataFilePath, function(err) {
    if (err) {
      console.error(err);
      res.status(500).send('Error deleting data.');
    } else {
      console.log('Data deleted successfully.');
      res.status(200).send('Data deleted successfully.');
    }
  });
});

app.listen(3000, function() {
  console.log('Server is running on port 3000');
});
