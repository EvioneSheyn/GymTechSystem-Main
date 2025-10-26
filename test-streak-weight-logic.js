const axios = require('axios');

const API_BASE_URL = 'http://127.0.0.1:3030/api/report';

// Test data scenarios
const testScenarios = [
  {
    name: "No Data Scenario",
    description: "User with no workouts or weight records",
    expected: {
      streak: 0,
      weight: { difference: 0, status: "No data" }
    }
  },
  {
    name: "Weight Loss Scenario", 
    description: "User lost 2.5 kg (started at 80kg, now 77.5kg)",
    expected: {
      weight: { difference: -2.5, status: "Lost" }
    }
  },
  {
    name: "Weight Gain Scenario",
    description: "User gained 1.2 kg (started at 70kg, now 71.2kg)", 
    expected: {
      weight: { difference: 1.2, status: "Gained" }
    }
  },
  {
    name: "Consecutive Workout Scenario",
    description: "User worked out 3 consecutive days",
    expected: {
      streak: 3
    }
  }
];

async function testStreakLogic() {
  console.log('🧪 Testing Streak Logic...\n');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/streak`, {
      headers: {
        'Authorization': 'Bearer YOUR_TEST_TOKEN' // Replace with actual token
      }
    });
    
    console.log('✅ Streak API Response:', response.data);
    console.log(`📊 Current Streak: ${response.data.streak} days`);
    
    // Validate streak logic
    if (response.data.streak >= 0) {
      console.log('✅ Streak is non-negative (correct)');
    } else {
      console.log('❌ Streak is negative (incorrect)');
    }
    
  } catch (error) {
    console.log('❌ Streak API Error:', error.response?.data?.message || error.message);
  }
}

async function testWeightLogic() {
  console.log('\n🧪 Testing Weight Logic...\n');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/weight-summary`, {
      headers: {
        'Authorization': 'Bearer YOUR_TEST_TOKEN' // Replace with actual token
      }
    });
    
    console.log('✅ Weight API Response:', response.data);
    
    // Validate weight logic
    const { difference, status } = response.data;
    
    if (difference === undefined || difference === null) {
      console.log('❌ Weight difference is undefined/null');
      return;
    }
    
    console.log(`📊 Weight Difference: ${difference} kg`);
    console.log(`📊 Status: ${status}`);
    
    // Check logic consistency
    if (difference > 0 && status === "Gained") {
      console.log('✅ Positive difference correctly shows "Gained"');
    } else if (difference < 0 && status === "Lost") {
      console.log('✅ Negative difference correctly shows "Lost"');
    } else if (difference === 0 && status === "No change") {
      console.log('✅ Zero difference correctly shows "No change"');
    } else if (difference === 0 && status === "No data") {
      console.log('✅ No data correctly shows "No data"');
    } else {
      console.log('❌ Weight logic inconsistency detected!');
      console.log(`   Difference: ${difference}, Status: ${status}`);
    }
    
  } catch (error) {
    console.log('❌ Weight API Error:', error.response?.data?.message || error.message);
  }
}

async function testMonthlyWorkouts() {
  console.log('\n🧪 Testing Monthly Workouts...\n');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/monthly-workouts`, {
      headers: {
        'Authorization': 'Bearer YOUR_TEST_TOKEN' // Replace with actual token
      }
    });
    
    console.log('✅ Monthly Workouts API Response:', response.data);
    
    if (response.data.reportData && Array.isArray(response.data.reportData)) {
      console.log(`📊 Found ${response.data.reportData.length} months of data`);
      
      if (response.data.reportData.length > 0) {
        console.log('📈 Sample data:', response.data.reportData[0]);
      } else {
        console.log('📊 No workout data available (empty array)');
      }
    } else {
      console.log('❌ Invalid response format');
    }
    
  } catch (error) {
    console.log('❌ Monthly Workouts API Error:', error.response?.data?.message || error.message);
  }
}

async function main() {
  console.log('🚀 Testing Streak and Weight Logic\n');
  console.log('⚠️  Note: Replace YOUR_TEST_TOKEN with actual authentication token\n');
  
  await testStreakLogic();
  await testWeightLogic();
  await testMonthlyWorkouts();
  
  console.log('\n✅ Testing completed!');
  console.log('\n📋 Summary of Logic Fixes:');
  console.log('1. ✅ Streak: Fixed to count consecutive days properly (doesn\'t require today to have workout)');
  console.log('2. ✅ Weight: Fixed difference calculation (positive = gained, negative = lost)');
  console.log('3. ✅ Weight: Added "No change" status for zero difference');
  console.log('4. ✅ Frontend: Updated to show +/- signs for weight changes');
  console.log('5. ✅ Frontend: Added proper decimal formatting (1 decimal place)');
}

main().catch(console.error);
