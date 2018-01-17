// --------------------------------------------------------
// Differences between regular promises and async functions
// This async function...
const getNameAsync = async userId => {
  if (!userId) throw new Error('userId is required'); // Equals to reject
  return `User ${userId}`; // Equals to resolve
};
// Is exactly the same as:
const getNameRegularPromise = userId => {
  return new Promise((resolve, reject) => {
    if (!userId) reject('userId is required');
    resolve(`User ${userId}`);
  });
};

// getNameAsync().then(user => console.log(user)).catch(error => console.log(error.message)); // Error is a object
// getNameRegularPromise().then(user => console.log(user)).catch(error => console.log(error)); // Error is only what you sent through reject
// --------------------------------------------------------

const users = [{
  id: 1,
  name: 'Mary',
  schoolId: 200
}, {
  id: 2,
  name: 'Lara',
  schoolId: 888
}];

const grades = [{
  id: 1,
  schoolId: 200,
  grade: 86
}, {
  id: 2,
  schoolId: 888,
  grade: 100
}, {
  id: 3,
  schoolId: 200,
  grade: 50
}];

const getUser = id => {
  return new Promise((resolve, reject) => {
    const user = users.find(user => user.id === id);

    if (user) {
      resolve(user);
    } else {
      reject(`Unable to find user with id ${id}`);
    }
  });
};

const getGrades = schoolId => {
  return new Promise((resolve, reject) => {
    resolve(grades.filter(grade => grade.schoolId === schoolId));
  });
};

const getStatus = userId => {
  let user;
  return getUser(userId)
    .then(u => {
      user = u;
      return getGrades(user.schoolId);
    })
    .then(grades => {
      return new Promise((resolve, reject) => {
        const sum = grades.reduce((acc, current) => {
          return acc + current.grade;
        }, 0);
        const avg = grades.length > 0 ? sum / grades.length : 0;
        resolve(`${user.name} is ${avg > 70 ? 'Approved' : 'Reproved'}`);
      });
    });
};

const getStatusAsync = async userId => {
  const user = await getUser(userId); // We use await before a promise
  const grades = await getGrades(user.schoolId);

  const sum = grades.reduce((acc, current) => {
    return acc + current.grade;
  }, 0);
  const avg = grades.length > 0 ? sum / grades.length : 0;

  // Async functions return a promise (regular return is resolve and error is reject)
  return `${user.name} is ${avg > 70 ? 'Approved' : 'Reproved'}`;
};

getStatusAsync(2)
  .then(status => console.log(status))
  .catch(error => console.log(error));

getStatus(2)
  .then(status => console.log(status))
  .catch(error => console.log(error));
