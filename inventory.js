let itemCreator = {
  createItem(name, category, quantity) {
    const validatedName = this.validateName(name);
    const validatedCategory = this.validateCategory(category);

    if (validatedName && validatedCategory) {
      return {
        name: validatedName,
        category: validatedCategory,
        quantity: quantity,
        SKU: this.generateSKU(validatedName, validatedCategory),
      };
    } else {
      return null;
    }
  },

  validateCategory(category) {
    if ((!/\s/.test(category)) && (category.length >= 5)) {
      return category;
    } else {
      console.log(`Invalid category. Must consist of at least 5 letters and be one word.`);
      return null;
    }
  },

  generateSKU(name, category) {
    return name.slice(0, 3).toUpperCase() + category.slice(0, 2).toUpperCase();
  },

  validateName(nameInput) {
    if (nameInput.split('').filter(char => char !== ' ').length >= 5) {
      return nameInput;
    } else {
      console.log('Must consist of at least 5 characters excluding spaces.');
      return null;
    }
  }
};

let ItemManager = {
  items: [],

  create(itemName, category, quantity) {
    let newItem = itemCreator.createItem(itemName, category, quantity);
    if (newItem) { // Check if item is valid
      console.log(`${newItem.name} has been added.`);
      this.items.push(newItem); // Add valid item to the list
      return newItem;
    } else {
      console.log('New item not created.');
      return null;
    }
  },

  update(SKU, object) {
    this.items.forEach(item => {
      if (item.SKU === SKU) {
        Object.assign(item, object); // Update item properties
      }
    });
  },

  delete(SKU) {
    this.items = this.items.filter(item => item.SKU !== SKU); // Remove item by SKU
    console.log(`Item with SKU: ${SKU} has been deleted.`);
  },

  itemsList() {
    if (this.items.length === 0) {
      console.log(`The list is empty.`);
    } else {
      console.log(`The current list of items are:`);
      this.items.forEach(item => console.log(item.name));
    }
  },

  inStock() {
    console.log('The items in stock are:');
    this.items.filter(item => item.quantity > 0).forEach(item => console.log(item.name)); // Log in-stock items
  },

  itemsInCategory(itemCategory) {
    console.log(`The list of items in category ${itemCategory} are:`);
    this.items.filter(item => item.category === itemCategory).forEach(item => console.log(item.name)); // Log items by category
  },
};

let ReportManager = {
  init(itemManager) {
    this.itemManager = itemManager; // Initialize with itemManager
  },

  itemInfo(SKU) {
    const item = this.itemManager.items.find(item => item.SKU === SKU); // Find item by SKU
    if (item) {
      return {
        item: item,
        itemInfo: function() {
          for (let property in item) {
            console.log(`${property} : ${item[property]}`);
          }
        }
      };
    }
  },

  reportInStock() {
    let inStockItems = this.itemManager.items.filter(item => item.quantity > 0).map(item => item.name); // Get in-stock items
    console.log(`The items in stock are: ${inStockItems.join(', ')}`);
  }
}

// Example usage:
ItemManager.create('basket ball', 'sports', 0);           // valid item
ItemManager.create('asd', 'sports', 0);                   // invalid item
ItemManager.create('soccer ball', 'sports', 5);           // valid item
ItemManager.create('football', 'sports');                 // invalid item (missing quantity)
ItemManager.create('football', 'sports', 3);              // valid item
ItemManager.create('kitchen pot', 'cooking items', 0);    // invalid item
ItemManager.create('kitchen pot', 'cooking', 3);          // valid item

// logs the valid items
console.log(ItemManager.items);

ReportManager.init(ItemManager);

// logs soccer ball, football, kitchen pot
ReportManager.reportInStock();

ItemManager.update('SOCSP', { quantity: 0 });
// logs football, kitchen pot
ItemManager.inStock();
// logs football, kitchen pot
ReportManager.reportInStock();

// logs basket ball, soccer ball, football
ItemManager.itemsInCategory('sports');

ItemManager.delete('SOCSP');
// logs remaining valid items
console.log(ItemManager.items);

let kitchenPotReporter = ReportManager.itemInfo('KITCO');
kitchenPotReporter.itemInfo(); // logs details of kitchen pot

ItemManager.update('KITCO', { quantity: 10 });
kitchenPotReporter.itemInfo(); // logs updated details of kitchen pot
