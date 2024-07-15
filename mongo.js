const mongoose=require('mongoose')
const password=process.argv[2]
const name=process.argv[3]
const number=process.argv[4]
const url=`mongodb+srv://miguelangelcdm:${password}@oldmostoldsandbox.npxydoz.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=oldmostoldSandbox`
mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema=new mongoose.Schema({
  id:String,
  name:String,
  number:String,
})
const Person=mongoose.model('contact',personSchema)

if (process.argv.length<4) {
  // console.log('give password as argument')
  // process.exit(1)
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(person.name+' '+person.number)
    })
    mongoose.connection.close()
  })
}else{
  const person=new Person({
    // id:'8',
    name:name,
    number:number,
  })

  person.save().then(() => {
    console.log('added '+name+' number '+number+' to phonebook')
    mongoose.connection.close()
  })
}


