/**
 * Validates South African ID numbers
 * Format: YYMMDDGSSSCAZ (13 digits)
 * - YYMMDD: Date of birth
 * - G: Gender (0-4 = female, 5-9 = male)
 * - SSS: Sequence number
 * - C: Citizenship (0 = SA, 1 = other)
 * - A: Race (deprecated, but still in format)
 * - Z: Check digit
 */

export interface SAIDValidationResult {
  isValid: boolean;
  error?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female';
}

export function validateSAID(idNumber: string): SAIDValidationResult {
  // Remove any whitespace
  idNumber = idNumber.trim().replace(/\s/g, '');

  // Check length
  if (idNumber.length !== 13) {
    return { isValid: false, error: 'ID number must be exactly 13 digits' };
  }

  // Check if all digits
  if (!/^\d+$/.test(idNumber)) {
    return { isValid: false, error: 'ID number must contain only digits' };
  }

  // Extract date components
  const year = parseInt(idNumber.substring(0, 2));
  const month = parseInt(idNumber.substring(2, 4));
  const day = parseInt(idNumber.substring(4, 6));
  const genderDigit = parseInt(idNumber.substring(6, 7));
  const citizenship = parseInt(idNumber.substring(10, 11));
  const checkDigit = parseInt(idNumber.substring(12, 13));

  // Determine full year (00-20 = 2000-2020, 21-99 = 1921-1999)
  const fullYear = year <= 20 ? 2000 + year : 1900 + year;

  // Validate date
  const dateOfBirth = new Date(fullYear, month - 1, day);
  if (
    dateOfBirth.getFullYear() !== fullYear ||
    dateOfBirth.getMonth() !== month - 1 ||
    dateOfBirth.getDate() !== day
  ) {
    return { isValid: false, error: 'Invalid date of birth in ID number' };
  }

  // Validate gender digit
  if (genderDigit < 0 || genderDigit > 9) {
    return { isValid: false, error: 'Invalid gender digit' };
  }

  // Validate citizenship
  if (citizenship !== 0 && citizenship !== 1) {
    return { isValid: false, error: 'Invalid citizenship digit' };
  }

  // Validate check digit using Luhn algorithm (really cool way south african id numbers are validated)
  // Process from RIGHT to LEFT (excluding check digit at position 12)
  // Double every 2nd digit starting from the right (positions 1, 3, 5, 7, 9, 11 from right)
  // When counting from left (0-indexed), these are positions: 11, 9, 7, 5, 3, 1 (odd indices)
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    let digit = parseInt(idNumber[i]);
    // From right: position 1, 3, 5, 7, 9, 11 should be doubled
    // From left (0-indexed): position 11, 9, 7, 5, 3, 1 (i is odd)
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
  }
  
  // Calculate check digit: (10 - (sum % 10)) % 10
  // If sum % 10 is 0, check digit should be 0
  const calculatedCheckDigit = (10 - (sum % 10)) % 10;

  if (calculatedCheckDigit !== checkDigit) {
    // Debug logging to help troubleshoot
    console.log(`[SA ID Validation] ID: ${idNumber}`);
    console.log(`[SA ID Validation] Sum: ${sum}, Sum % 10: ${sum % 10}`);
    console.log(`[SA ID Validation] Calculated check digit: ${calculatedCheckDigit}, Actual check digit: ${checkDigit}`);
    return { isValid: false, error: `Invalid check digit (expected ${calculatedCheckDigit}, got ${checkDigit})` };
  }

  // Determine gender
  const gender = genderDigit < 5 ? 'female' : 'male';

  return {
    isValid: true,
    dateOfBirth,
    gender,
  };
}

export function calculateAge(birthday: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthday.getFullYear();
  const monthDiff = today.getMonth() - birthday.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
    age--;
  }
  
  return age;
}

export function isAgeValid(age: number): boolean {
  return age >= 18 && age <= 65;
}

