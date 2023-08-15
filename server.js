require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const {PORT = 8000, DATABASE_URL} = process.env;
const morgan = require('morgan');
const mongoose = require('mongoose');

mongoose.connect(DATABASE_URL)

mongoose.connection
.on("open", () => console.log("Connected to database"))
.on("error", (err) => console.log(err))
.on("close", () => console.log("Disconnected from database"))

const recipesSchema = new mongoose.Schema({
    title: String,
    ingredients: String,
    instructions: String,
    image: String,
    category: String
});

const Recipes = mongoose.model('Recipes', recipesSchema);

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get("/", (req, res) => {
    res.json({message: "Hello"})
})

app.get("/recipes", async (req, res) => {
    try {
        const recipes = await Recipes.find();
        res.json(recipes);
    } catch (err) {
        res.status(500).json({err});
    }
});

app.post("/recipes", async (req, res) => {
    try {
        const receipe = await Recipes.create(req.body)
        res.json(receipe)
    } catch (err) {
        res.status(500).json({err});
    }
});

app.get("/recipes/:id", async (req, res) => {
    try {
        const recipe = await Recipes.findById(req.params.id);
        res.json(recipe);
    } catch (err) {
        res.status(500).json({err});
    }
});

app.put("/recipes/:id", async (req, res) => {
    try {
        const recipe = await Recipes.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json(recipe);
    } catch (err) {
        res.status(500).json({err});
    }
});

app.delete("/recipes/:id", async (req, res) => {
    try {
        const recipe = await Recipes.findByIdAndDelete(req.params.id);
        res.status(204).json(recipe)
    } catch (err) {
        res.status(500).json({err});
    }
});





app.listen(PORT, () => console.log(`Listening on port ${PORT}`));