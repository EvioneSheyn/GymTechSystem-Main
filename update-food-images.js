const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Read the Foods.json file
const foodsPath = path.join(__dirname, 'sample-data/Foods/Foods.json');
const foodsData = JSON.parse(fs.readFileSync(foodsPath, 'utf8'));

const API_BASE_URL = 'http://localhost:3030/api/meal';

async function getCurrentFoods() {
  try {
    console.log('🔍 Getting current foods from database...');
    const response = await axios.get(`${API_BASE_URL}/`);
    console.log(`✅ Found ${response.data.foods.length} foods in database`);
    
    // Show first few foods with their current image URLs
    console.log('\n📋 Current food images (first 5):');
    response.data.foods.slice(0, 5).forEach((food, index) => {
      console.log(`${index + 1}. ${food.name}`);
      console.log(`   Current image: ${food.imageUrl}`);
    });
    
    return response.data.foods;
  } catch (error) {
    console.error('❌ Failed to get current foods:', error.response?.data?.message || error.message);
    return null;
  }
}

async function updateFoodImages() {
  try {
    console.log('\n🔄 Updating food images...');
    const response = await axios.put(`${API_BASE_URL}/update-food-images`, foodsData);
    console.log('✅ Update successful:', response.data.message);
    console.log(`📊 Updated ${response.data.updatedCount} food images`);
    return true;
  } catch (error) {
    console.error('❌ Update failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function verifyUpdatedImages() {
  try {
    console.log('\n🔍 Verifying updated images...');
    const response = await axios.get(`${API_BASE_URL}/`);
    
    console.log('\n📋 Updated food images (first 5):');
    response.data.foods.slice(0, 5).forEach((food, index) => {
      console.log(`${index + 1}. ${food.name}`);
      console.log(`   New image: ${food.imageUrl}`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Verification failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting food image update process...\n');
  
  // Step 1: Check current foods
  const currentFoods = await getCurrentFoods();
  if (!currentFoods) {
    console.log('❌ Failed to get current foods. Exiting...');
    return;
  }
  
  // Step 2: Update food images
  const updateSuccess = await updateFoodImages();
  if (!updateSuccess) {
    console.log('❌ Failed to update food images. Exiting...');
    return;
  }
  
  // Step 3: Verify the updates
  await verifyUpdatedImages();
  
  console.log('\n🎉 Food image update completed successfully!');
  console.log('\n💡 All food images have been updated with new Unsplash URLs');
}

// Run the script
main().catch(console.error);
