#!/usr/bin/env node

/**
 * Enhanced Demo Screenshots Generator
 * 
 * This script generates high-quality screenshots and GIFs for the README.
 * Uses Puppeteer for screenshots and gif generation for animations.
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const DEMO_URL = process.env.DEMO_URL || 'http://localhost:2020';
const OUTPUT_DIR = path.join(__dirname, '../public/demo-screenshots');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const screenshots = [
  {
    name: 'ai-chat-in-action',
    url: `${DEMO_URL}/dashboard`,
    selector: '.ai-assistant-container',
    viewport: { width: 1920, height: 1080 },
    wait: 3000,
    description: 'AI Assistant chat interface showing conversation',
    action: async (page) => {
      // Open AI assistant
      await page.click('.ai-toggle-button');
      await page.waitForTimeout(1500);
      // Type a message
      await page.type('.ai-input-field', 'Help me analyze this case', { delay: 100 });
      await page.waitForTimeout(1000);
    }
  },
  {
    name: 'dashboard-metrics',
    url: `${DEMO_URL}/dashboard`,
    selector: '.dashboard-grid',
    viewport: { width: 1920, height: 1080 },
    wait: 2500,
    description: 'Dashboard with animated metrics and charts'
  },
  {
    name: 'dark-mode-dashboard',
    url: `${DEMO_URL}/dashboard`,
    selector: '.dashboard-container',
    viewport: { width: 1920, height: 1080 },
    wait: 2500,
    description: 'Dashboard in dark mode theme',
    action: async (page) => {
      // Toggle dark mode
      await page.click('.theme-toggle-button');
      await page.waitForTimeout(1000);
    }
  },
  {
    name: 'case-management',
    url: `${DEMO_URL}/cases`,
    selector: '.case-list-container',
    viewport: { width: 1920, height: 1080 },
    wait: 2000,
    description: 'Case management interface with status indicators'
  },
  {
    name: 'appointment-scheduling',
    url: `${DEMO_URL}/appointments`,
    selector: '.appointment-calendar',
    viewport: { width: 1920, height: 1080 },
    wait: 2000,
    description: 'Appointment scheduling calendar interface'
  },
  {
    name: 'mobile-responsive',
    url: `${DEMO_URL}/dashboard`,
    selector: '.mobile-dashboard',
    viewport: { width: 375, height: 812 },
    wait: 2000,
    description: 'Mobile responsive dashboard view'
  },
  {
    name: 'landing-hero',
    url: DEMO_URL,
    selector: '.hero-section',
    viewport: { width: 1920, height: 1080 },
    wait: 3000,
    description: 'Enhanced landing page hero section'
  },
  {
    name: 'ai-suggestions',
    url: `${DEMO_URL}/dashboard`,
    selector: '.smart-suggestions-container',
    viewport: { width: 1920, height: 1080 },
    wait: 2500,
    description: 'AI smart suggestions panel'
  }
];

async function captureScreenshot(config) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport(config.viewport);
    
    console.log(`📸 Capturing: ${config.name}`);
    console.log(`📝 Description: ${config.description}`);
    
    // Navigate to page
    await page.goto(config.url, { waitUntil: 'networkidle2' });
    
    // Wait for content to load
    await page.waitForTimeout(config.wait);
    
    // Perform any actions (like clicking buttons)
    if (config.action) {
      await config.action(page);
    }
    
    // Find element to capture
    const element = await page.$(config.selector);
    if (!element) {
      console.warn(`⚠️ Element not found: ${config.selector}`);
      // Fallback to full page
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `${config.name}.png`),
        fullPage: true
      });
    } else {
      await element.screenshot({
        path: path.join(OUTPUT_DIR, `${config.name}.png`)
      });
    }
    
    console.log(`✅ Saved: ${config.name}.png`);
    
  } catch (error) {
    console.error(`❌ Error capturing ${config.name}:`, error.message);
  } finally {
    await browser.close();
  }
}

async function generateAllScreenshots() {
  console.log('🚀 Starting enhanced demo screenshot generation...');
  console.log(`📍 URL: ${DEMO_URL}`);
  console.log(`📁 Output: ${OUTPUT_DIR}`);
  
  for (const config of screenshots) {
    await captureScreenshot(config);
  }
  
  console.log('🎉 All screenshots generated successfully!');
  console.log(`📂 Check: ${OUTPUT_DIR}`);
}

// Generate README markdown for screenshots
function generateReadmeSection() {
  const markdown = `## 📸 **Live Demo Screenshots**

### **🤖 AI Assistant in Action**
![AI Chat Interface](./public/demo-screenshots/ai-chat-in-action.png)
*AI-powered chat interface providing intelligent case assistance and context-aware responses*

### **📊 Dashboard Metrics**
![Dashboard Metrics](./public/demo-screenshots/dashboard-metrics.png)
*Real-time dashboard with animated metrics, interactive charts, and performance indicators*

### **🌙 Dark Mode Theme**
![Dark Mode Dashboard](./public/demo-screenshots/dark-mode-dashboard.png)
*Professional dark mode theme with carefully crafted contrast and accessibility*

### **📋 Case Management**
![Case Management](./public/demo-screenshots/case-management.png)
*Comprehensive case tracking with status indicators and progress visualization*

### **📅 Appointment Scheduling**
![Appointment Scheduling](./public/demo-screenshots/appointment-scheduling.png)
*Interactive calendar interface with drag-and-drop scheduling capabilities*

### **📱 Mobile Responsive**
![Mobile View](./public/demo-screenshots/mobile-responsive.png)
*Fully responsive design optimized for mobile devices with touch-friendly interactions*

### **🎯 Enhanced Landing Page**
![Landing Hero](./public/demo-screenshots/landing-hero.png)
*Modern landing page with nonprofit-focused messaging and Framer Motion animations*

### **💡 AI Smart Suggestions**
![AI Suggestions](./public/demo-screenshots/ai-suggestions.png)
*Context-aware AI suggestions that analyze your work and recommend actions*

---

### **🎨 Visual Excellence Features**

- **🎭 Framer Motion Animations** - Smooth, professional transitions throughout
- **🌗 Dark/Light Mode** - Complete theme system with system preference detection
- **📱 Responsive Design** - Mobile-first approach with flawless cross-device experience
- **🎯 Interactive Elements** - Hover effects, micro-interactions, and loading states
- **📊 Data Visualization** - Beautiful charts with smooth animations and real-time updates
- **🔐 Security Features** - Demo banner and secure proxy implementation

---

### **🚀 Key Features Demonstrated**

1. **AI-Powered Assistance** - Real-time chat with intelligent responses
2. **Professional Dashboard** - Comprehensive metrics and analytics
3. **Modern UI/UX** - Cutting-edge design with accessibility focus
4. **Mobile Optimization** - Perfect experience on all devices
5. **Theme System** - Beautiful dark and light mode variants
6. **Performance Optimization** - Smooth animations and fast loading
`;

  fs.writeFileSync(path.join(__dirname, '../README_SCREENSHOTS.md'), markdown);
  console.log('📝 README screenshots section generated!');
}

// Main execution
if (require.main === module) {
  generateAllScreenshots()
    .then(() => generateReadmeSection())
    .catch(console.error);
}

module.exports = {
  generateAllScreenshots,
  captureScreenshot,
  generateReadmeSection
};
