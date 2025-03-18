// users.js:
// This file defines an array of test users, each with a unique ID generated using uuidv4.
// The users array is exported for use in other modules.
//

// Import uuidv4 to generate unique IDs
const { v4: uuidv4 } = require('uuid');

// Define test users
// Note: These are not real users, and are only used for testing purposes
// {
//   id: uuidv4(),
//   name: 'first last',
//   emoji: '👦',
// }

let users = [
  {
    id: uuidv4(),
    name: 'Bramble Fright',
    emoji: '👻',
  },
  {
    id: uuidv4(),
    name: 'Sylvie Scream',
    emoji: '🎃',
  },
  {
    id: uuidv4(),
    name: 'Eve Eerie',
    emoji: '🧙',
  },
  // Add more test users from star wars
  {
    id: uuidv4(),
    name: 'Luke Skywalker',
    emoji: '🌌',
  },
  {
    id: uuidv4(),
    name: 'Leia Organa',
    emoji: '👑',
  },
  {
    id: uuidv4(),
    name: 'Han Solo',
    emoji: '🚀',
  },
  {
    id: uuidv4(),
    name: 'Chewbacca',
    emoji: '🐻',
  },
  {
    id: uuidv4(),
    name: 'Darth Vader',
    emoji: '👺',
  },
  {
    id: uuidv4(),
    name: 'Yoda',
    emoji: '👽',
  },
  {
    id: uuidv4(),
    name: 'R2-D2',
    emoji: '🤖',
  },
  {
    id: uuidv4(),
    name: 'C-3PO',
    emoji: '🤖',
  },
  {
    id: uuidv4(),
    name: 'Obi-Wan Kenobi',
    emoji: '👴',
  },
  {
    id: uuidv4(),
    name: 'Padmé Amidala',
    emoji: '👸',
  },
  {
    id: uuidv4(),
    name: 'Anakin Skywalker',
    emoji: '👦',
  },
  {
    id: uuidv4(),
    name: 'Mace Windu',
    emoji: '👴',
  },
  {
    id: uuidv4(),
    name: 'Boba Fett',
    emoji: '👦',
  },
  {
    id: uuidv4(),
    name: 'Jabba the Hutt',
    emoji: '🐍',
  },
  {
    id: uuidv4(),
    name: 'Darth Maul',
    emoji: '👹',
  },
  {
    id: uuidv4(),
    name: 'Lando Calrissian',
    emoji: '🎩',
  },
  {
    id: uuidv4(),
    name: 'Finn',
    emoji: '👦',
  },
  {
    id: uuidv4(),
    name: 'Rey',
    emoji: '👧',
  },
];

// Export the users array
module.exports = {
  users,
};
