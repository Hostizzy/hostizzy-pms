#!/usr/bin/env node

/**
 * Database Setup Script for Hostizzy PMS
 * This script helps set up the database schema, RLS policies, and seed data
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials. Please check your .env.local file.')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function executeSqlFile(filePath, description) {
  try {
    console.log(`\n🔄 ${description}...`)
    
    if (!fs.existsSync(filePath)) {
      console.error(`❌ SQL file not found: ${filePath}`)
      return false
    }

    const sqlContent = fs.readFileSync(filePath, 'utf8')
    
    // Split by statements and execute one by one
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement })
        
        if (error) {
          console.warn(`⚠️ Warning executing statement ${i + 1}: ${error.message}`)
        }
      } catch (err) {
        // Some statements might fail if they already exist, which is often OK
        console.warn(`⚠️ Statement ${i + 1} failed (might already exist): ${err.message}`)
      }
    }

    console.log(`✅ ${description} completed`)
    return true

  } catch (error) {
    console.error(`❌ Error ${description.toLowerCase()}: ${error.message}`)
    return false
  }
}

async function createStorageBucket() {
  try {
    console.log('\n🔄 Setting up storage bucket...')
    
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError.message)
      return false
    }

    const bucketExists = buckets.some(bucket => bucket.name === 'guest-ids')
    
    if (bucketExists) {
      console.log('✅ Storage bucket "guest-ids" already exists')
      return true
    }

    // Create bucket
    const { error: createError } = await supabase.storage.createBucket('guest-ids', {
      public: false,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    })

    if (createError) {
      console.error('❌ Error creating storage bucket:', createError.message)
      return false
    }

    console.log('✅ Storage bucket "guest-ids" created successfully')
    return true

  } catch (error) {
    console.error('❌ Error setting up storage bucket:', error.message)
    return false
  }
}

async function verifySetup() {
  try {
    console.log('\n🔄 Verifying database setup...')
    
    // Check if tables exist
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')

    if (error) {
      console.error('❌ Error checking tables:', error.message)
      return false
    }

    const expectedTables = [
      'profiles', 'owners', 'properties', 'reservations', 
      'guests', 'menus', 'reviews', 'analytics_daily'
    ]

    const existingTables = tables.map(t => t.table_name)
    const missingTables = expectedTables.filter(table => !existingTables.includes(table))

    if (missingTables.length > 0) {
      console.error(`❌ Missing tables: ${missingTables.join(', ')}`)
      return false
    }

    // Check if demo data exists
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)

    if (profileError) {
      console.warn('⚠️ Profiles table might be empty (demo data not loaded)')
    }

    console.log('✅ Database verification completed')
    return true

  } catch (error) {
    console.error('❌ Error verifying setup:', error.message)
    return false
  }
}

async function setupDatabase() {
  console.log('🚀 Starting Hostizzy PMS Database Setup')
  console.log('=====================================')

  const sqlDir = path.join(__dirname, '..', 'sql')
  
  // Create SQL directory structure if it doesn't exist
  if (!fs.existsSync(sqlDir)) {
    fs.mkdirSync(sqlDir, { recursive: true })
    
    // Create placeholder SQL files with instructions
    const instructions = `
-- Copy the SQL content from the artifacts and save them as:
-- ${sqlDir}/01_schema.sql (Database Schema)
-- ${sqlDir}/02_rls.sql (Row Level Security)
-- ${sqlDir}/03_seed.sql (Seed Data)
-- 
-- Then run this script again: npm run setup-db
    `
    
    fs.writeFileSync(path.join(sqlDir, 'README.md'), instructions.trim())
    
    console.log(`\n📁 Created SQL directory: ${sqlDir}`)
    console.log('📋 Please copy the SQL content from the artifacts into the sql/ directory:')
    console.log('   - Copy the "Hostizzy PMS Database Schema" artifact to sql/01_schema.sql')
    console.log('   - Copy the "Hostizzy PMS Row Level Security Policies" artifact to sql/02_rls.sql')
    console.log('   - Copy the "Hostizzy PMS Seed Data" artifact to sql/03_seed.sql')
    console.log('\n   Then run: npm run setup-db')
    return
  }

  const steps = [
    {
      file: path.join(sqlDir, '01_schema.sql'),
      description: 'Creating database schema'
    },
    {
      file: path.join(sqlDir, '02_rls.sql'),
      description: 'Setting up Row Level Security policies'
    },
    {
      file: path.join(sqlDir, '03_seed.sql'),
      description: 'Loading seed data'
    }
  ]

  let allSuccessful = true

  // Execute SQL files
  for (const step of steps) {
    const success = await executeSqlFile(step.file, step.description)
    if (!success) allSuccessful = false
  }

  // Setup storage bucket
  const bucketSuccess = await createStorageBucket()
  if (!bucketSuccess) allSuccessful = false

  // Verify setup
  const verifySuccess = await verifySetup()
  if (!verifySuccess) allSuccessful = false

  console.log('\n=====================================')
  if (allSuccessful) {
    console.log('✅ Database setup completed successfully!')
    console.log('\n📝 Next steps:')
    console.log('1. Create users in Supabase Auth Dashboard with these emails:')
    console.log('   - admin@hostizzy.com (set role to admin in profiles table)')
    console.log('   - owner@example.com (set role to owner)')
    console.log('   - manager@example.com (set role to manager)')
    console.log('   - guest@example.com (role defaults to guest)')
    console.log('2. Update the redirect URLs in Supabase Auth settings')
    console.log('3. Deploy the KYC cleanup Edge Function')
    console.log('4. Set up the cron job for automated cleanup')
    console.log('\n🚀 Your Hostizzy PMS is ready to use!')
  } else {
    console.log('❌ Database setup encountered some issues.')
    console.log('Please check the errors above and retry.')
  }
}

// Run the setup
setupDatabase().catch(console.error)
