const Message = artifacts.require("Message");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Message", function (accounts) {
    let messageInstance
    [alice, bob, pepe] = accounts
    beforeEach(async () => {
      messageInstance = await Message.new();
    });
    async function shouldThrow(promise) {
      try {
          await promise;
         assert(true);
      }
      catch (err) {
          return;
      }
    assert(false, "The contract did not throw.");
    
    }
  it("checks contract deployable", async function () {
    await Message.deployed();
    return assert.isTrue(true);
  });

  it("test user can set and get their own message", async () => {
    let msgValue = "Hello, World!";
    let account = alice;
    await messageInstance.setMessage(msgValue, {from: account}) 
    let result = await messageInstance.getMessage({from: account}) 
    console.log(result)
    assert.equal(result, msgValue);
  })

  it("test user can set message, grant access, and allow other user to read. others can't access their message", async () => {
    let msgValue1 = "Hi Bob!";
    await messageInstance.setMessage(msgValue1, {from:alice})
    await messageInstance.createAccount({from:bob})
    // Alice grants access to Bob
    await messageInstance.grantAccess(bob, {from:alice})
    // Bob can read message
    let result = await messageInstance.getMessageFrom(alice, {from:bob})
    assert.equal(result, msgValue1);
    // pepe cannot read message
    await shouldThrow(messageInstance.getMessageFrom(alice, {from:pepe})) 
  })
});
