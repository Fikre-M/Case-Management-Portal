// Test script for AI proxy function
const testAIProxy = async () => {
  try {
    console.log('🧪 Testing AI proxy function...');
    
    const response = await fetch('/.netlify/functions/ai-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'Hello, can you help me with a legal case?' }
        ],
        model: 'gemini-1.5-flash'
      })
    });

    const data = await response.json();
    console.log('✅ Response:', data);
    
    if (response.ok) {
      console.log('🎉 AI proxy working!');
      console.log('AI Response:', data.choices[0]?.message?.content);
    } else {
      console.log('❌ Error:', data.error);
    }
  } catch (error) {
    console.error('💥 Test failed:', error);
  }
};

// Run test
testAIProxy();
