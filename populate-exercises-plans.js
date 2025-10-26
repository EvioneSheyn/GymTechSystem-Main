const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Read the Exercises.json file
const exercisesPath = path.join(__dirname, 'sample-data/Exercises/Exercises.json');
const exercisesData = JSON.parse(fs.readFileSync(exercisesPath, 'utf8'));

// Read the AllPlans.json file
const plansPath = path.join(__dirname, 'sample-data/Plans/AllPlans.json');
const plansData = JSON.parse(fs.readFileSync(plansPath, 'utf8'));

const API_BASE_URL = 'http://127.0.0.1:3030/api/plans';

async function resetExercises() {
  try {
    console.log('🔄 Resetting all exercises...');
    const response = await axios.delete(`${API_BASE_URL}/exercises/reset`);
    console.log('✅ Reset successful:', response.data.message);
    return true;
  } catch (error) {
    console.error('❌ Reset failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function addExercises() {
  try {
    console.log('📤 Adding exercises to database...');
    const response = await axios.post(`${API_BASE_URL}/exercises/add-bulk`, exercisesData);
    console.log('✅ Add successful:', response.data.message);
    console.log(`📊 Added ${exercisesData.exercises.length} exercises to the database`);
    return true;
  } catch (error) {
    console.error('❌ Add failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function resetPlans() {
  try {
    console.log('🔄 Resetting all plans...');
    const response = await axios.delete(`${API_BASE_URL}/plans/reset`);
    console.log('✅ Reset successful:', response.data.message);
    return true;
  } catch (error) {
    console.error('❌ Reset failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function addPlans() {
  try {
    console.log('📤 Adding plans to database...');
    const response = await axios.post(`${API_BASE_URL}/plans/add-bulk`, plansData);
    console.log('✅ Add successful:', response.data.message);
    console.log(`📊 Added ${plansData.plans.length} plans to the database`);
    return true;
  } catch (error) {
    console.error('❌ Add failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function verifyExercises() {
  try {
    console.log('🔍 Verifying exercises in database...');
    const response = await axios.get(`${API_BASE_URL}/exercises`);
    console.log(`✅ Verification successful: ${response.data.exercises.length} exercises found in database`);
    
    // Show first few exercises as sample
    console.log('\n📋 Sample exercises:');
    response.data.exercises.slice(0, 5).forEach((exercise, index) => {
      console.log(`${index + 1}. ${exercise.name} - ${exercise.type} (${exercise.variantUnit})`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Verification failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function verifyPlans() {
  try {
    console.log('🔍 Verifying plans in database...');
    const response = await axios.get(`${API_BASE_URL}/`);
    console.log(`✅ Verification successful: ${response.data.plans.length} plans found in database`);
    
    // Show all plans
    console.log('\n📋 Available plans:');
    response.data.plans.forEach((plan, index) => {
      console.log(`${index + 1}. ${plan.title}`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Verification failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting exercises and plans database update process...\n');
  
  // Step 1: Reset and add exercises
  console.log('=== EXERCISES ===');
  const exerciseResetSuccess = await resetExercises();
  if (!exerciseResetSuccess) {
    console.log('❌ Failed to reset exercises. Exiting...');
    return;
  }
  
  const exerciseAddSuccess = await addExercises();
  if (!exerciseAddSuccess) {
    console.log('❌ Failed to add exercises. Exiting...');
    return;
  }
  
  await verifyExercises();
  
  console.log('\n=== PLANS ===');
  // Step 2: Reset and add plans
  const planResetSuccess = await resetPlans();
  if (!planResetSuccess) {
    console.log('❌ Failed to reset plans. Exiting...');
    return;
  }
  
  const planAddSuccess = await addPlans();
  if (!planAddSuccess) {
    console.log('❌ Failed to add plans. Exiting...');
    return;
  }
  
  await verifyPlans();
  
  console.log('\n🎉 Exercises and plans database update completed successfully!');
  console.log('\n💡 All exercises and workout plans have been added to the database');
}

// Run the script
main().catch(console.error);
