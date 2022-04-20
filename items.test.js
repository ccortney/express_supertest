process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("./app");
let items = require("./fakeDb");

let pickles = { "name": "pickles", "price": 2.99};

beforeEach(function() {
    items.push(pickles);
});

afterEach(function() {
    items.length = 0;
});

describe("GET /items", function() {
    test("Get list of items", async function() {
        const res = await request(app).get('/items');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ "items": [{ "name": "pickles", "price": 2.99}]})
    });
})

describe("POST /items", function() {
    test("Create a new item", async function() {
        const newItem = { "name": "whiskey", "price": 25.99};
        const res = await request(app).post('/items').send(newItem);
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ "added": { "name": "whiskey", "price": 25.99}})
    });
})

describe("GET /items/:name", function() {
    test("Get an item by name", async function() {
        const res = await request(app).get(`/items/${pickles.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({"foundItem": { "name": "pickles", "price": 2.99}})

        const resp = await request(app).get('/items/fakeItem');
        expect(resp.statusCode).toBe(404);

    });
})

describe("PATCH /items/:name", function() {
    test("Update an item's name", async function() {
        const updateName = {"name": "apple"};
        const res = await request(app).patch(`/items/${pickles.name}`).send(updateName);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({"updated": { "name": "apple", "price": 2.99}})
    });
    test("Update an item's price", async function() {
        const updatePrice = {"price": 3.49};
        const res = await request(app).patch(`/items/${pickles.name}`).send(updatePrice);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({"updated": { "name": "apple", "price": 3.49}})
    });
    test("Update an item's name and price", async function() {
        const updateNameAndPrice = {"name": "cookies", "price": 4.86};
        const res = await request(app).patch(`/items/${pickles.name}`).send(updateNameAndPrice);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({"updated": { "name": "cookies", "price": 4.86}})
    });
})

describe("DELETE /items/:name", function() {
    test("Delete an item", async function() {
        const res = await request(app).delete(`/items/${pickles.name}`)
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual("Deleted")
    });
});