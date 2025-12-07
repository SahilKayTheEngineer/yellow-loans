import { AppDataSource } from './data-source';
import { Phone } from './entities/Phone';
import { RiskGroup } from './entities/RiskGroup';

export async function seedIfNeeded() {
  const phoneRepository = AppDataSource.getRepository(Phone);
  const riskGroupRepository = AppDataSource.getRepository(RiskGroup);

  // Seed risk groups
  const riskGroupCount = await riskGroupRepository.count();
  if (riskGroupCount === 0) {
    console.log('📦 Seeding risk groups...');
    
    const riskGroups = [
      {
        groupNumber: 1,
        name: 'High Risk (18-30)',
        depositPercent: 0.15,
        interestRate: 0.18,
      },
      {
        groupNumber: 2,
        name: 'Medium Risk (31-50)',
        depositPercent: 0.1,
        interestRate: 0.15,
      },
      {
        groupNumber: 3,
        name: 'Low Risk (51-65)',
        depositPercent: 0.05,
        interestRate: 0.12,
      },
    ];

    for (const riskGroupData of riskGroups) {
      const riskGroup = riskGroupRepository.create(riskGroupData);
      await riskGroupRepository.save(riskGroup);
    }

    console.log('✅ Seeded risk groups successfully');
  }

  // Seed phones
  const phoneCount = await phoneRepository.count();
  if (phoneCount === 0) {
    console.log('📦 Seeding phones...');
    
    const phones = [
      {
        name: 'iPhone 15 Pro',
        brand: 'Apple',
        cashPrice: 2500,
        imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
      },
      {
        name: 'Samsung Galaxy S24',
        brand: 'Samsung',
        cashPrice: 2200,
        imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
      },
      {
        name: 'Google Pixel 8',
        brand: 'Google',
        cashPrice: 1800,
        imageUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop',
      },
      {
        name: 'OnePlus 12',
        brand: 'OnePlus',
        cashPrice: 1500,
        imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop',
      },
      {
        name: 'Xiaomi 14',
        brand: 'Xiaomi',
        cashPrice: 1200,
        imageUrl: 'https://images.unsplash.com/photo-1601972602237-8c79241f183a?w=400&h=400&fit=crop',
      },
    ];

    for (const phoneData of phones) {
      const phone = phoneRepository.create(phoneData);
      await phoneRepository.save(phone);
    }

    console.log('✅ Seeded phones successfully');
  } else {
    console.log(`✅ Database already has ${phoneCount} phones and ${riskGroupCount} risk groups`);
  }
}
