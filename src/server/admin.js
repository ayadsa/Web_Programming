"use strict";

const RETURN_BACK = -1;
const CORRECT = true;
const UNCORRECT = false;

const PLAYSTATION = 0;
const NINTENDO_SWITCH = 1;
const XBOX = 2;

const GAME_CONSOLES = 0;
const GAMES = 1;
const ACCESSORIES = 2;

const fs = require("fs");
const readline = require("readline-sync");

const instruction = () => {
    console.log("Select number.");
}

let jsonFile;

const getJSON = () => {
    jsonFile = JSON.parse(fs.readFileSync('../../res/db.json', 'utf-8'));
}

const saveChanges = () => {
    fs.writeFileSync("../../res/db.json", JSON.stringify(jsonFile, null, '\t'));
}

const selectCompanyName = () => {
    let correctCompanyName;
    do {
        console.log("\nSelect company.:");
        let companyName = readline.question(
            "0. Return\n" +
            "1. Playstation\n" +
            "2. Nintendo Switch\n" +
            "3. Xbox\n" +
            "Select Company: ");
        
        correctCompanyName = CORRECT;
        switch (companyName) {
            case "0":
                return RETURN_BACK;
                break;
            case "1":
                return PLAYSTATION;
                break;
            case "2":
                return NINTENDO_SWITCH;
                break;
            case "3":
                return XBOX;
                break;
            default:
                console.log("\nYou have entered an incorrect value, please try again");
                correctCompanyName = UNCORRECT;
                break;
        }
    } while (!correctCompanyName);
}

const selectCategory = () => {
    let correctCategory;
    do {
        console.log("\nSelect Category:");
        let category = readline.question(
            "0. Return\n" +
            "1. Consoles\n" +
            "2. Games\n" +
            "3. Accessories\n" +
            "Command Number: ");
        
        correctCategory = CORRECT;
        switch (category) {
            case "0":
                return RETURN_BACK;
                break;
            case "1":
                return GAME_CONSOLES;
                break;
            case "2":
                return GAMES;
                break;
            case "3":
                return ACCESSORIES;
                break;
            default:
                console.log("\nYou have entered an incorrect value, please try again.");
                correctCategory = UNCORRECT;
                break;
        }
    } while (!correctCategory);
} 

const showOneItem = (numberOfCategory, id) => {
    console.log("\nID: " + jsonFile[numberOfCategory][id]["id"] + 
                   "\nName: " + jsonFile[numberOfCategory][id]["name_of_product"] +
                   "\nPrice: " + jsonFile[numberOfCategory][id]["price"] + 
                   "\nStock quantity: " + jsonFile[numberOfCategory][id]["count_of_product"] +
                   "\nImage source: " + jsonFile[numberOfCategory][id]["url"] +
                   "\nDescription: " + jsonFile[numberOfCategory][id]["description"]);
}

const showItems = () => {
    let nameOfCompany = selectCompanyName();
    if (nameOfCompany === RETURN_BACK) {
        return -1;
    }
    
    let category = selectCategory();
    if (category === RETURN_BACK) {
        return -1;
    }
    
    let numberOfCategory = nameOfCompany * 3 + category;
    let selectedItems = jsonFile[numberOfCategory];
    
    if (Object.keys(selectedItems).length === 0) {
        console.log("\nNo items in this category");
    }
    
    for (let key in selectedItems) {
        showOneItem(numberOfCategory, key);
    }
    
    return numberOfCategory;
}

const changeItem = () => {
    console.log("\nTo modify the item, you need to select its manufacturer and category.");
    let numberOfCategory = showItems();
    if (numberOfCategory === -1 || Object.keys(jsonFile[numberOfCategory]).length === 0) {
        return;
    }
    
    let idOfItem = readline.question("\nPlease enter the ID of the item you want to modify from the list. ");
    if (typeof jsonFile[numberOfCategory][idOfItem] === "undefined") {
        console.log("The item with the given ID does not exist or it belongs to another category.");
        return;
    }
    
    do {
        console.log("\nID изменяемого товара: " + idOfItem);
        let changeAction = readline.question("0. Are you sure you want to go back? Any unsaved changes will be lost.\n" +
                "1. Change price.\n" + 
                "2. Quantity in stock\n" + 
                "3. Change image\n" +
                "4. Change description.\n" +
                "5. Save all changes\n" +
                "6. Cancel all unsaved changes\n" +
                "Number: ");
        
        switch (changeAction) {
            case "0": 
                getJSON();
                return;
                break;
            case "1":
                jsonFile[numberOfCategory][idOfItem]["price"] = 
                    Number(readline.question("\nEnter price: "));
                showOneItem(numberOfCategory, idOfItem);
                break;
            case "2":
                let newCount = Number(readline.question("\nPlease enter the quantity of items in stock: "));
                jsonFile[numberOfCategory][idOfItem]["state"] = 
                    (newCount) ? "In stock." : "Expected arrival";
                jsonFile[numberOfCategory][idOfItem]["count_of_product"] = newCount;
                showOneItem(numberOfCategory, idOfItem);
                break;
            case "3":
                console.log("\nChange the image under the same name along the given path: " +
                           jsonFile[numberOfCategory][idOfItem]["url"]);
                showOneItem(numberOfCategory, idOfItem);
                break;
            case "4":
                console.log("To create a line break in the product description, enter `<br>` at the desired location.");
                jsonFile[numberOfCategory][idOfItem]["description"] =
                    readline.question("\nEnter description: ");
                showOneItem(numberOfCategory, idOfItem);
                break;
            case "5":
                saveChanges();
                break;
            case "6":
                getJSON();
                break;
            default:
                console.log("\nYou entered an incorrect value, please try again.");
                break;
        }
    } while (true);
}

const createID = (numberOfCategory) => {
    let idOfItemNumber;
    
    let keys = Object.keys(jsonFile[numberOfCategory]);
    if (keys.length != 0) {
        idOfItemNumber = Number(keys[keys.length - 1]) + 1;
    } else {
        idOfItemNumber = (numberOfCategory + 1) * 100;
    }
    let idOfItemString = idOfItemNumber + "";
    
    while (keys.indexOf(idOfItemString) != -1) {
        idOfItemNumber++;
        idOfItemString = idOfItemNumber + "";
        if (idOfItemNumber % 100 === 0) {
            idOfItemNumber -= 100;
            idOfItemString = idOfItemNumber + "";
        }
    }
    
    return idOfItemString;
}

const addItem = () => {
    let nameOfCompany = selectCompanyName();
    if (nameOfCompany === RETURN_BACK) {
        return;
    }
    
    let category = selectCategory();
    if (category === RETURN_BACK) {
        return;
    }
    
    let numberOfCategory = nameOfCompany * 3 + category;
    let idOfItem = createID(numberOfCategory);
    
    jsonFile[numberOfCategory][idOfItem] = {
        "id": Number(idOfItem),
        "url": "img/photo-products/"
    }
    
    let newItem = jsonFile[numberOfCategory][idOfItem];
    
    switch (nameOfCompany) {
        case 0:
            newItem["section"] = "Playstation";
            newItem["url"] += "Playstation/";
            break;
        case 1:
            newItem["section"] = "Nintendo Switch";
            newItem["url"] += "Nintendo-Switch/";
            break;
        case 2:
            newItem["section"] = "Xbox";
            newItem["url"] += "Xbox/";
            break;
    }
    
    switch (category) {
        case 0:
            newItem["category"] = "Consoles";
            newItem["url"] += "Console/";
            break;
        case 1:
            newItem["category"] = "Games";
            newItem["url"] += "Game/";
            break;
        case 2:
            newItem["category"] = "Accessories";
            newItem["url"] += "Accessory/";
            break;
    }
    
    newItem["name_of_product"] = readline.question("Enter the product name: ");
    newItem["price"] = Number(readline.question("Enter the price of the product: "));
    newItem["count_of_product"] = Number(readline.question("Enter the quantity of the product in stock: "));
    console.log("To create a line break in the product description, enter <br> where you want the line break to appear.");
    newItem["description"] = readline.question("Enter the product description: ");
    
    switch(newItem["count_of_product"]) {
        case 0: 
            newItem["state"] = "Coming soon";
            break;
        default:
            newItem["state"] = "Available";
            break;
    }
    
    let picture = readline.question("Enter the image name: ");
    console.log("\nПPlace the image in this folder: " + newItem["url"]);
    newItem["url"] += picture;
    
    let correctAddResponse;
    do {
        console.log("\nAre you sure you want to add the item?");
        showOneItem(numberOfCategory, idOfItem);
        let addResponse = readline.question("\nChanges will save?\n" +
                                          "1. Yes\n" +
                                          "2. No\n" +
                                          "Number: ");
        
        correctAddResponse = CORRECT;
        switch (addResponse) {
            case "1":
                saveChanges();
                break;
            case "2":
                delete jsonFile[numberOfCategory][idOfItem];
                break;
            default:
                console.log("Please enter a valid value and try again.");
                correctAddResponse = UNCORRECT;
                break;
        }
    } while (!correctAddResponse);
}

const deleteItem = () => {
    let correctDeleteResponse;
    console.log("\nTo delete a product, you need to select its manufacturer and category..");
    let numberOfCategory = showItems();
    if (numberOfCategory === -1 || Object.keys(jsonFile[numberOfCategory]).length === 0) {
        return;
    }
    
    let idOfItem = readline.question("\nTo delete a product, you need to select its manufacturer and category: ");
    if (typeof jsonFile[numberOfCategory][idOfItem] === "undefined") {
        console.log("It seems like the product with the provided ID doesn't exist or it belongs to a different category");
        return;
    }
    
    do {
        console.log("\nВы уверены, что хотите удалить товар?");
        showOneItem(numberOfCategory, idOfItem);
        let deleteResponse = readline.question("\nChanges will save\n" +
                                          "1. Yes\n" +
                                          "2. No\n" +
                                          "Number: ");
        
        correctDeleteResponse = CORRECT;
        switch (deleteResponse) {
            case "1":
                delete jsonFile[numberOfCategory][idOfItem];
                saveChanges();
                break;
            case "2":
                break;
            default:
                console.log("\nPlease enter a valid value and try again.");
                correctDeleteResponse = UNCORRECT;
                break;
        }
    } while (!correctDeleteResponse);
}

(function () {
    instruction();
    getJSON();
    
    do {
        let primaryAction = readline.question(
            "\n1. View product information\n" +
            "2. Change item\n" + 
            "3. Add item\n" + 
            "4. Delete item\n" +
            "5. Close admin panel\n" +
            "Number: ");
        
        switch (primaryAction) {
            case "1":
                showItems();
                break;
            case "2":
                changeItem();
                break;
            case "3":
                addItem();
                break;
            case "4":
                deleteItem();
                break;
            case "5":
                return 0;
                break;
            default:
                console.log("\nPlease enter a valid value and try again.");
                break;
        }
    } while (true);
})();