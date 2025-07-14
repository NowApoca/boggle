const fs = require('fs');
const path = require('path');

// Read the words file
const wordsFilePath = path.join(__dirname, 'words');
const outputFilePath = path.join(__dirname, 'words.js');

try {
    // Read the words file
    const content = fs.readFileSync(wordsFilePath, 'utf8');
    
    // Split by lines and filter words between 3 and 16 characters
    const words = content
        .split('\n')
        .map(word => word.trim())
        .filter(word => word.length >= 4 && word.length <= 16);
    
    // Create the JavaScript array content
    const jsContent = `// Words between 3 and 16 characters
const words = ${JSON.stringify(words, null, 2)};

module.exports = words;`;
    
    // Write to words.js file
    fs.writeFileSync(outputFilePath, jsContent, 'utf8');
    
    console.log(`Successfully processed ${words.length} words between 3 and 16 characters.`);
    console.log(`Output saved to: ${outputFilePath}`);
    
} catch (error) {
    console.error('Error processing words file:', error.message);
    process.exit(1);
}
