import { RiskGroup } from '../entities/RiskGroup';

export interface LoanCalculation {
  loanPrincipal: number;
  loanAmount: number;
  dailyPayment: number;
  depositAmount: number;
}

export class LoanCalculationService {
  /**
   * Determines risk group number based on age
   */
  static getRiskGroupNumber(age: number): 1 | 2 | 3 {
    if (age >= 18 && age <= 30) {
      return 1;
    } else if (age >= 31 && age <= 50) {
      return 2;
    } else {
      return 3;
    }
  }

  /**
   * Gets pricing for a phone using risk group
   */
  static getPhonePricing(riskGroup: RiskGroup): {
    depositPercent: number;
    interestRate: number;
  } {
    return {
      depositPercent: riskGroup.depositPercent,
      interestRate: riskGroup.interestRate,
    };
  }

  /**
   * Calculates loan details using risk group
   */
  static calculateLoan(
    cashPrice: number,
    riskGroup: RiskGroup
  ): LoanCalculation {
    // Careful with this, we are converting the values to numbers from strings TYPEORM!!!!!!
    const depositPercent = Number(riskGroup.depositPercent);
    const interestRate = Number(riskGroup.interestRate);

    const depositAmount = cashPrice * depositPercent;
    const loanPrincipal = cashPrice * (1 - depositPercent);   
    const loanAmount = loanPrincipal * (1 + interestRate);
    const dailyPayment = loanAmount / 360;

    return {
      loanPrincipal: Math.round(loanPrincipal * 100) / 100,
      loanAmount: Math.round(loanAmount * 100) / 100,
      dailyPayment: Math.round(dailyPayment * 100) / 100,
      depositAmount: Math.round(depositAmount * 100) / 100,
    };
  }

  /**
   * Checks if user can afford the phone
   * Monthly income must be > 10x monthly phone price
   */
  static canAfford(monthlyIncome: number, dailyPayment: number): boolean {
    const monthlyPayment = dailyPayment * 30;
    return monthlyIncome > monthlyPayment * 10;
  }
}

