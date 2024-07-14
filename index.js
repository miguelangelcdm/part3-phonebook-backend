require("dotenv").config();
const express = require("express");
var morgan = require("morgan");
const app = express();
const cors = require("cors");
const Person = require("./models/person");

app.use(express.static("dist"));
app.use(express.json());
app.use(cors());
// app.use(requestLogger)

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// let persons = [
//     {
//       "id": "1",
//       "name": "Arto Hellas",
//       "number": "040-123456"
//     },
//     {
//       "id": "2",
//       "name": "Ada Lovelace",
//       "number": "39-44-5323523"
//     },
//     {
//       "id": "3",
//       "name": "Dan Abramov",
//       "number": "12-43-234345"
//     },
//     {
//       "id": "4",
//       "name": "Mary Poppendieck",
//       "number": "39-23-6423122"
//     }
// ];


const randomId = () => {
  const minVal = 8;
  const maxVal = 1000000;
  return Math.floor(Math.random() * (maxVal - minVal + 1 + minVal));
};

//gets people
app.get("/api/persons", (req, res) => {
  // res.json(persons);
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/info", (req, res) => {
  const npersons = persons.length;
  const reqTime = new Date().toString();
  res.send(
    "<p>Phonebook has info for " +
      npersons +
      " people</p><p>" +
      reqTime +
      "</p>"
  );
});

//fetch one person
app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(res.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(500).end();
      }
    })
    .catch((error) => next(error));
});

//Delete person
app.delete("/api/persons/:id", (req, res,next) => {
  Person.findByIdAndDelete(req.params.id)
  .then(result=>{
    res.status(204).send(req.params.name + " deleted").end()
  })
  .catch(error=>next(error))
});

//Add person
app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({ error: "name or number missing" });
  }
  const person = new Person({
    // id:randomId(),
    name: body.name,
    number: body.number,
  });
  person.save().then((savePerson) => {
    res.json(savePerson);
  });
  // const sameName = persons.find((person) => person.name === body.name);
  // if (sameName) {
  //   return res
  //     .status(409)
  //     .send("Person named '" + body.name + "' already exists!");
  // }
  // if (!body.name || !body.number) {
  //   return res.status(400).json({
  //     error: "name or number missing",
  //   });
  // }
  // const person = {
  //   id: randomId(),
  //   name: body.name,
  //   number: body.number,
  // };
  // persons = persons.concat(person);
  // res.json(person);
});


const unknownEndpoint=(req,res)=>{
  res.static(404).send({error:'unknown endpoint'})
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}
const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
app.use(errorHandler)
