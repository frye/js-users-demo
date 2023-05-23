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
];

// Export the users array
module.exports = {
  users,
};
