import { getMigrations } from 'better-auth/db/migration'
import { auth } from './auth.js'
import { pool } from './db.js'

async function migrateAuth() {
  const { runMigrations, toBeCreated, toBeAdded } = await getMigrations(auth.options)
  if (toBeCreated.length === 0 && toBeAdded.length === 0) {
    console.log('Auth schema already up to date.')
  } else {
    await runMigrations()
    console.log('Auth schema applied.')
  }
  await pool.end()
}

migrateAuth().catch((err) => {
  console.error('Auth migration failed:', err)
  process.exit(1)
})
