import { sql } from '../lib/db.js';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function convertBase64Logos() {
  try {
    console.log('🔄 Converting base64 logos to files...');
    
    // Get all companies with base64 logos
    const result = await sql`
      SELECT id, name, logo
      FROM companies
      WHERE logo LIKE 'data:image/%'
    `;
    
    console.log(`📊 Found ${result.length} companies with base64 logos`);
    
    for (const company of result) {
      if (!company.logo || !company.logo.startsWith('data:image/')) {
        continue;
      }
      
      try {
        // Extract image type and data
        const matches = company.logo.match(/^data:image\/(\w+);base64,(.+)$/);
        if (!matches) {
          console.log(`⚠️ Invalid base64 format for company ${company.id}`);
          continue;
        }
        
        const imageType = matches[1];
        const base64Data = matches[2];
        
        // Create filename
        const filename = `company-${company.id}.${imageType}`;
        const filePath = path.join(process.cwd(), 'public', 'logos', filename);
        
        // Ensure directory exists
        const logoDir = path.join(process.cwd(), 'public', 'logos');
        if (!fs.existsSync(logoDir)) {
          fs.mkdirSync(logoDir, { recursive: true });
        }
        
        // Convert base64 to file
        fs.writeFileSync(filePath, base64Data, 'base64');
        
        // Update database with new URL
        const newLogoUrl = `/logos/${filename}`;
        await sql`
          UPDATE companies
          SET logo = ${newLogoUrl}
          WHERE id = ${company.id}
        `;
        
        console.log(`✅ Converted ${company.name} logo: ${filename}`);
        
      } catch (error) {
        console.error(`❌ Error converting ${company.name} logo:`, error);
      }
    }
    
    console.log('✅ Base64 logo conversion completed');
    
  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

// Run the conversion
convertBase64Logos();
