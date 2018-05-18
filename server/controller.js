const express = require('express')
const Person = require('./models/Person')

const router = express.Router()

router.get('/people', (req, res) => {
    Person.find(function (err, people) {
        if (err) return res.status(500).send({ error: 'database failure' });
        res.json(people);
    })
});

router.get('/people/:name', (req, res) => {
    Person.findOne({ name: req.params.name }, function (err, people) {
        if (err) return res.status(500).json({ error: 'error' });
        if (people) return res.status(202).json({ error: 'already exists' });
        return res.status(200).send();
    })
});

router.post('/people/:name', (req, res) => {
    Person.findOne({ name: req.params.name }, (error, people) => {
        if (error) return res.status(500).json(error);
        if (people) return res.status(202).json({msg: 'already exists'});
        const person_instance = new Person({ name: req.params.name, group: 0});
        person_instance.save(err => {
            if (err) return res.json({ error: err });
            res.status(201).send({ result: 'complete' });
        })
    })
})

router.delete('/people/:name', (req, res) => {
    Person.remove({ name: req.params.name }, (err, output) => {
        if (err) return res.status(500).json({ error: 'database failure' });
        res.status(204).end();
    })
})

router.put('/people/group/:num', (req, res) => {
    Person.find((err, people) => {
        if (err) return res.status(500).send({ error: 'database failure' });
        const groupNum = req.params.num;
        const idxArr = [...Array(people.length).keys()];
        const shuffledArr = shuffleArray(idxArr);
        let repeat = 0;
        shuffledArr.forEach((val, idx) => {
            people[val]["group"] = (groupNum === 0) ? 0 : repeat + 1;
            if ((idx + 1) % groupNum === 0) repeat += 1;
        });
        people.forEach((person, idx) => {
            Person.update({ "name": person.name }, { "$set": { "group": person.group } }, (error, output) => {
                if (error) return res.status(500).json(error);
            });
        });

        if(groupNum > 1) people.sort((a, b) => (a.group - b.group));
        console.log(people);
        res.json(people);
    })
})

const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

module.exports = router
