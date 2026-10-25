import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../config/db.js';
import { Bus } from '../models/Bus.js';
import { Booking } from '../models/Booking.js';
import { User } from '../models/User.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const buses = JSON.parse(readFileSync(path.join(__dirname, 'buses.json'), 'utf-8'));

const DEMO_USER = {
  name: 'Demo User',
  email: 'demo@uniquetravels.com',
  password: 'demo1234',
  mobile: '9876543210',
  gender: 'Male'
};

const run = async () => {
  await connectDatabase();

  await Promise.all([
    Bus.deleteMany({}),
    Booking.deleteMany({}),
    Bus.syncIndexes(),
    Booking.syncIndexes(),
    User.syncIndexes()
  ]);

  await Bus.insertMany(buses);
  console.log(`[seed] inserted ${buses.length} buses`);

  const password = await bcrypt.hash(DEMO_USER.password, 10);
  await User.findOneAndUpdate(
    { email: DEMO_USER.email },
    { ...DEMO_USER, password },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );
  console.log(`[seed] demo account ready: ${DEMO_USER.email} / ${DEMO_USER.password}`);

  await disconnectDatabase();
  console.log('[seed] completed');
};

run().catch(async error => {
  console.error('[seed] failed:', error);
  await disconnectDatabase().catch(() => {});
  process.exit(1);
});
