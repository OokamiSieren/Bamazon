var mysql = require("mysql");
var inquirer = require("inquirer");
var line = "\n" + "---------------------------------------" + "\n";
var connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "password",
  database: "bamazondb"
});

//connect to database
connection.connect(function(err) {
  if (err) throw err;
  console.log("Welcome to Bamazon!" + "\n");
});


//step one display products in table


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
//call purchase function
    purchase();
   
  });
}

displayTable();

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
        message: "How many of this item would you like to purchase?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      connection.query(
        "SELECT * FROM products WHERE id = ?",
        [answer.item],
        function(err, results) {
          if (err) throw err;
          console.log("Your item: " + results[0].product_name + " for $"+ results[0].price);
          
          if (answer.quantity <= results[0].stock_quantity) {
             connection.query(
              "UPDATE products SET stock_quantity = ? WHERE id = ?",
               [
                 {
                   stock_quantity: (results[0].stock_quantity - parseInt(answer.quantity))
                 }
               ],
        console.log("Your total is $ " + answer.quantity * results[0].price.toFixed(2) + " dollars. Thank you for your purchase!")
             );
              
          } else {
            console.log("Insufficent quantity! We only have " + results[0].stock_quantity + ".");
          }
     
    });
    
  }

  )}; 
    

  
  
    
  
    