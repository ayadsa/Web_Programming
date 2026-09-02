

2. Install dependencies

    ```
    npm i chalk
    npm i nodemon -D
    npm i express --save
    npm i readline-sync -S
    npm i body-parser --save
    ```

3. Run the application (Web server port - 3000)

    ```
    node server
    ```

4. To modify the data file, run the script

    ```
    node admin
    ```

Functionality

#### Поиск по сайту

To search the site, enter the name of the product in the "Search the site" field located in the header of the page, and select its category from the available options (Playstation / Nintendo Switch / Xbox). Then click on the search button (Magnifying glass). If such a product exists, it will be displayed on the screen; otherwise, the user will receive a message "Nothing found".


#### Cart

The website features a special section called "Cart" with products that the user has added for checkout. To add a product to the cart, simply click on the "Add to Cart" button beneath any item. On the "Cart" tab, the current number of items in the cart is displayed when items are added. Inside the tab, there is a table with columns (Name / Price, rubles / Quantity, pcs / Total cost, rubles) and the total cost of the entire cart is displayed below the table. Additionally, within the tab, users can increase or decrease the quantity of selected items in the cart using the + and - buttons, or delete items using the trash bin button. There is also an option to clear the entire cart using the "Clear Cart" button below the table. If there are no items in the cart, the message "Your cart is empty!" is displayed.

#### Order Submission Form

This form is located in the left part of the "Cart" section. The form includes both mandatory fields (Contact Phone, Address, Delivery Method, Buyer's Full Name, Payment Method) and optional ones (Order Comments, Buyer's Email). When the "Confirm Order" button is clicked, the order is submitted to the database in real-time (Firebase).

#### Viewing Product Information

To view detailed information about a product, double-click on its image.

#### Database Modification in Console

By running the script (execute the command "node admin" from the ./src/server directory), the website administrator can: view information about products by selecting the company and category; change the price of the product, the quantity in stock, and the image. To save the changes, execute the command "Save all changes". It is also possible to undo all unsaved changes with the corresponding command. The administrator can also add and remove products. Management is carried out by selecting the command number.
