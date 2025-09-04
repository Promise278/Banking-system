import chalk from "chalk";
import readline from "readline";
import fs from "fs";


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let currentUser = null;

console.log("\n=== CraftCash Banking System ===")

function register(callback) {
    console.log(chalk.blue("Register"))
    rl.question("Enter your Fullname ", (name) => {
        rl.question("Enter your password ", (password) => {
            rl.question("Enter your 4 digit PIN ", (pin) => {
                pin = Number(pin)
                currentUser = { name, password, pin, balance: 100 }
                fs.appendFileSync("customers.json", JSON.stringify([currentUser]) + "\n")
                console.log(chalk.green("User Registered successfully!"))
                callback()
            })
        })
    })
}


function login() {
    console.log(chalk.blue("\n= Login ="))
    rl.question("Enter your name ", (name) => {
        rl.question("Enter your password ", (password) => {
            if (currentUser && currentUser.name === name && currentUser.password === password) {
                console.log(chalk.green("User Login successfully!"))
                checkBalance()
                transferMoney()
            } else {
                console.log(chalk.red("Invalid name or password"));
                login();
            }
        })
    })
}


function transferMoney() {
    console.log(chalk.blue("\n= TransferMoney ="))
    rl.question("Enter recipient name: ", (recipientName) => {
        rl.question("Enter amount to transfer: ", (amt) => {
            let amount = Number(amt);
            currentUser.balance -= amount;
            console.log(chalk.green(`You received ${amount} from ${recipientName}`))
            console.log(chalk.yellow(`Your new balance: ${currentUser.balance}`));
            notification(recipientName);
            changePin()
        })
    })
}

function notification() {
    rl.setPrompt(`Recieved successfully from ${currentUser.name}`)
    rl.prompt()
}

function checkBalance() {
    console.log(chalk.yellow(`Your balance: ${currentUser.balance}`));
}

function changePin() {
    console.log(chalk.blue("\n= Change PIN ="))
    rl.question("Enter your current PIN: ", (oldPin) => {
        if (Number(oldPin) !== currentUser.pin) {
            console.log(chalk.red("Incorrect current PIN."));
            return changePin();
        }
        rl.question("Enter your new 4-digit PIN: ", (newPin) => {
            newPin = Number(newPin);
            if (isNaN(newPin) || newPin.toString().length !== 4) {
                console.log(chalk.red("PIN must be exactly 4 digits."));
                return changePin();
            }
            currentUser.pin = newPin;
            console.log(chalk.green("PIN changed successfully!"));
        })
    })
}

register(login);
