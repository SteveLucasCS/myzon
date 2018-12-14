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

var getAllItems = new Promise(function(resolve, reject) {
  var itemArray = [];
  connection.query(`SELECT * FROM products;`,
    function(err, res) {
      if (err) throw (err);
      itemArray = res;
      resolve(itemArray);
    });
});

var displayAllProducts = new Promise(function(resolve, reject) {
  getAllItems.then(function(dataArray) {
    dataArray.forEach(product => {
      displayItem(product);
      resolve(`-------------------------------------------------\n`);
    });
  });
});

//   1. An object cart{} that represents the user's shopping cart
//     * Has a variable that is a list of products they've added to their cart
//     * Has a variable that is the sum price of all items in the cart
//     * Has a method addToCart()
//       * Adds an item to the list of products in the cart
//     * Has a method removeFromCart() 
//       * Removes an object from cart
function Cart() {
  this.products = ['test'];
  this.totalPrice = 0;
  this.removeFromCart = function(name) {
    var itemsRemoved = 0;
    for (var i = 0; i < this.products.length; i++) {
      if (this.products[i].productName === name) {
        try {
          // removes object at current index of the array
          this.products.slice(i);
        } catch (e) {
          console.log(`Could not remove ${name} - error: ${e.message}`);
          return itemsRemoved;
        }
        itemsRemoved++;
      }
    }
    if (itemsRemoved === 0) {
      console.log('No items in your cart matching that name.');
    }
    return itemsRemoved;
  }

  this.addToCart = function(id) {
    cart = this;
    var getItemById = new Promise(function(resolve, reject) {
      var item;
      connection.query(`SELECT * FROM products WHERE item_id = ${id};`,
        function(err, res) {
          if (err || !res[0]) {
            console.log(`No products matching that ID.`);
            buyItemPrompt();
          } else {
            item = res[0];
            resolve(item);
          }
        });
    });
    getItemById.then(function(item) {
      cart.products.push(item);
      cart.totalPrice += item.sale_price;
      console.log(`${item.product_name} added to cart!`);
      console.log(`New Cart Total: $${cart.totalPrice}`);
    });
  }
}

function displayItem(product) {
  console.log(`-------------------------------------------------`);
  console.log(`ID: ${product.item_id}`);
  console.log(`Name: ${product.product_name}`);
  console.log(`Department: ${product.department_name}`);
  console.log(`Price: ${product.sale_price}`);
}

//   2. mainMenu()
//     * Displays a list of products and takes user input to call other functions
//     * Calls buyItemPrompt()
//     * Calls checkout()
function mainMenu() {

  displayAllProducts.then(function(seperator) {
    console.log(seperator);
    INQUIRER.prompt([{
      name: 'next',
      type: 'list',
      message: 'What Next?',
      choices: ['Buy an Item', 'Checkout', 'Exit']
    }]).then(function(input) {
      switch (input.next) {
        case 'Buy an Item':
          buyItempPrompt();
          break;
        case 'Checkout':
          cart.checkout();
          break;
        case 'Exit':
          console.log('Thank you for shopping at Myzon!');
          connection.end();
          break;
      }
    });
  });

}
//   4. buyItemPrompt()
//     * Prompts the user to enter the ID of an item they want to buy
//     * Calls addToCart()
function buyItemPrompt() {
  INQUIRER.prompt([{
    name: 'id',
    type: 'input',
    message: 'Enter a product ID number: '
  }]).then(function(input) {
    var numRegex = /^[0-9]*$/;
    if (numRegex.test(input.id)) {
      cart.addToCart(input.id)
    } else {
      console.log('Not a valid ID.');
      buyItemPrompt();
    }
  }); // end inquirer
}


//   5. addToCart()
//     * Gets an item object from the database and passes it to cart.addItem()
//     * Prompts user to checkout or return to main menu
//     * Calls cart.addItem()
//     * Calls checkout()
//     * Calls mainMenu()

//   6. checkout()
//     * Iterates through items in the users cart
//       * Adds the price of each item to a sum total
//       * Deducts the amount of an item purchased from the item's stock_quantity in the database
//       * Adds the amount of an item purchased from the item's quantity_sold


// #### Main Menu
//   1. Display a list of all products
//     * Name - Category - Price

//   2. Prompt User asking them what they'd like to to next:
//     * Inquirer - List
//       * Buy Item - calls buyItemPrompt()
//       * Checkout - buys all products in the user's cart
//       * Exit

// #### buyItemPrompt() function
//   1. Ask user to enter the name of the product they want to buy
//     * Inquirer - Text

//   2. Display all results matching their search
//     * SELECT * FROM products WHERE name ?

//   3. Ask user to enter the id of the product they want to buy
//     * Inquirer - Text (require 0-9)

//   4. Adds the item to the user's cart
//     * Calls addToCart();

// #### addToCart() function
//   1. Access the products table with a query
//     * connect.query()

//   2. Select product with the id matching what the user input
//     * If the user input is invalid
//       * Alert the user and prompt them for a new input
//       * Call buyItemPrompt();

//     * Else,
//       * Update the stock_quantity of the product to stock_quantity - 1
//       * Add the price of the product to the user's cart

// #### checkout() function
//   * Accesses products database
//     * Iterates through items in the user's cart
//       * Deducts the amount of an item purchased from the item's stock_quantity in the database
//       * Adds the amount of an item purhased to the item's quantity_sold

//   * Alerts the user that their purhase was succeessful, exits the program.
cart = new Cart();

mainMenu();