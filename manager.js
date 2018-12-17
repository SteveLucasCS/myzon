const cTable = require('console.table');
const INQUIRER = require('inquirer');
const MYSQL = require('mysql');

var connection = MYSQL.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3307,
  // Your username
  user: "root",
  // Your password
  password: "root",
  database: "myzon_db"
});

function displayAll() {
  // * View Products for Sale
  var getAllItems = new Promise(function(resolve, reject) {
    connection.query(`SELECT * FROM products;`,
      function(err, res) {
        if (err) throw (err);
        console.table(res);
        console.log(`-------------------------------------------------------------------------------------------------`);
        resolve(res);
      });
  });
  getAllItems.then(function(res) {
    mainMenu();
  });
}

function displayLow() {
  // * View Products with inventory of 0
  var getAllItems = new Promise(function(resolve, reject) {
    connection.query(`SELECT * FROM products WHERE stock_quantity = 0;`,
      function(err, res) {
        if (err) throw (err);
        if (res.length == 0) {
          console.log('No products with low inventory.');
        } else {
          console.table(res);
          console.log(`-------------------------------------------------------------------------------------------------`);
        }
        resolve(res);
      });
  });
  getAllItems.then(function(res) {
    mainMenu();
  });
}

function addToInventory() {
  var addItemPrompt = new Promise(function(resolve, reject) {
    INQUIRER.prompt([{
        name: 'id',
        message: 'Product ID:',
        type: 'input'
      },
      {
        name: 'q',
        message: 'Amount to Add:',
        type: 'input'
      }
    ]).then(function(input) {
      var id = parseInt(input.id);
      var q = parseInt(input.q);
      if (input.id >= 0 && input.q >= 0) {
        var updateTable = new Promise(function(resolve, reject) {
          console.log('update table start');
          resolve(1); // update table resolved
        });
        updateTable.then(function(res) {
          console.log('update table resolved');
          resolve(2); //addItem resolved
        });
      } else {
        console.log('Invalid Input: ID and Amount must be >= 0');
        addItemPrompt;
      }
      // console.log('addItemPrompt resolved');
      // resolve(1);
    });
  });
  addItemPrompt.then(function(res) {
    // mainMenu();
  });
}

function addNewProduct() {

}

//   * List a set of menu options:
function mainMenu() {
  INQUIRER.prompt([{
    name: 'next',
    type: 'list',
    message: 'Welcome',
    choices: [
      'View All Products',
      `View Low Inventory`,
      'Add to Inventory',
      'Add New Product',
      'Exit'
    ]
  }]).then(function(input) {

    switch (input.next) {
      case 'View All Products':
        displayAll();
        break;

      case 'View Low Inventory':
        displayLow();
        break;

      case 'Add to Inventory':
        addToInventory();

      case 'Exit':
        connection.end();
        break;

        //add product
      default:
        addNewProduct();
        break;
    }
  });
}


//     * View Low Inventory

//     * Add to Inventory

//     * Add New Product

//   * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.

//   * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.

//   * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.


mainMenu();