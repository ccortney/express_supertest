const express = require("express");
const ExpressError = require("./expressError");
const router = new express.Router();
const items = require("./fakeDb")

router.get("/", function(req, res) {
    res.json( { items })
});

router.post("/", function(req, res) {
    const newItem = req.body;
    items.push(newItem);
    res.status(201).json({added: newItem })
})

router.get("/:name", function(req, res) {
    const foundItem = items.find(item => item.name === req.params.name);
    if (foundItem === undefined) {
        throw new ExpressError("Item Not Found", 404)
    }
    res.json({foundItem})
})

router.patch('/:name', function(req, res) {
    const foundItem = items.find(item => item.name === req.params.name);
    if (foundItem === undefined) {
        throw new ExpressError("Item Not Found", 404)
    }
    if (req.body.name) {
        foundItem.name = req.body.name
    }
    if (req.body.price) {
        foundItem.price = req.body.price
    }
    res.json( {updated: foundItem})
})

router.delete('/:name', function(req, res) {
    const foundItem = items.findIndex(item => item.name === req.params.name);

    if (foundItem === -1) {
        throw new ExpressError("Item Not Found", 404)
    }

    items.splice(foundItem, 1)
    res.json( "Deleted")
})


module.exports = router;

// {"name": "vegan cookies", "price": 5.45}
// {"name": "pickles", "price": 3.99}