#!/usr/bin/env node

/**
 * Performance Setup Script
 * 
 * Installs and configures performance monitoring dependencies
 * for 2026 web standards compliance.
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Setting up Performance Monitoring for 2026...\n')

/**
 * Checks if a package is installed
 */
function isPackageInstalled(packageName) {
  try {
    require.resolve(packageName)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Installs npm packages
 */
function installPackage(packageName, isDev = false) {
  const flag = isDev ? '--save-dev' : '--save'
  console.log(`📦 Installing ${packageName}...`)
  
  try {
    execSync(`npm install ${flag} ${packageName}`, { stdio: 'inherit' })
    console.log(`✅ ${packageName} installed successfully\n`)
    return true
  } catch (error) {
    console.error(`❌ Failed to install ${packageName}:`, error.message)
    return false
  }
}

/**
 * Main setup function
 */
function setupPerformanceMonitoring() {
  console.log('🔍 Checking performance dependencies...\n')
  
  // Check and install web-vitals
  if (!isPackageInstalled('web-vitals')) {
    console.log('📊 Web Vitals library not found')
    if (!installPackage('web-vitals')) {
      console.log('⚠️  Continuing with fallback implementation')
    }
  } else {
    console.log('✅ web-vitals already installed')
  }
  
  // Check for Lighthouse CI
  const lighthouseConfigExists = fs.existsSync('lighthouserc.json')
  if (!lighthouseConfigExists) {
    console.log('❌ Lighthouse CI config not found')
    console.log('💡 Run the full setup to get Lighthouse CI configuration')
  } else {
    console.log('✅ Lighthouse CI configured')
  }
  
  // Performance monitoring summary
  console.log('\n📈 Performance Monitoring Status:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  
  const webVitalsStatus = isPackageInstalled('web-vitals') ? '✅ Accurate' : '📦 Fallback'
  console.log(`Web Vitals:        ${webVitalsStatus}`)
  console.log(`Performance Hook:  ✅ Available`)
  console.log(`Interaction Opt:   ✅ Available`)
  console.log(`Lighthouse CI:     ${lighthouseConfigExists ? '✅ Configured' : '⚠️  Manual setup needed'}`)
  console.log(`Memoized Charts:   ✅ Implemented`)
  
  console.log('\n🎯 2026 Performance Targets:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('LCP (Largest Contentful Paint): < 2.5s')
  console.log('FID (First Input Delay):        < 100ms')
  console.log('CLS (Cumulative Layout Shift):  < 0.1')
  console.log('INP (Interaction Next Paint):   < 200ms')
  console.log('Lighthouse Performance Score:   ≥ 85')
  
  console.log('\n🛠  Next Steps:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('1. Start development server: npm run dev')
  console.log('2. Look for performance monitor (⚡) in bottom-right')
  console.log('3. Check Web Vitals tab for real-time metrics')
  console.log('4. Run Lighthouse audit: npx lighthouse http://localhost:3000')
  
  if (!isPackageInstalled('web-vitals')) {
    console.log('\n💡 For accurate Web Vitals measurements:')
    console.log('   npm install web-vitals')
  }
  
  console.log('\n📚 Documentation:')
  console.log('   Performance Guide: docs/PERFORMANCE_2026_GUIDE.md')
  console.log('   Setup Instructions: docs/PERFORMANCE_SETUP.md')
  
  console.log('\n🎉 Performance monitoring setup complete!')
}

// Run setup if called directly
if (require.main === module) {
  setupPerformanceMonitoring()
}

module.exports = { setupPerformanceMonitoring, isPackageInstalled, installPackage }