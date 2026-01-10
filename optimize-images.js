// Image Optimization Script
import sharp from 'sharp';
import fs from 'fs';

async function optimizeImages() {
  console.log('🚀 Starting image optimization...\n');

  try {
    // Optimize logo (1024x1024 → 80x80)
    console.log('📸 Optimizing SeifMohsenLogo.png...');
    await sharp('public/SeifMohsenLogo.png')
      .resize(80, 80, { fit: 'cover', position: 'center' })
      .png({ quality: 90, compressionLevel: 9 })
      .toFile('public/SeifMohsenLogo-optimized.png');
    
    const logoOriginal = fs.statSync('public/SeifMohsenLogo.png').size;
    const logoOptimized = fs.statSync('public/SeifMohsenLogo-optimized.png').size;
    console.log(`   ✅ Saved: ${((logoOriginal-logoOptimized)/1024).toFixed(1)} KB\n`);

    // Create WebP version
    console.log('📸 Creating WebP version of saif-salesforce.jpg...');
    await sharp('public/saif-salesforce.jpg')
      .resize(800, 800, { fit: 'cover' })
      .webp({ quality: 85 })
      .toFile('public/saif-salesforce.webp');
    
    // Create optimized JPG
    await sharp('public/saif-salesforce.jpg')
      .resize(800, 800, { fit: 'cover' })
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile('public/saif-salesforce-optimized.jpg');
    
    console.log('   ✅ Done!\n');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

optimizeImages();
