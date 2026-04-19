import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'
import { readFileSync } from 'fs'
import path from 'path'

// Load environment variables
dotenv.config()

const getDatabase = () => {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    throw new Error('DATABASE_URL is not defined in environment variables')
  }
  return neon(dbUrl)
}

async function runSampleData() {
  try {
    console.log('Running sample data script...')
    
    const sql = getDatabase()
    
    // First create the table if it doesn't exist
    console.log('Creating exam_resources table...')
    await sql`
      CREATE TABLE IF NOT EXISTS exam_resources (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title TEXT NOT NULL,
          category TEXT NOT NULL CHECK (category IN ('WRITTEN_EXAM', 'INTERVIEW_PREP')),
          content_type TEXT NOT NULL CHECK (content_type IN ('TEXT', 'PDF_URL')),
          text_content TEXT,
          file_url TEXT,
          institution TEXT NOT NULL,
          featured BOOLEAN DEFAULT false,
          estimated_reading_time INTEGER,
          view_count INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `
    
    // Create indexes
    console.log('Creating indexes...')
    await sql`CREATE INDEX IF NOT EXISTS idx_exam_resources_category ON exam_resources(category);`
    await sql`CREATE INDEX IF NOT EXISTS idx_exam_resources_institution ON exam_resources(institution);`
    await sql`CREATE INDEX IF NOT EXISTS idx_exam_resources_featured ON exam_resources(featured);`
    await sql`CREATE INDEX IF NOT EXISTS idx_exam_resources_created_at ON exam_resources(created_at DESC);`
    
    // Insert sample data
    console.log('Inserting sample data...')
    
    // Sample Written Exam Resources
    await sql`
      INSERT INTO exam_resources (title, category, content_type, text_content, institution, featured, estimated_reading_time) VALUES
      (
        'RRA Revenue Officer Written Exam - Past Paper 2024',
        'WRITTEN_EXAM',
        'TEXT',
        '<h2>Rwanda Revenue Authority - Revenue Officer Examination</h2>
        
        <h3>Section A: Multiple Choice Questions</h3>
        
        <p><strong>1. What is the primary function of the Rwanda Revenue Authority?</strong></p>
        <p>A) To regulate banking services<br>
        B) To collect taxes and customs duties<br>
        C) To issue business licenses<br>
        D) To manage foreign exchange</p>
        <p><strong>Answer: B</strong></p>
        
        <p><strong>2. Which tax is levied on the sale of goods and services in Rwanda?</strong></p>
        <p>A) Income Tax<br>
        B) Property Tax<br>
        C) Value Added Tax (VAT)<br>
        D) Customs Duty</p>
        <p><strong>Answer: C</strong></p>
        
        <h3>Section B: Short Answer Questions</h3>
        
        <p><strong>3. List three types of taxes administered by RRA.</strong></p>
        <p><em>Answer:</em> Income Tax, Value Added Tax (VAT), Customs Duty, Excise Tax, etc.</p>
        
        <p><strong>4. What is the current VAT rate in Rwanda?</strong></p>
        <p><em>Answer:</em> 18% (as of 2024)</p>
        
        <h3>Section C: Essay Question</h3>
        
        <p><strong>5. Discuss the importance of tax compliance for Rwanda''s economic development.</strong></p>
        <p><em>Answer:</em> Tax compliance is crucial for Rwanda''s economic development as it provides the government with necessary funds to finance public services, infrastructure development, and social programs. Proper tax collection ensures sustainable public finance, reduces dependence on foreign aid, and enables the country to achieve its development goals as outlined in Vision 2050.</p>',
        'Rwanda Revenue Authority (RRA)',
        true,
        15
      )
    `
    
    await sql`
      INSERT INTO exam_resources (title, category, content_type, text_content, institution, featured, estimated_reading_time) VALUES
      (
        'Bank of Kiguli Banking Operations Assessment',
        'WRITTEN_EXAM',
        'TEXT',
        '<h2>Bank of Kiguli - Banking Operations Assessment</h2>
        
        <h3>Part 1: Banking Fundamentals</h3>
        
        <p><strong>1. What is the primary role of commercial banks in Rwanda?</strong></p>
        <p>Commercial banks serve as financial intermediaries, accepting deposits from customers and providing loans to individuals and businesses. They facilitate economic growth by mobilizing savings and providing credit for productive activities.</p>
        
        <p><strong>2. List five core banking services offered by Bank of Kiguli:</strong></p>
        <p>1. Current Accounts<br>
        2. Savings Accounts<br>
        3. Loan Products<br>
        4. Foreign Exchange Services<br>
        5. Mobile Banking Services</p>
        
        <h3>Part 2: Regulatory Compliance</h3>
        
        <p><strong>3. What is the role of the National Bank of Rwanda (BNR)?</strong></p>
        <p>The National Bank of Rwanda serves as the central bank, responsible for monetary policy, banking supervision, and maintaining financial stability in the country.</p>
        
        <p><strong>4. Explain KYC (Know Your Customer) requirements:</strong></p>
        <p>KYC procedures require banks to verify customer identity to prevent fraud, money laundering, and terrorist financing. This includes obtaining identification documents and understanding the nature of customer relationships.</p>',
        'Bank of Kiguli',
        false,
        12
      )
    `
    
    // Sample Interview Preparation Resources
    await sql`
      INSERT INTO exam_resources (title, category, content_type, text_content, institution, featured, estimated_reading_time) VALUES
      (
        'RRA Interview Preparation Guide - Revenue Officer Position',
        'INTERVIEW_PREP',
        'TEXT',
        '<h2>RRA Revenue Officer Interview Preparation Guide</h2>
        
        <h3>Common Interview Questions & Answers</h3>
        
        <h4>1. "Tell me about yourself."</h4>
        <p><strong>Sample Answer:</strong><br>
        "I am a dedicated professional with a strong background in finance and administration. I hold a Bachelor''s degree in Business Administration and have experience working in customer service roles where I developed strong communication and problem-solving skills. I am particularly interested in public service and believe that working at RRA would allow me to contribute to Rwanda''s economic development while utilizing my analytical skills and attention to detail."</p>
        
        <h4>2. "Why do you want to work for Rwanda Revenue Authority?"</h4>
        <p><strong>Sample Answer:</strong><br>
        "I want to work for RRA because I believe in the importance of public service and contributing to our country''s development. RRA plays a crucial role in nation-building by ensuring tax compliance and revenue collection. I am impressed by RRA''s commitment to modernization and digital transformation, and I want to be part of an organization that is making a tangible impact on Rwanda''s economy."</p>
        
        <h3>Interview Tips</h3>
        <ul>
          <li>Research RRA''s recent initiatives and achievements</li>
          <li>Prepare examples of your past achievements</li>
          <li>Dress professionally and arrive early</li>
          <li>Prepare thoughtful questions to ask the interviewers</li>
          <li>Follow up with a thank-you email within 24 hours</li>
        </ul>',
        'Rwanda Revenue Authority (RRA)',
        true,
        20
      )
    `
    
    await sql`
      INSERT INTO exam_resources (title, category, content_type, text_content, institution, featured, estimated_reading_time) VALUES
      (
        'Irembo Digital Services Interview Guide',
        'INTERVIEW_PREP',
        'TEXT',
        '<h2>Irembo Digital Services Interview Preparation</h2>
        
        <h3>Company Background</h3>
        <p>Irembo is Rwanda''s leading digital government services platform, revolutionizing how citizens access public services. As a technology-driven organization, Irembo focuses on innovation, efficiency, and customer satisfaction.</p>
        
        <h3>Common Interview Questions</h3>
        
        <h4>1. "What interests you about working in digital government services?"</h4>
        <p><strong>Sample Answer:</strong><br>
        "I am passionate about technology that makes a real difference in people''s lives. Irembo''s mission to digitize government services aligns with my interest in using technology for social impact. The opportunity to contribute to making public services more accessible and efficient for Rwandan citizens is very motivating to me."</p>
        
        <h3>Technical Assessment Preparation</h3>
        
        <h4>Digital Literacy Questions:</h4>
        <ul>
          <li>Understanding of digital payment systems</li>
          <li>Knowledge of cybersecurity basics</li>
          <li>Familiarity with mobile app functionality</li>
          <li>Customer service in digital channels</li>
        </ul>',
        'Irembo',
        false,
        18
      )
    `
    
    // Sample PDF URL Resource
    await sql`
      INSERT INTO exam_resources (title, category, content_type, file_url, institution, featured, estimated_reading_time) VALUES
      (
        'RRA Complete Tax Guide - Official Documentation',
        'WRITTEN_EXAM',
        'PDF_URL',
        'https://www.rra.gov.rw/fileadmin/documents/Tax_Guide_2024.pdf',
        'Rwanda Revenue Authority (RRA)',
        true,
        30
      )
    `
    
    console.log('Sample data inserted successfully!')
    console.log('You now have 5 sample resources to test the system.')
    
    // Verify the data was inserted
    const count = await sql`SELECT COUNT(*) as count FROM exam_resources`
    console.log(`Total resources in database: ${count[0].count}`)
    
  } catch (error) {
    console.error('Error running sample data script:', error)
    process.exit(1)
  }
}

runSampleData()
