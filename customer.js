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
  this.products = [];
  this.totalPrice = 0;
  this.removeFromCart = function(id) {
    id = parseInt(id);
    var itemsRemoved = 0;
    var newArr = [];
    this.totalPrice = 0;
    for (var i = 0; i < this.products.length; i++) {
      if (this.products[i].item_id == id) {
        itemsRemoved++;
      } else {
        newArr.push(this.products[i]);
        this.totalPrice += this.products[i].sale_price;
      }
    }
    this.products = newArr;
    if (itemsRemoved === 0) {
      console.log('No items in your cart matching that name.')
    }

    console.log(`${itemsRemoved} items removed from your cart.`);
    mainMenu();
  }

  this.addToCart = function(id) {
    var cart = this;
    var getItemById = new Promise(function(resolve, reject) {
      var item;
      connection.query(`SELECT * FROM products WHERE item_id = ${id};`,
        function(err, res) {
          if (err || !res[0]) {
            console.log(`No products matching that ID.`);
            buyItemPrompt();
          } else if (res[0].stock_quantity == 0) {
            console.log('Sorry, that item is out of stock.');
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
      console.log(`\n+++++++++++++++++++++++++++++++++++++++++++++++++`);
      console.log(` ${item.product_name} added to cart!`);
      console.log(` New Cart Total: $${cart.totalPrice}`);
      // mainMenu();
      mainMenu();
    });
  } // end addToCart

  this.checkout = function() {
    var cart = this;
    for (var i = 0; i < cart.products.length; i++) {
      var product = cart.products[i];
      var sold = product.quantity_sold + 1;
      var stock = product.stock_quantity - 1;
      var id = product.item_id;
      var updateTable = new Promise(function(resolve, reject) {
          // connection.query(`SELECT * FROM products WHERE item_id = ${item.item_id}`,
          // function(err, res) {
          //   console.log(res);
          // });
          connection.query(
            `UPDATE products SET quantity_sold = ${sold}, stock_quantity = ${stock} WHERE item_id = ${id}`,
            function(err, res) {
              if (err) throw (err);
            }
          );
          resolve(1);
        } // end for loop through products
      ); // end updateTable()
    }
    updateTable.then(function(resolved) {
      console.log(`\nAmount Paid: $${cart.totalPrice}`);
      console.log('Thank you for shopping at Myzon!');
      connection.end();
    });
  } // end checkout()
} // end cart constructor



function displayItem(product) {
  console.log(`-------------------------------------------------`);
  console.log(` ID: ${product.item_id}`);
  console.log(` Name: ${product.product_name}`);
  console.log(` Department: ${product.department_name}`);
  console.log(` Price: $${product.sale_price}`);
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
    var id = parseInt(input.id);
    if (id && id >= 0) {
      cart.addToCart(id)
    } else {
      console.log('Not a valid ID.');
      buyItemPrompt();
    }
  }); // end inquirer
}

// removeItemPrompt()
// Prompts the user ot enter the ID of an item in their cart to remove it
function removeItemPrompt() {
  console.log('\nShopping Cart\n');
  for (var i = 0; i < cart.products.length; i++) {
    displayItem(cart.products[i]);
  }
  console.log('-------------------------------------------------\n');

  INQUIRER.prompt([{
    name: 'id',
    type: 'input',
    message: 'Enter ID of product to be removed: ',
  }]).then(function(input) {
    var id = parseInt(input.id);
    if (id && id >= 0) {
      cart.removeFromCart(id);
    } else {
      console.log('Not a valid ID');
      removeItemPrompt();
    }
  });
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
      message: 'Welcome',
      choices: [
        'Buy an Item',
        `Checkout (Cart Value -- $${cart.totalPrice})`,
        'Remove an Item from Cart',
        'Exit'
      ]
    }]).then(function(input) {

      switch (input.next) {
        case 'Buy an Item':
          buyItemPrompt();
          break;

        case 'Checkout':
          console.log('Thank you for shopping at Myzon!');
          connection.end();
          break;

        case 'Remove an Item from Cart':
          if (cart.products <= 0) {
            console.log('You have no items in your shopping cart.');
            mainMenu();
          } else {
            removeItemPrompt();
          }
          break;

        case 'Exit':
          console.log('Thank you for shopping at Myzon!');
          connection.end();
          break;

        default:
          if (cart.products <= 0) {
            console.log('You have no items in your shopping cart.');
            mainMenu();
          } else {cart.checkout();}
          break;
      }
    });
  });
}

cart = new Cart();

mainMenu();