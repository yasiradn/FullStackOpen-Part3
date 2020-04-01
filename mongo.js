/**
 * Expected output
 * TODO: node mongo.js yourpassword Anna 040-1234556 -> added Anna number 040-1234556 to phonebook
 * node mongo.js yourpassword -> fecth all contacts from database  
 */

const mongoose = require('mongoose')

if ( process.argv.length<3 || process.argv[3] === '' || process.argv[4] === '') {
  console.log('Either password, name or number is missing')
  process.exit(1)
} 

const password = process.argv[2]

const name = process.argv[3]

const number = process.argv[4]

const url = `mongodb+srv://admin:${password}@cluster0-sjxwf.mongodb.net/test?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const phoneBookSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('person', phoneBookSchema)

if(process.argv.length == 3){
    Person.find({}).then(result => {
        console.log('Phonebook:')
        result.forEach(person=> {
            console.log(person.name +' '+ person.number)
        })
        mongoose.connection.close()
    })
} else {
    const person = new Person({ name, number })
    person.save().then(result=>{
        console.log(`Added ${result.name} ${result.number} to phonebook`)
        mongoose.connection.close()
    })
    
}