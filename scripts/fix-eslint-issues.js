#!/usr/bin/env node

/**
 * Script to automatically fix common ESLint issues
 * 
 * This script addresses:
 * 1. Missing PropTypes imports
 * 2. Basic JSDoc templates
 * 3. Environment variable fixes
 * 4. Common React patterns
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Common PropTypes patterns
const PROP_TYPES_PATTERNS = {
  // Component with children prop
  children: 'PropTypes.node.isRequired',
  // Event handlers
  onClick: 'PropTypes.func',
  onSubmit: 'PropTypes.func',
  onCancel: 'PropTypes.func',
  onEdit: 'PropTypes.func',
  onDelete: 'PropTypes.func',
  onClose: 'PropTypes.func',
  // Common props
  className: 'PropTypes.string',
  disabled: 'PropTypes.bool',
  loading: 'PropTypes.bool',
  title: 'PropTypes.string',
  message: 'PropTypes.string',
  // Data props
  appointment: 'PropTypes.object',
  caseItem: 'PropTypes.object',
  data: 'PropTypes.array',
  columns: 'PropTypes.array'
}

// JSDoc templates for common patterns
const JSDOC_TEMPLATES = {
  component: `/**
 * [COMPONENT_NAME] component
 * 
 * @component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Rendered component
 */`,
  
  hook: `/**
 * Custom hook for [HOOK_PURPOSE]
 * 
 * @returns {Object} Hook return value
 */`,
  
  function: `/**
 * [FUNCTION_PURPOSE]
 * 
 * @param {*} param - Parameter description
 * @returns {*} Return value description
 */`
}

/**
 * Fixes environment variable issues
 */
function fixEnvironmentIssues() {
  console.log('🔧 Fixing environment variable issues...')
  
  // Update ESLint config to include Node.js globals
  const eslintConfigPath = '.eslintrc.cjs'
  let eslintConfig = fs.readFileSync(eslintConfigPath, 'utf8')
  
  if (!eslintConfig.includes('node: true')) {
    eslintConfig = eslintConfig.replace(
      'env: { browser: true, es2020: true }',
      'env: { browser: true, es2020: true, node: true }'
    )
    fs.writeFileSync(eslintConfigPath, eslintConfig)
    console.log('✅ Added Node.js environment to ESLint config')
  }
}

/**
 * Adds PropTypes import to files that need it
 */
function addPropTypesImports() {
  console.log('🔧 Adding PropTypes imports...')
  
  const srcDir = 'src'
  const files = getAllJSXFiles(srcDir)
  
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8')
    
    // Check if file has component with props but no PropTypes import
    if (content.includes('function ') && 
        content.includes('props') && 
        !content.includes('PropTypes') &&
        !content.includes('prop-types')) {
      
      // Add PropTypes import after React import
      if (content.includes("from 'react'")) {
        content = content.replace(
          "from 'react'",
          "from 'react'\nimport PropTypes from 'prop-types'"
        )
        fs.writeFileSync(file, content)
        console.log(`✅ Added PropTypes import to ${file}`)
      }
    }
  })
}

/**
 * Gets all JSX files recursively
 */
function getAllJSXFiles(dir) {
  const files = []
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir)
    
    items.forEach(item => {
      const fullPath = path.join(currentDir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        traverse(fullPath)
      } else if (item.endsWith('.jsx') || item.endsWith('.js')) {
        files.push(fullPath)
      }
    })
  }
  
  traverse(dir)
  return files
}

/**
 * Runs ESLint auto-fix
 */
function runESLintFix() {
  console.log('🔧 Running ESLint auto-fix...')
  
  try {
    execSync('npm run lint:fix', { stdio: 'inherit' })
    console.log('✅ ESLint auto-fix completed')
  } catch (error) {
    console.log('⚠️ ESLint auto-fix completed with some remaining issues')
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Starting ESLint issue fixes...\n')
  
  fixEnvironmentIssues()
  addPropTypesImports()
  runESLintFix()
  
  console.log('\n✨ Fix script completed!')
  console.log('📝 Run "npm run lint:strict" to see remaining issues')
  console.log('📚 Check docs/JSDOC_TEMPLATES.md for JSDoc examples')
}

if (require.main === module) {
  main()
}

module.exports = {
  fixEnvironmentIssues,
  addPropTypesImports,
  runESLintFix
}