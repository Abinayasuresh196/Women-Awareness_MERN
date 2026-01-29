const express = require('express');
const router = express.Router();
const Law = require('../models/Law.model');
const Admin = require('../models/Admin.model');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

// Seed laws endpoint
router.post('/seed-laws', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    // Check if laws already exist
    const existingLaws = await Law.find();
    if (existingLaws.length > 0) {
      return res.status(200).json({
        success: true,
        message: `Laws already exist in database (${existingLaws.length} laws found)`,
        data: existingLaws
      });
    }

    // Get the admin user from the request
    const adminUser = req.user;

    // Women Empowerment Laws Data
    const womenEmpowermentLaws = [
      // Constitutional Provisions
      {
        title: 'Article 14 - Right to Equality',
        description: 'Ensures equality before law and equal protection of laws within the territory of India.',
        category: 'constitutional',
        subCategory: 'Constitutional Provisions',
        link: 'https://indiankanoon.org/doc/1192122/',
        image: 'https://picsum.photos/400/200?random=14'
      },
      {
        title: 'Article 15 - Prohibition of Discrimination',
        description: 'Prohibits discrimination on grounds of religion, race, caste, sex or place of birth.',
        category: 'constitutional',
        subCategory: 'Constitutional Provisions',
        link: 'https://indiankanoon.org/doc/608694/',
        image: 'https://picsum.photos/400/200?random=15'
      },
      {
        title: 'Article 16 - Equality of Opportunity',
        description: 'Ensures equality of opportunity in matters of public employment.',
        category: 'constitutional',
        subCategory: 'Constitutional Provisions',
        link: 'https://indiankanoon.org/doc/1818937/',
        image: 'https://picsum.photos/400/200?random=16'
      },
      {
        title: 'Article 39(d) - Equal Pay for Equal Work',
        description: 'Directs the State to ensure equal pay for equal work for both men and women.',
        category: 'constitutional',
        subCategory: 'Constitutional Provisions',
        link: 'https://indiankanoon.org/doc/1250723/',
        image: 'https://picsum.photos/400/200?random=39'
      },
      {
        title: 'Article 42 - Maternity Relief',
        description: 'Directs the State to make provision for securing just and humane conditions of work and for maternity relief.',
        category: 'constitutional',
        subCategory: 'Constitutional Provisions',
        link: 'https://indiankanoon.org/doc/1617235/',
        image: 'https://picsum.photos/400/200?random=42'
      },
      {
        title: 'Article 51A(e) - Dignity of Women',
        description: 'Promotes harmony and the spirit of common brotherhood amongst all the people of India and renounces practices derogatory to the dignity of women.',
        category: 'constitutional',
        subCategory: 'Constitutional Provisions',
        link: 'https://indiankanoon.org/doc/1192122/',
        image: 'https://picsum.photos/400/200?random=51'
      },

      // Protection & Safety Laws
      {
        title: 'Protection of Women from Domestic Violence Act, 2005',
        description: 'Provides protection to women from domestic violence and covers physical, emotional, sexual, verbal, and economic abuse.',
        category: 'protection',
        subCategory: 'Protection & Safety Laws',
        link: 'https://wcd.nic.in/act/protection-women-domestic-violence-act-2005',
        image: 'https://picsum.photos/400/200?random=100'
      },
      {
        title: 'Dowry Prohibition Act, 1961',
        description: 'Prohibits the giving or taking of dowry at or before or any time after the marriage.',
        category: 'protection',
        subCategory: 'Protection & Safety Laws',
        link: 'https://wcd.nic.in/act/dowry-prohibition-act-1961',
        image: 'https://picsum.photos/400/200?random=101'
      },
      {
        title: 'Sexual Harassment of Women at Workplace Act, 2013',
        description: 'Seeks to protect women from sexual harassment at their place of work.',
        category: 'protection',
        subCategory: 'Protection & Safety Laws',
        link: 'https://wcd.nic.in/act/sexual-harassment-women-workplace-prevention-prohibition-and-redressal-act-2013',
        image: 'https://picsum.photos/400/200?random=102'
      },
      {
        title: 'Criminal Law (Amendment) Act, 2013',
        description: 'Amended various laws related to sexual offences and provided for enhanced punishment for crimes against women.',
        category: 'protection',
        subCategory: 'Protection & Safety Laws',
        link: 'https://www.indiacode.nic.in/handle/123456789/2267',
        image: 'https://picsum.photos/400/200?random=103'
      },
      {
        title: 'Indecent Representation of Women (Prohibition) Act, 1986',
        description: 'Prohibits indecent representation of women through advertisements, publications, writings, paintings, figures or in any other manner.',
        category: 'protection',
        subCategory: 'Protection & Safety Laws',
        link: 'https://wcd.nic.in/act/indecent-representation-women-prohibition-act-1986',
        image: 'https://picsum.photos/400/200?random=104'
      },
      {
        title: 'Immoral Traffic (Prevention) Act, 1956',
        description: 'Prevents trafficking in persons for the purpose of prostitution and protects victims of trafficking.',
        category: 'protection',
        subCategory: 'Protection & Safety Laws',
        link: 'https://wcd.nic.in/act/immoral-traffic-prevention-act-1956',
        image: 'https://picsum.photos/400/200?random=105'
      },
      {
        title: 'Commission of Sati (Prevention) Act, 1987',
        description: 'Prevents the practice of sati and provides for punishment of those who abet or glorify it.',
        category: 'protection',
        subCategory: 'Protection & Safety Laws',
        link: 'https://wcd.nic.in/act/commission-sati-prevention-act-1987',
        image: 'https://picsum.photos/400/200?random=106'
      },
      {
        title: 'Acid Attacks Law (IPC Sections 326A & 326B)',
        description: 'Provides for punishment for acid attacks and regulation of sale of acid.',
        category: 'protection',
        subCategory: 'Protection & Safety Laws',
        link: 'https://www.indiacode.nic.in/handle/123456789/2267',
        image: 'https://picsum.photos/400/200?random=107'
      },

      // Marriage & Family Laws
      {
        title: 'Prohibition of Child Marriage Act, 2006',
        description: 'Prohibits solemnization of child marriages and provides for the protection of victims.',
        category: 'marriage',
        subCategory: 'Marriage & Family Laws',
        link: 'https://wcd.nic.in/act/prohibition-child-marriage-act-2006',
        image: 'https://picsum.photos/400/200?random=108'
      },
      {
        title: 'Hindu Marriage Act, 1955',
        description: 'Regulates marriage among Hindus and provides for conditions of marriage, ceremonies, and registration.',
        category: 'marriage',
        subCategory: 'Marriage & Family Laws',
        link: 'https://www.indiacode.nic.in/handle/123456789/1955',
        image: 'https://picsum.photos/400/200?random=109'
      },
      {
        title: 'Special Marriage Act, 1954',
        description: 'Provides for special form of marriage for people of India and all Indian nationals in foreign countries.',
        category: 'marriage',
        subCategory: 'Marriage & Family Laws',
        link: 'https://www.indiacode.nic.in/handle/123456789/1954',
        image: 'https://picsum.photos/400/200?random=110'
      },
      {
        title: 'Muslim Women (Protection of Rights on Marriage) Act, 2019',
        description: 'Protects the rights of Muslim women and prohibits divorce by pronouncing talaq by their husbands.',
        category: 'marriage',
        subCategory: 'Marriage & Family Laws',
        link: 'https://wcd.nic.in/act/muslim-women-protection-rights-marriage-act-2019',
        image: 'https://picsum.photos/400/200?random=111'
      },
      {
        title: 'Divorce Act, 1869',
        description: 'Provides for dissolution of marriage and matters connected therewith for Christians.',
        category: 'marriage',
        subCategory: 'Marriage & Family Laws',
        link: 'https://www.indiacode.nic.in/handle/123456789/1869',
        image: 'https://picsum.photos/400/200?random=112'
      },
      {
        title: 'Guardians and Wards Act, 1890',
        description: 'Provides for appointment of guardians for minors and their property.',
        category: 'marriage',
        subCategory: 'Marriage & Family Laws',
        link: 'https://www.indiacode.nic.in/handle/123456789/1890',
        image: 'https://picsum.photos/400/200?random=113'
      },

      // Property & Financial Rights
      {
        title: 'Hindu Succession (Amendment) Act, 2005',
        description: 'Amends the Hindu Succession Act, 1956 to give equal rights to daughters in ancestral property.',
        category: 'property',
        subCategory: 'Property & Financial Rights',
        link: 'https://www.indiacode.nic.in/handle/123456789/2005',
        image: 'https://picsum.photos/400/200?random=114'
      },
      {
        title: 'Married Women’s Property Act, 1874',
        description: 'Protects the property rights of married women and their earnings.',
        category: 'property',
        subCategory: 'Property & Financial Rights',
        link: 'https://www.indiacode.nic.in/handle/123456789/1874',
        image: 'https://picsum.photos/400/200?random=115'
      },
      {
        title: 'Equal Remuneration Act, 1976',
        description: 'Provides for payment of equal remuneration to men and women workers for same work or work of similar nature.',
        category: 'property',
        subCategory: 'Property & Financial Rights',
        link: 'https://www.indiacode.nic.in/handle/123456789/1976',
        image: 'https://picsum.photos/400/200?random=116'
      },
      {
        title: 'Code on Wages Act, 2019',
        description: 'Consolidates and amends the laws relating to wages and bonus and matters connected therewith.',
        category: 'property',
        subCategory: 'Property & Financial Rights',
        link: 'https://www.indiacode.nic.in/handle/123456789/2019',
        image: 'https://picsum.photos/400/200?random=117'
      },

      // Health & Maternity
      {
        title: 'Maternity Benefit Act, 1961',
        description: 'Regulates employment of women in certain establishments for certain periods before and after childbirth and provides for maternity benefit.',
        category: 'health',
        subCategory: 'Health & Maternity',
        link: 'https://wcd.nic.in/act/maternity-benefit-act-1961',
        image: 'https://picsum.photos/400/200?random=118'
      },
      {
        title: 'Medical Termination of Pregnancy Act, 1971',
        description: 'Provides for termination of certain pregnancies by registered medical practitioners and for matters connected therewith.',
        category: 'health',
        subCategory: 'Health & Maternity',
        link: 'https://www.indiacode.nic.in/handle/123456789/1971',
        image: 'https://picsum.photos/400/200?random=119'
      },
      {
        title: 'Pre-Conception and Pre-Natal Diagnostic Techniques Act, 1994',
        description: 'Prohibits sex selection before or after conception and regulates prenatal diagnostic techniques.',
        category: 'health',
        subCategory: 'Health & Maternity',
        link: 'https://www.indiacode.nic.in/handle/123456789/1994',
        image: 'https://picsum.photos/400/200?random=120'
      },

      // Political & Social Empowerment
      {
        title: 'National Commission for Women Act, 1990',
        description: 'Establishes the National Commission for Women to review constitutional and legal safeguards for women.',
        category: 'political',
        subCategory: 'Political & Social Empowerment',
        link: 'https://wcd.nic.in/act/national-commission-women-act-1990',
        image: 'https://picsum.photos/400/200?random=121'
      },
      {
        title: 'Protection of Women from Sexual Offences (POCSO) Act, 2012',
        description: 'Protects children from offences of sexual assault, sexual harassment and pornography.',
        category: 'political',
        subCategory: 'Political & Social Empowerment',
        link: 'https://wcd.nic.in/act/protection-children-sexual-offences-act-2012',
        image: 'https://picsum.photos/400/200?random=122'
      },
      {
        title: 'Women’s Reservation Act, 2023',
        description: 'Provides for reservation of seats for women in the House of the People, State Legislative Assemblies, and Legislative Assembly of the National Capital Territory of Delhi.',
        category: 'political',
        subCategory: 'Political & Social Empowerment',
        link: 'https://wcd.nic.in/act/women-reservation-act-2023',
        image: 'https://picsum.photos/400/200?random=123'
      }
    ];

    // Clear existing laws first
    await Law.deleteMany({});
    console.log('🧹 Cleared existing laws');

    // Add each law with the admin as creator
    const addedLaws = [];
    for (const [index, lawData] of womenEmpowermentLaws.entries()) {
      const law = new Law({
        ...lawData,
        createdBy: adminUser._id
      });

      await law.save();
      addedLaws.push(law);
      console.log(`✅ Added law ${index + 1}/30: ${law.title}`);
    }

    res.status(201).json({
      success: true,
      message: 'Successfully added all 30 women empowerment laws!',
      data: addedLaws,
      count: addedLaws.length
    });

  } catch (error) {
    console.error('❌ Error adding laws:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding laws',
      error: error.message
    });
  }
});

module.exports = router;
