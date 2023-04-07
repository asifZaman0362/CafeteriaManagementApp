let count = 0;
let [passed, failed] = [0, 0];

function runTests() {
  for (let test of tests) {
    count++;
    try {
      test();
      passed++;
      console.log(`Test ${count} passed!`);
    } catch (err) {
      console.error(`Test ${count} failed because: ${err}`);
      failed++;
    }
  }
  console.log(`Total passed: ${passed}\nTotal failed: ${failed}`);
}

function testRegistration() {
  throw new Error("failed to register!");
}

function testManagerAuthorization() {}

function testCashierAuthorization() {}

function testAddCategory() {}

function testGetCategory() {}

function testAddItem() {}

function testGetItem() {}

function testGetItems() {}

function testAddUser() {}

function testGetUser() {}

function testRemoveUser() {}

function testGetUserList() {}

function testCreateOrder() {}

function testCancelOrder() {}

function testLogin() {}

const tests = [
  testRegistration,
  testLogin,
  testManagerAuthorization,
  testCashierAuthorization,
  testAddCategory,
  testGetCategory,
  testAddItem,
  testGetItem,
  testLogin,
  testAddUser,
  testRemoveUser,
  testCreateOrder,
  testCancelOrder,
  testGetItems,
];

runTests();
