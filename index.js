const express = require("express");
var morgan = require('morgan');
const app = express();
const cors=require('cors');
app.use(express.json());
app.use(express.static('dist'));
app.use(cors());
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
let persons = [
    {
      "id": "1",
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
];


app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
    const npersons=persons.length;
    const reqTime=new Date().toString();
    res.send(
        '<p>Phonebook has info for '+npersons+' people</p><p>'+reqTime+'</p>')
  });

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).send('<p>Person with id '+id+' not found</p>').end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);
  res.status(204).send("person " + id + " deleted");
});

const randomId=()=>{
    const minVal=8;
    const maxVal=1000000;
    return Math.floor(Math.random()*((maxVal-minVal+1)+minVal));
}

app.post("/api/persons", (req, res) => {
  const body=req.body
  const sameName=persons.find((person)=>person.name===body.name);
  if (sameName) {
    return res.status(409).send("Person named '"+body.name+"' already exists!")
  }
  if (!body.name ||!body.number) {
    return res.status(400).json({
      error:'name or number missing'
    })
  }
  const person={
    id:randomId(),
    name:body.name,
    number:body.number,
  }
  persons=persons.concat(person)
  res.json(person)
});

const PORT =process.env.PORT|| 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
