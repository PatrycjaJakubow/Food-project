import fs from "node:fs/promises";

import bodyParser from "body-parser";
import express from "express";

const app = express();

app.use(express.static("images"));
app.use(bodyParser.json());

// CORS

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // allow all domains
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  next();
});

app.get("/food", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // return res.status(500).json();

  const fileContent = await fs.readFile("./data/food.json");

  const foodData = JSON.parse(fileContent);

  res.status(200).json({ food: foodData });
});

app.get("/user-food", async (req, res) => {
  const fileContent = await fs.readFile("./data/user-food.json");

  const food = JSON.parse(fileContent);

  res.status(200).json({ food });
});

app.put("/user-food", async (req, res) => {
  const foodId = req.body.foodId;



  const fileContent = await fs.readFile("./data/food.json");
  const foodData = JSON.parse(fileContent);

  const food = foodData.find((food) => food.id === foodId);

  const userFoodFileContent = await fs.readFile("./data/user-food.json");
  const userFoodData = JSON.parse(userFoodFileContent);

  let updatedUserFood = userFoodData;

  if (!userFoodData.some((p) => p.id === food.id)) {
    updatedUserFood = [...userFoodData, food];
  }

  await fs.writeFile(
    "./data/user-food.json",
    JSON.stringify(updatedUserFood)
  );

  res.status(200).json({ userFood: updatedUserFood });
});

app.delete("/user-food/:id", async (req, res) => {
  const foodId = req.params.id;

 
  const userFoodFileContent = await fs.readFile("./data/user-food.json");
  const userFoodData = JSON.parse(userFoodFileContent);

  const foodIndex = userFoodData.findIndex((food) => food.id === foodId);

  let updatedUserFood = userFoodData;

  if (foodIndex >= 0) {
    updatedUserFood.splice(foodIndex, 1);
  }

  await fs.writeFile(
    "./data/user-food.json",
    JSON.stringify(updatedUserFood)
  );

  res.status(200).json({ userFood: updatedUserFood});
});

// 404
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  res.status(404).json({ message: "404 - Not Found" });
});

app.listen(3000);
