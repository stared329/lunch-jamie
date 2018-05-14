const mongoose = require('mongoose')

const personSchema = mongoose.Schema({

})

const Person = mongoose.model('Person', personSchema)

module.exports = Person
