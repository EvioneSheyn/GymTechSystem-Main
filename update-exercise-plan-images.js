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

async function updateExerciseImages() {
  try {
    console.log('🔄 Updating exercise images...');
    
    // Get current exercises
    const response = await axios.get(`${API_BASE_URL}/exercises`);
    const currentExercises = response.data.exercises;
    
    console.log(`📊 Found ${currentExercises.length} exercises in database`);
    
    // Update each exercise with new image URL
    let updatedCount = 0;
    for (const exercise of currentExercises) {
      const exerciseData = exercisesData.exercises.find(e => e.name === exercise.name);
      if (exerciseData) {
        console.log(`🔍 Checking ${exercise.name}:`);
        console.log(`   Current: ${exercise.image}`);
        console.log(`   New: ${exerciseData.image}`);
        console.log(`   Different: ${exerciseData.image !== exercise.image}`);
        
        if (exerciseData.image !== exercise.image) {
          try {
            await axios.put(`${API_BASE_URL}/exercises/${exercise.id}`, {
              image: exerciseData.image
            });
            updatedCount++;
            console.log(`✅ Updated ${exercise.name}: ${exerciseData.image}`);
          } catch (error) {
            console.warn(`⚠️ Failed to update ${exercise.name}: ${error.message}`);
          }
        } else {
          console.log(`⏭️ Skipping ${exercise.name} - images are the same`);
        }
      } else {
        console.warn(`⚠️ No matching exercise data found for ${exercise.name}`);
      }
    }
    
    console.log(`✅ Successfully updated ${updatedCount} exercise images`);
    return true;
  } catch (error) {
    console.error('❌ Update failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function updatePlanImages() {
  try {
    console.log('🔄 Updating plan images...');
    
    // Get current plans
    const response = await axios.get(`${API_BASE_URL}/`);
    const currentPlans = response.data.plans;
    
    console.log(`📊 Found ${currentPlans.length} plans in database`);
    
    // Update each plan with new image URL
    let updatedCount = 0;
    for (const plan of currentPlans) {
      const planData = plansData.plans.find(p => p.title === plan.title);
      if (planData) {
        console.log(`🔍 Checking ${plan.title}:`);
        console.log(`   Current: ${plan.image}`);
        console.log(`   New: ${planData.image}`);
        console.log(`   Different: ${planData.image !== plan.image}`);
        
        if (planData.image !== plan.image) {
          try {
            await axios.put(`${API_BASE_URL}/plans/${plan.id}`, {
              image: planData.image
            });
            updatedCount++;
            console.log(`✅ Updated ${plan.title}: ${planData.image}`);
          } catch (error) {
            console.warn(`⚠️ Failed to update ${plan.title}: ${error.message}`);
          }
        } else {
          console.log(`⏭️ Skipping ${plan.title} - images are the same`);
        }
      } else {
        console.warn(`⚠️ No matching plan data found for ${plan.title}`);
      }
    }
    
    console.log(`✅ Successfully updated ${updatedCount} plan images`);
    return true;
  } catch (error) {
    console.error('❌ Update failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting exercise and plan image update process...\n');
  
  const exerciseSuccess = await updateExerciseImages();
  console.log('\n');
  const planSuccess = await updatePlanImages();
  
  if (exerciseSuccess && planSuccess) {
    console.log('\n🎉 Exercise and plan image update completed successfully!');
    console.log('💡 All images have been updated with new Unsplash URLs');
  } else {
    console.log('\n❌ Some updates failed. Check the logs above.');
  }
}

// Run the script
main().catch(console.error);
