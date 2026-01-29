/**
 * Test script to verify deployment configuration
 * Run this script to check if your deployment setup is correct
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Women Awareness App Deployment Setup...\n');

// Check if required files exist
const requiredFiles = [
  'netlify.toml',
  'render.yaml',
  'DEPLOYMENT_GUIDE.md',
  'client/package.json',
  'server/package.json',
  'server/app.js',
  'client/src/main.jsx'
];

console.log('📁 Checking required files:');
let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

// Check package.json scripts
console.log('\n📦 Checking package.json scripts:');

try {
  const clientPackage = JSON.parse(fs.readFileSync('client/package.json', 'utf8'));
  const serverPackage = JSON.parse(fs.readFileSync('server/package.json', 'utf8'));

  // Check client scripts
  const clientScripts = clientPackage.scripts;
  const requiredClientScripts = ['dev', 'build', 'preview'];
  
  console.log('Client scripts:');
  requiredClientScripts.forEach(script => {
    if (clientScripts[script]) {
      console.log(`✅ ${script}: ${clientScripts[script]}`);
    } else {
      console.log(`❌ ${script} - MISSING`);
      allFilesExist = false;
    }
  });

  // Check server scripts
  const serverScripts = serverPackage.scripts;
  const requiredServerScripts = ['start', 'dev'];
  
  console.log('Server scripts:');
  requiredServerScripts.forEach(script => {
    if (serverScripts[script]) {
      console.log(`✅ ${script}: ${serverScripts[script]}`);
    } else {
      console.log(`❌ ${script} - MISSING`);
      allFilesExist = false;
    }
  });

} catch (error) {
  console.log('❌ Error reading package.json files');
  allFilesExist = false;
}

// Check deployment configuration
console.log('\n⚙️  Checking deployment configuration:');

try {
  const netlifyConfig = fs.readFileSync('netlify.toml', 'utf8');
  const renderConfig = fs.readFileSync('render.yaml', 'utf8');

  // Check Netlify config
  if (netlifyConfig.includes('base = "client"') && 
      netlifyConfig.includes('command = "npm run build"') &&
      netlifyConfig.includes('publish = "dist"')) {
    console.log('✅ Netlify configuration looks correct');
  } else {
    console.log('❌ Netlify configuration issues found');
    allFilesExist = false;
  }

  // Check Render config
  if (renderConfig.includes('type: web') && 
      renderConfig.includes('name: women-awareness-api') &&
      renderConfig.includes('buildCommand: npm install')) {
    console.log('✅ Render configuration looks correct');
  } else {
    console.log('❌ Render configuration issues found');
    allFilesExist = false;
  }

} catch (error) {
  console.log('❌ Error reading deployment configuration files');
  allFilesExist = false;
}

// Final result
console.log('\n🎯 Deployment Setup Summary:');
if (allFilesExist) {
  console.log('✅ All checks passed! Your deployment setup is ready.');
  console.log('\n🚀 Next steps:');
  console.log('1. Set up MongoDB Atlas (database)');
  console.log('2. Push to GitHub');
  console.log('3. Deploy to Render (backend)');
  console.log('4. Deploy to Netlify (frontend)');
  console.log('5. Configure environment variables');
  console.log('\n📖 See DEPLOYMENT_GUIDE.md for detailed instructions');
} else {
  console.log('❌ Some issues found. Please fix the missing files or configurations before deploying.');
}

console.log('\n✨ Happy deploying! ✨');