// Test script for Category Integration
// Run this in the browser console after the app is loaded

console.log('🧪 Testing Category Integration...');

// Test 1: Check if categories are loaded in Redux
function testReduxState() {
  console.log('\n📊 Test 1: Redux State Check');
  
  // Get Redux state (assuming store is available globally)
  if (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__) {
    const state = window.store?.getState();
    if (state?.category) {
      console.log('✅ Category state found:', state.category);
      console.log('📋 Categories loaded:', state.category.categories.length);
      console.log('🔄 Loading state:', state.category.isLoading);
      console.log('❌ Error state:', state.category.error);
      
      if (state.category.categories.length > 0) {
        console.log('📝 Sample category:', state.category.categories[0]);
      }
    } else {
      console.log('❌ Category state not found in Redux');
    }
  } else {
    console.log('⚠️ Redux DevTools not available, cannot check state');
  }
}

// Test 2: Check API endpoint
async function testAPIEndpoint() {
  console.log('\n🌐 Test 2: API Endpoint Check');
  
  try {
    const response = await fetch('/api/categories');
    const data = await response.json();
    
    console.log('✅ API Response:', data);
    console.log('📊 Status:', response.status);
    console.log('📋 Categories count:', data.data?.length || 0);
    
    if (data.success && data.data) {
      console.log('📝 Sample category from API:', data.data[0]);
    }
  } catch (error) {
    console.log('❌ API Error:', error.message);
  }
}

// Test 3: Check form integration
function testFormIntegration() {
  console.log('\n📝 Test 3: Form Integration Check');
  
  // Check if TurfFormModal component exists
  const formModal = document.querySelector('[data-testid="turf-form-modal"]') || 
                   document.querySelector('.p-dialog');
  
  if (formModal) {
    console.log('✅ Turf form modal found');
    
    // Check for category dropdown
    const categoryDropdown = formModal.querySelector('.p-dropdown') ||
                           formModal.querySelector('select');
    
    if (categoryDropdown) {
      console.log('✅ Category dropdown found');
      
      // Check dropdown options
      const options = categoryDropdown.querySelectorAll('option') ||
                     categoryDropdown.querySelectorAll('.p-dropdown-item');
      
      console.log('📋 Dropdown options count:', options.length);
      
      if (options.length > 0) {
        console.log('📝 Sample option:', options[0].textContent);
      }
    } else {
      console.log('❌ Category dropdown not found');
    }
  } else {
    console.log('⚠️ Turf form modal not found (may not be open)');
  }
}

// Test 4: Check localStorage persistence
function testPersistence() {
  console.log('\n💾 Test 4: Persistence Check');
  
  const persistedState = localStorage.getItem('persist:root');
  
  if (persistedState) {
    console.log('✅ Persisted state found');
    
    try {
      const parsed = JSON.parse(persistedState);
      if (parsed.category) {
        const categoryState = JSON.parse(parsed.category);
        console.log('📋 Persisted categories count:', categoryState.categories?.length || 0);
        console.log('📝 Persisted category state:', categoryState);
      } else {
        console.log('❌ Category state not persisted');
      }
    } catch (error) {
      console.log('❌ Error parsing persisted state:', error.message);
    }
  } else {
    console.log('❌ No persisted state found');
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Category Integration Tests...\n');
  
  testReduxState();
  await testAPIEndpoint();
  testFormIntegration();
  testPersistence();
  
  console.log('\n✅ All tests completed!');
  console.log('\n📋 Summary:');
  console.log('- Check Redux DevTools for category state');
  console.log('- Verify API endpoint returns categories');
  console.log('- Test form dropdown shows dynamic categories');
  console.log('- Confirm categories persist across sessions');
}

// Export for manual testing
if (typeof window !== 'undefined') {
  window.testCategoryIntegration = {
    testReduxState,
    testAPIEndpoint,
    testFormIntegration,
    testPersistence,
    runAllTests
  };
  
  console.log('🧪 Category integration tests available at: window.testCategoryIntegration');
}

// Auto-run if in browser
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  // Wait for page to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(runAllTests, 2000); // Wait for Redux to initialize
    });
  } else {
    setTimeout(runAllTests, 2000);
  }
} 