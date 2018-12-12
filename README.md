# myzon
Homework assignment 10 - A CLI based 'storefront'

## Pseudo-Code (Logic)

### Product Database
  1. Create a new database in mySQL called 'myzon_db'

  2. Create a table within the databse called 'products' with a column for each property:
    * item_id -- UNIQUE id/key for each sku (an autoincrementing integer)
    * product_name -- Name of the product - string (varchar)
    * department_name -- Name of the category/department the product is in (electronics, food, etc)
    * department_key -- Integer key corresponding to a department - used as a foreign key
    * price -- Price of the product to the customer (NOT NULL DEFAULT 0)
    * stock_quantity -- amount of products available in inventory (NOT NULL DEFAULT 0)

  3. Add 'mock' products to the database for testing
    * Use INSERT INTO products VALUES (),()...; for mySQL
    * or INSERT INTO products SET ... ; for JS

  * Example:
  -------------------------------------------------------------------------------------------------------------------
  | item_id       | product_name    | department_name |  unit_cost    | stock_quantity | quantity_sold | sale_price |
  | ------------- | --------------- | --------------- | ------------- | -------------- |-------------- | ---------- |
  | 01            | MacBook         | Electronics     |  1600.00      | 1000           | 400           | 2400.00    |
  | 02            | Pillow          | Home            |  8.00         | 50000          | 2000          | 30.00      |
  -------------------------------------------------------------------------------------------------------------------

### Supervisor Database

  * Created by compiling/computing data from products sheet and constants. Used by the myzonSupervisor app
  * Example:
  ----------------------------------------------------------------------
  | department_id | department_name |  costs  |   sales   |   profit   |
  | ------------- | --------------- | ------- | --------- | ---------- |
  | 01            | Electronics     | 10000   | 20000     | 10000      |
  | 02            | Clothing        | 60000   | 100000    | 40000      |
  ----------------------------------------------------------------------

### myzon Customer App

#### Compenents
  1. An object cart{} that represents the user's shopping cart
    * Has a variable that is a list of products they've added to their cart
    * Has a variable that is the sum price of all items in the cart
    * Has a method addToCart()
      * Adds an item to the list of products in the cart
    * Has a method removeFromCart() 
      * Removes an object from cart

  2. mainMenu()
    * Displays a list of products and takes user input to call other functions
    * Calls buyItemPrompt()
    * Calls checkout()

  4. buyItemPrompt()
    * Prompts the user to enter the ID of an item they want to buy
    * Calls addToCart()
  
  5. addToCart()
    * Gets an item object from the database and passes it to cart.addItem()
    * Prompts user to checkout or return to main menu
    * Calls cart.addItem()
    * Calls checkout()
    * Calls mainMenu()
  
  6. checkout()
    * Iterates through items in the users cart
      * Adds the price of each item to a sum total
      * Deducts the amount of an item purchased from the item's stock_quantity in the database
      * Adds the amount of an item purchased from the item's quantity_sold


#### Main Menu
  1. Display a list of all products
    * Name - Category - Price

  2. Prompt User asking them what they'd like to to next:
    * Inquirer - List
      * Buy Item - calls buyItemPrompt()
      * Checkout - buys all products in the user's cart
      * Exit
  
#### buyItemPrompt() function
  1. Ask user to enter the name of the product they want to buy
    * Inquirer - Text

  2. Display all results matching their search
    * SELECT * FROM products WHERE name ?

  3. Ask user to enter the id of the product they want to buy
    * Inquirer - Text (require 0-9)

  4. Adds the item to the user's cart
    * Calls addToCart();

#### addToCart() function
  1. Access the products table with a query
    * connect.query()

  2. Select product with the id matching what the user input
    * If the user input is invalid
      * Alert the user and prompt them for a new input
      * Call buyItemPrompt();

    * Else,
      * Update the stock_quantity of the product to stock_quantity - 1
      * Add the price of the product to the user's cart

#### checkout() function
  * Accesses products database
    * Iterates through items in the user's cart
      * Deducts the amount of an item purchased from the item's stock_quantity in the database
      * Adds the amount of an item purhased to the item's quantity_sold

  * Alerts the user that their purhase was succeessful, exits the program.
  

### myzon Manager App

#### Components

  #### mainMenu() - Displays UI options to the user

  * List a set of menu options:

    1. View Products for Sale
      * Lists all information about every item in the product database

    2. View Low Inventory
      * Lists all products that have an inventory below a predermined threshold (a const value)
    
    3. Add to Inventory
      * Asks user quantity to add
      *   Updates an existing entry in the product database - Sets quantity to however many were added

    4. Add New Product
      * Adds a new product to the existing product database
      * Gets all values from user input


### myzon Superviser App

#### Main Menu
  * Prompts user to select an option:
    * View Sales by Department (calls viewSales())
    * Create New Department (calls createNewDepartment())
#### Supervisor Table

----------------------------------------------------------------------
| department_id | department_name |  costs  |   sales   |   profit   |
| ------------- | --------------- | ------- | --------- | ---------- |
| 01            | Electronics     | 10000   | 20000     | 10000      |
| 02            | Clothing        | 60000   | 100000    | 40000      |
----------------------------------------------------------------------

#### View Sales By Department
  * Pull data from `products` table
    * For Each `department_name` in the `products` table, create an object with key:value pairs:
      1. Sets `department_name` to name of the department as read from the `product` table
      1. Calculates `cost` from a department by multipling total `stock_quantity` * `unit_cost` for all products in that department
      2. Calculates `revenue` from a department by multiping total `quantity_sold` * `sale_price` for all products in that department
      3. Calculates `profit` by subtracting `cost` from `revnue`
      4. Passes object to `addDepartment(object)` function where it is added to the database table `supervisor`

#### Create New Department
  * Prompts the user to enter values (temporarily stored as variables):
    1. `department name` - string
    2. `cost` - number > 0
    3. `revenue` - number > 0
  
  * Object is created with key:value pairs set to the corresponding user input
  * `addDepartment(object)` is called to add the object as a row in the `supervisor` database

#### addDepartment(object) function
  * Create/overwrite supervisor table in myzon database
    * Add the object passed as a param to the `supervisor` table in the database
