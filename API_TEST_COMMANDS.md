# Food Database Management Scripts

## 1. Reset All Foods (DELETE)
```bash
curl -X DELETE http://127.0.0.1:3030/api/meal/reset-foods
```

## 2. Add Foods from JSON (POST)
```bash
curl -X POST http://127.0.0.1:3030/api/meal/add-foods \
  -H "Content-Type: application/json" \
  -d @sample-data/Foods/Foods.json
```

## 3. Update Food Images (PUT) - NEW!
```bash
curl -X PUT http://127.0.0.1:3030/api/meal/update-food-images \
  -H "Content-Type: application/json" \
  -d @sample-data/Foods/Foods.json
```

## 4. Get All Foods (GET)
```bash
curl -X GET http://127.0.0.1:3030/api/meal/
```

## 5. Get Foods by Category (GET)
```bash
curl -X GET "http://127.0.0.1:3030/api/meal/?category=main"
curl -X GET "http://127.0.0.1:3030/api/meal/?category=side"
curl -X GET "http://127.0.0.1:3030/api/meal/?category=dessert"
curl -X GET "http://127.0.0.1:3030/api/meal/?category=appetizer"
```

# Exercise Database Management Scripts

## 1. Reset All Exercises (DELETE)
```bash
curl -X DELETE http://127.0.0.1:3030/api/plans/exercises/reset
```

## 2. Add Exercises from JSON (POST)
```bash
curl -X POST http://127.0.0.1:3030/api/plans/exercises/add-bulk \
  -H "Content-Type: application/json" \
  -d @sample-data/Exercises/Exercises.json
```

## 3. Get All Exercises (GET)
```bash
curl -X GET http://127.0.0.1:3030/api/plans/exercises
```

# Workout Plans Database Management Scripts

## 1. Reset All Plans (DELETE)
```bash
curl -X DELETE http://127.0.0.1:3030/api/plans/plans/reset
```

## 2. Add Plans from JSON (POST)
```bash
curl -X POST http://127.0.0.1:3030/api/plans/plans/add-bulk \
  -H "Content-Type: application/json" \
  -d @sample-data/Plans/AllPlans.json
```

## 3. Get All Plans (GET)
```bash
curl -X GET http://127.0.0.1:3030/api/plans/
```

## 4. Get Plan by ID (GET)
```bash
curl -X GET http://127.0.0.1:3030/api/plans/1
```

### Get plan by ID
```bash
curl -X GET http://127.0.0.1:3030/api/plans/1
```

### Update exercise image
```bash
curl -X PUT http://127.0.0.1:3030/api/plans/exercises/1 \
  -H "Content-Type: application/json" \
  -d '{"image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&q=80"}'
```

### Update plan image
```bash
curl -X PUT http://127.0.0.1:3030/api/plans/plans/1 \
  -H "Content-Type: application/json" \
  -d '{"image": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop&q=80"}'
```

## Node.js Test Scripts
```bash
# Update food images only
node update-food-images.js

# Reset and populate database
node test-food-endpoints.js

# Populate exercises and plans
node populate-exercises-plans.js

# Update exercise and plan images only
node update-exercise-plan-images.js
```

## Expected Results
- Reset: "Successfully reset all foods/exercises/plans"
- Add: "Successfully added X items" + count of items added
- Update Images: "Successfully updated X food images" + count
- Get: Array of all items with their details
- Category: Filtered items by category
