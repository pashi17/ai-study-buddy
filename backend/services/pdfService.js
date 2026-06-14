const fs = require('fs');
const path = require('path');

/**
 * Extract text from a PDF or TXT file
 * @param {string} filePath - absolute path to the file
 * @returns {Promise<string>} extracted text
 */
const extractTextFromFile = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.txt') {
    return fs.readFileSync(filePath, 'utf-8');
  }

  if (ext === '.pdf') {
    // Dynamically require pdf-parse to avoid startup issues
    const pdfParse = require('pdf-parse');
    const fileBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(fileBuffer);
    return data.text;
  }

  throw new Error('Unsupported file type. Only PDF and TXT are supported.');
};

/**
 * Clean up uploaded file after processing
 * @param {string} filePath
 */
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.warn(`Warning: Could not delete file ${filePath}:`, err.message);
  }
};

module.exports = { extractTextFromFile, deleteFile };
