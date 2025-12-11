#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Environment Variables Information Script
 * 
 * This script helps you share environment variable information safely
 * by showing the structure without exposing actual values.
 */

const fs = require('fs');
const path = require('path');

function getEnvInfo() {
  const envPath = path.join(process.cwd(), '.env.local');

  if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local file not found');
    console.log('📝 Create a .env.local file based on ENVIRONMENT_SETUP.md');
    return;
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');

  console.log('🔧 Environment Variables Structure:');
  console.log('=====================================\n');

  const envVars = [];

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    // Skip empty lines and comments
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      if (trimmedLine.startsWith('#')) {
        console.log(`📝 ${trimmedLine}`);
      }
      return;
    }

    // Parse environment variable
    const equalIndex = trimmedLine.indexOf('=');
    if (equalIndex > 0) {
      const key = trimmedLine.substring(0, equalIndex);
      const value = trimmedLine.substring(equalIndex + 1);

      envVars.push({
        key,
        hasValue: value.length > 0,
        valueLength: value.length,
        isSecret: isSecretKey(key)
      });

      // Show structure without actual values
      if (isSecretKey(key)) {
        console.log(`🔐 ${key}=[HIDDEN - ${value.length} characters]`);
      } else {
        console.log(`📋 ${key}=[${value.length > 0 ? 'SET' : 'EMPTY'}]`);
      }
    }
  });

  console.log('\n📊 Summary:');
  console.log('===========');
  console.log(`Total variables: ${envVars.length}`);
  console.log(`Secret variables: ${envVars.filter(v => v.isSecret).length}`);
  console.log(`Variables with values: ${envVars.filter(v => v.hasValue).length}`);
  console.log(`Empty variables: ${envVars.filter(v => !v.hasValue).length}`);

  console.log('\n🔐 Secret Variables:');
  envVars.filter(v => v.isSecret).forEach(v => {
    console.log(`  - ${v.key}`);
  });

  console.log('\n⚠️  Empty Variables:');
  envVars.filter(v => !v.hasValue).forEach(v => {
    console.log(`  - ${v.key}`);
  });
}

function isSecretKey(key) {
  const secretKeywords = [
    'secret', 'password', 'token', 'key', 'auth', 'private',
    'credential', 'api', 'access', 'refresh', 'session'
  ];

  return secretKeywords.some(keyword =>
    key.toLowerCase().includes(keyword)
  );
}

// Run the script
getEnvInfo();
