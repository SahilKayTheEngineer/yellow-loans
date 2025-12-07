import { validateSAID, calculateAge, isAgeValid, SAIDValidationResult } from '../utils/sa-id-validator';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { Phone } from '../entities/Phone';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class ValidationService {
  /**
   * Validates biographical information
   */
  static async validateBiographical(
    firstName: string,
    lastName: string,
    idNumber: string,
    birthday: Date
  ): Promise<ValidationResult> {
    const errors: string[] = [];

    // Validate name
    if (!firstName || firstName.trim().length < 2) {
      errors.push('First name must be at least 2 characters');
    }
    if (!lastName || lastName.trim().length < 2) {
      errors.push('Last name must be at least 2 characters');
    }

    // Validate SA ID
    const idValidation = validateSAID(idNumber);
    if (!idValidation.isValid) {
      errors.push(idValidation.error || 'Invalid SA ID number');
    }

    // Validate age
    if (idValidation.dateOfBirth) {
      const age = calculateAge(idValidation.dateOfBirth);
      if (!isAgeValid(age)) {
        errors.push('Age must be between 18 and 65 (inclusive)');
      }

      // Check if birthday matches ID number
      if (birthday.getTime() !== idValidation.dateOfBirth.getTime()) {
        errors.push('Birthday does not match ID number');
      }
    }

    // Check ID uniqueness (users must be unique by ID number)
    const existingUser = await AppDataSource.getRepository(User).findOne({
      where: { idNumber: idNumber.trim() },
    });

    if (existingUser) {
      errors.push('A user with this ID number already exists');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates income information
   */
  static validateIncome(monthlyIncome: number): ValidationResult {
    const errors: string[] = [];

    if (!monthlyIncome || monthlyIncome <= 0) {
      errors.push('Monthly income must be greater than 0');
    }

    if (monthlyIncome < 1000) {
      errors.push('Monthly income seems too low. Please verify.');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates phone selection
   */
  static async validatePhone(phoneId: string): Promise<ValidationResult> {
    const errors: string[] = [];

    const phone = await AppDataSource.getRepository(Phone).findOne({
      where: { id: phoneId },
    });

    if (!phone) {
      errors.push('Selected phone does not exist');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

