const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Read the Foods.json file
const foodsPath = path.join(__dirname, 'sample-data/Foods/Foods.json');
const foodsData = JSON.parse(fs.readFileSync(foodsPath, 'utf8'));

const API_BASE_URL = 'http://localhost:3000/api/meal'; // Adjust port if needed

async function resetFoods() {
  try {
    console.log('🔄 Resetting all foods...');
    const response = await axios.delete(`${API_BASE_URL}/reset-foods`);
    console.log('✅ Reset successful:', response.data.message);
    return true;
  } catch (error) {
    console.error('❌ Reset failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function addFoods() {
  try {
    console.log('📤 Adding foods to database...');
    const response = await axios.post(`${API_BASE_URL}/add-foods`, foodsData);
    console.log('✅ Add successful:', response.data.message);
    console.log(`📊 Added ${foodsData.foods.length} foods to the database`);
    return true;
  } catch (error) {
    console.error('❌ Add failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function verifyFoods() {
  try {
    console.log('🔍 Verifying foods in database...');
    const response = await axios.get(`${API_BASE_URL}/`);
    console.log(`✅ Verification successful: ${response.data.foods.length} foods found in database`);
    
    // Show first few foods as sample
    console.log('\n📋 Sample foods:');
    response.data.foods.slice(0, 5).forEach((food, index) => {
      console.log(`${index + 1}. ${food.name} - ${food.calories} cal/${food.unit} (${food.category})`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Verification failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting food database update process...\n');
  
  // Step 1: Reset all foods
  const resetSuccess = await resetFoods();
  if (!resetSuccess) {
    console.log('❌ Failed to reset foods. Exiting...');
    return;
  }
  
  console.log(''); // Empty line for readability
  
  // Step 2: Add new foods
  const addSuccess = await addFoods();
  if (!addSuccess) {
    console.log('❌ Failed to add foods. Exiting...');
    return;
  }
  
  console.log(''); // Empty line for readability
  
  // Step 3: Verify the foods were added
  await verifyFoods();
  
  console.log('\n🎉 Food database update completed successfully!');
}

// Run the script
main().catch(console.error);
