#!/usr/bin/env node
'use strict';

const bcrypt = require('bcryptjs');
const readline = require('node:readline');
const { PrismaClient } = require('@prisma/client');

const MIN_PASSWORD_LENGTH = 12;
const BCRYPT_ROUNDS = 12;
const BANNED_SUBSTRINGS = ['eduexpress', 'password', 'admin123', '123456', 'qwerty'];

/**
 * Validate admin email format.
 * @param {string} email
 * @returns {string}
 */
function normalizeAndValidateEmail(email) {
  const normalized = String(email || '').toLowerCase().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(normalized)) {
    throw new Error('A valid admin email address is required.');
  }
  return normalized;
}

/**
 * Enforce strong admin password rules and reject predictable/brand defaults.
 * @param {string} password
 */
function validateAdminPassword(password) {
  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
  }
  if (password.length > 256) {
    throw new Error('Password must not exceed 256 characters.');
  }
  const lower = password.toLowerCase();
  for (const banned of BANNED_SUBSTRINGS) {
    if (lower.includes(banned)) {
      throw new Error('Password cannot contain predictable defaults or brand/common words.');
    }
  }
  const classes = [
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  // Allow long passphrases (>= 20 chars) with at least 2 classes, or >= 12 chars with 3+ classes.
  if (password.length < 20 && classes < 3) {
    throw new Error(
      'Password must include at least 3 character types (uppercase, lowercase, number, symbol) or be a 20+ character passphrase.'
    );
  }
  if (classes < 2) {
    throw new Error('Passphrase must contain at least 2 character types.');
  }
}

/**
 * Parse CLI arguments (`--email=...`, `--name=...`, `--role=...`, `--super-admin`).
 * Password is read via prompt or transient ADMIN_PASSWORD env var (never logged).
 * @param {string[]} argv
 */
function parseSeedArgs(argv) {
  const opts = {
    email: process.env.ADMIN_EMAIL || '',
    name: process.env.ADMIN_NAME || 'Admin',
    role: process.env.ADMIN_ROLE === 'super_admin' ? 'super_admin' : 'admin',
  };
  for (const arg of argv) {
    if (arg === '--super-admin') opts.role = 'super_admin';
    else if (arg.startsWith('--email=')) opts.email = arg.slice('--email='.length);
    else if (arg.startsWith('--name=')) opts.name = arg.slice('--name='.length);
    else if (arg.startsWith('--role=')) {
      const role = arg.slice('--role='.length);
      if (role !== 'admin' && role !== 'super_admin') {
        throw new Error('Role must be admin or super_admin.');
      }
      opts.role = role;
    }
  }
  return opts;
}

function promptHidden(question) {
  return new Promise((resolve, reject) => {
    if (!process.stdin.isTTY) {
      reject(new Error('Provide ADMIN_PASSWORD transiently (e.g., ADMIN_PASSWORD=... npm run seed:admin) when stdin is not a TTY.'));
      return;
    }
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    const origWrite = rl._writeToOutput;
    rl._writeToOutput = function maskedWrite(str) {
      if (str.startsWith(question)) origWrite.call(rl, question);
      else if (str === '\r\n' || str === '\n' || str === '\r') origWrite.call(rl, str);
    };
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function runSeedAdmin(argv = process.argv.slice(2)) {
  require('dotenv/config');
  const opts = parseSeedArgs(argv);
  const email = normalizeAndValidateEmail(opts.email || 'admin@eduexpressint.com');
  const password = process.env.ADMIN_PASSWORD || (await promptHidden(`Enter new password for ${email}: `));
  validateAdminPassword(password);

  const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const prisma = new PrismaClient();
  try {
    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name: String(opts.name || 'Admin').trim() || 'Admin',
        password: hashedPassword,
        role: opts.role,
      },
      create: {
        name: String(opts.name || 'Admin').trim() || 'Admin',
        email,
        password: hashedPassword,
        role: opts.role,
      },
      select: { id: true, email: true, role: true },
    });
    console.log(`${existing ? 'Updated' : 'Created'} ${user.role} account for ${user.email} (${user.id}).`);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  runSeedAdmin().catch((err) => {
    console.error('seed:admin failed:', err.message || err);
    process.exit(1);
  });
}

module.exports = {
  MIN_PASSWORD_LENGTH,
  normalizeAndValidateEmail,
  validateAdminPassword,
  parseSeedArgs,
};
