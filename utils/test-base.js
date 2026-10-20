const { test } = require("@playwright/test");

exports.customtest = test.extend({
  testDataForOrder: {
    username: "anshika@gmail.com",
    password: "Iamking@000",
    productName: "ZARA COAT 3",
  },
});
