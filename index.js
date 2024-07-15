require("dotenv").config();
const express = require("express");
var morgan = require("morgan");
const app = express();
const cors = require("cors");
const Person = require("./models/person");

app.use(express.static("dist"));
app.use(express.json());
app.use(cors());

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

//get info about the phonebook
app.get("/info", (req, res, next) => {
  Person.countDocuments({})
    .then(npersons => {
      const reqTime = new Date().toString();
      res.send(
        `<p>Phonebook has info for ${npersons} people</p><p>${reqTime}</p>`
      );
    })
    .catch(error => next(error));
});

//fetch one person
app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
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

//Add person or update if exists
app.post("/api/persons", (req, res, next) => {
  const body = req.body;
  if (body.name===undefined) {
    return res.status(400).json({error:'name missing'})
  }
  if (body.number===undefined) {
    return res.status(400).json({error:'number missing'})
  }

  Person.findOne({ name: body.name })
    .then(samePerson => {
      if (samePerson) {
        //Person exists, perform an update
        samePerson.number = body.number;
        return samePerson.save()
          .then(updatedPerson => res.json(updatedPerson))
          .catch(error => next(error));
      } else {
        //Person does not exist, create a new person
        const person = new Person({
          name: body.name,
          number: body.number,
        });
        return person.save()
          .then(savedPerson => res.json(savedPerson))
          .catch(error => next(error));
      }
    })
    .catch(error => next(error));
});

// PUT route to update person by ID
app.put("/api/persons/:id", (req, res, next) => {
  const {name,number} = req.body;

  // Person.findByIdAndUpdate(req.params.id, {name,number}, { new: true,runValidators:true,context:'query' })
  //   .then(updatedPerson => {
  //     if (updatedPerson) {
  //       res.json(updatedPerson);
  //     } else {
  //       res.status(404).send('no se actualizo correctamente').end();
  //     }
  //   })
  //   .catch(error => next(error));
  Person.findByIdAndUpdate(req.params.id, {name,number}, { new: true,runValidators:true,context:'query' })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error));
});

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name==='ValidationError') {
    return res.status(400).json({error:error.message})
  }
  next(error)
}
const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
app.use(errorHandler)
