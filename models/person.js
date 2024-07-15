require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URL
console.log('connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoBD')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type:String,
    minLength:3,
    required:true,
  },
  number: {
    type:String,
    minLength:8,
    required:[true,'User phone number required!'],
    validate:{
      validator:function(v){
        return /^\d{2,3}-\d{1,}$/.test(v)
      },
      message:props => `${props.value} is not a valid phone number!`
    }
  },

})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports=mongoose.model('contact', personSchema)

