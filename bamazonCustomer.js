var mysql = require("mysql");
var inquirer = require("inquirer");
var line = "\n" + "---------------------------------------" + "\n";
var connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "password",
  database: "bamazondb"
});

var quantity;

//step one display products in table
//connect to database
connection.connect(function(err) {
  if (err) throw err;
  console.log("Welcome to Bamazon!" + "\n");
});
// display table
function displayTable() {
  connection.query("SELECT * FROM products", function(error, results) {
    if (error) throw error;
    for (i = 0; i < results.length; i++) {
      console.log(
        "id number: " +
          results[i].id +
          "\n" +
          "product name: " +
          results[i].product_name +
          "\n" +
          "price: " +
          results[i].price +
          line
      );
    }

    purchase();
    // connection.end();
  });
}
displayTable();
// step two The app should then prompt users with two messages.
// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.
function purchase() {
  inquirer
    .prompt([
      {
        name: "item",
        type: "input",
        message: "What is the id of the product you want to buy?"
      },
      {
        name: "quantity",
        type: "input",
        message: "How many of this item would you like to purchase?"
      }
    ])
    .then(function(answer) {
      connection.query(
        "SELECT * FROM products WHERE id = ?",
        [answer.item],
        function(err, results) {
          if (err) throw err;
          console.log("Your item: " + results[0].product_name);

          inventory(quantity); //call next function passing inventory variable
        }
      );
    });
}
// new function for inventory
//step three check the inventory and let user know if item is available
// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.
// if your store does have enough of the product, you should fulfill the customer's order.
// This means updating the SQL database to reflect the remaining quantity.
// Once the update goes through, show the customer the total cost of their purchase.
function inventory(answer) {
  var quantity = answer.quantity;
  if (quantity <= stock_quantity) {
    connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
          stock_quantity: (quantity - parseInt(stock_quantity))
        }
      ],

      console.log("Thank You for your purchase!")
    );
  } else {
    console.log("Insufficent quantity!");
  }
}
