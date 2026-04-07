import crypto from "crypto";

// Mock data pools
const firstNames = [
  "James",
  "Mary",
  "Robert",
  "Patricia",
  "Michael",
  "Jennifer",
  "William",
  "Linda",
  "David",
  "Barbara",
  "Richard",
  "Susan",
  "Joseph",
  "Jessica",
  "Thomas",
  "Sarah",
  "Charles",
  "Karen",
  "Christopher",
  "Nancy",
  "Daniel",
  "Lisa",
  "Matthew",
  "Betty",
  "Anthony",
  "Margaret",
  "Donald",
  "Sandra",
  "Steven",
  "Ashley",
  "Paul",
  "Kimberly",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  "White",
  "Harris",
  "Sanchez",
  "Clark",
  "Ramirez",
  "Lewis",
  "Robinson",
];

const domains = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "aol.com",
  "mail.com",
  "protonmail.com",
  "tutanota.com",
  "zoho.com",
  "icloud.com",
];

const countries = [
  "United States",
  "Canada",
  "Mexico",
  "United Kingdom",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Netherlands",
  "Belgium",
  "Switzerland",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Poland",
  "Australia",
  "New Zealand",
  "Japan",
  "China",
  "India",
  "Brazil",
  "Argentina",
  "South Africa",
  "Russia",
  "Ireland",
];

const states = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

const jobTitles = [
  "Software Engineer",
  "Product Manager",
  "Data Analyst",
  "UX Designer",
  "Marketing Manager",
  "Sales Executive",
  "Business Analyst",
  "DevOps Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "QA Engineer",
  "System Administrator",
  "Database Administrator",
  "Solutions Architect",
  "Project Manager",
  "Scrum Master",
  "Technical Lead",
  "Engineering Manager",
  "Chief Technology Officer",
];

const companies = [
  "TechCorp",
  "DataSync",
  "CloudVision",
  "NextGen Solutions",
  "Digital Innovations",
  "Smart Systems",
  "Future Tech",
  "Global Services",
  "Innovation Labs",
  "Tech Hub",
  "Enterprise Solutions",
  "Digital Dynamics",
  "Cloud Systems",
  "Tech Ventures",
];

/**
 * Generate random string
 */
const randomString = (length = 8) => {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
};

/**
 * Get random element from array
 */
const randomElement = (arr) => {
  return arr[crypto.randomInt(0, arr.length)];
};

/**
 * Generate random number
 */
const randomNumber = (min, max) => {
  return crypto.randomInt(min, max + 1);
};

/**
 * Generate realistic email
 */
const generateEmail = (firstName, lastName) => {
  const formats = [
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
    `${firstName.charAt(0).toLowerCase()}${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}${randomNumber(1, 999)}`,
  ];
  const email = randomElement(formats);
  return `${email}@${randomElement(domains)}`;
};

/**
 * Generate phone number
 */
const generatePhone = () => {
  const areaCode = randomNumber(200, 999);
  const exchange = randomNumber(200, 999);
  const number = randomNumber(1000, 9999);
  return `+1 (${areaCode}) ${exchange}-${number}`;
};

/**
 * Generate fake user
 */
const generateFakeUser = () => {
  const firstName = randomElement(firstNames);
  const lastName = randomElement(lastNames);
  const email = generateEmail(firstName, lastName);
  const phone = generatePhone();
  const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${randomNumber(1, 99)}`;
  const password = crypto.randomBytes(8).toString("base64");
  const age = randomNumber(18, 80);
  const country = randomElement(countries);
  const state = randomElement(states);
  const address = `${randomNumber(100, 9999)} ${randomElement(["Main", "Oak", "Elm", "Maple", "Pine"])} St`;
  const city = `${randomElement(["New", "Old", "San", "Los"])} ${randomElement(["York", "Angeles", "Francisco", "Boston", "Chicago"])}`;
  const zipCode = randomNumber(10000, 99999).toString();
  const company = randomElement(companies);
  const jobTitle = randomElement(jobTitles);
  const userId = crypto.randomUUID();
  const createdAt = new Date(
    Date.now() - randomNumber(1, 365 * 24 * 60 * 60 * 1000),
  ).toISOString();
  const avatar = `https://i.pravatar.cc/150?img=${randomNumber(0, 70)}`;
  const website = `https://www.${firstName.toLowerCase()}${lastName.toLowerCase()}.com`;

  return {
    userId,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    username,
    email,
    phone,
    password,
    age,
    address,
    city,
    state,
    zipCode,
    country,
    company,
    jobTitle,
    avatar,
    website,
    createdAt,
    ipAddress: `${randomNumber(1, 255)}.${randomNumber(0, 255)}.${randomNumber(0, 255)}.${randomNumber(1, 255)}`,
  };
};

/**
 * Generate fake users
 */
export const generateFakeUsers = (req, res) => {
  try {
    const {
      quantity = 1,
      includePassword = false,
      includeAvatar = true,
    } = req.body;

    // Validation
    if (quantity < 1 || quantity > 500) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be between 1 and 500",
      });
    }

    const users = [];

    for (let i = 0; i < quantity; i++) {
      const user = generateFakeUser();

      // Remove password if not requested
      if (!includePassword) {
        delete user.password;
      }

      // Remove avatar if not requested
      if (!includeAvatar) {
        delete user.avatar;
      }

      users.push(user);
    }

    res.json({
      success: true,
      data: {
        users,
        count: users.length,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error generating fake users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate fake users",
      error: error.message,
    });
  }
};

/**
 * Generate single user
 */
export const generateSingleUser = (req, res) => {
  try {
    const { includePassword = false, includeAvatar = true } = req.body;

    const user = generateFakeUser();

    if (!includePassword) {
      delete user.password;
    }

    if (!includeAvatar) {
      delete user.avatar;
    }

    res.json({
      success: true,
      data: {
        user,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error generating fake user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate fake user",
      error: error.message,
    });
  }
};
