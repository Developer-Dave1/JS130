class itemCreator {

  constructor(name, category, quantity) {
    this.name = this.validateName(name);
    this.category = this.validateCategory(category);
    this.quantity = 0;
    this.SKU = (this.name && this.category) ? this.generateSKU() : null;
  }

  validateCategory(category) {
    if ((!/\s/.test(category)) && (category.length >= 5)) {''
        return category;
      } else {
        console.log(`Invalid category. Must consist of at least 5 letters and be one word`);
        return null;
      }
  }

  generateSKU() {
      return this.name.slice(0, 3).toUpperCase() + this.category.slice(0, 2).toUpperCase();
    }
  

  validateName(nameInput) {
   if (nameInput.split('').filter(char => char !== ' ').length >= 5) {
    return nameInput;
    } else {
      console.log('Must consist of at least 5 characters excluding spaces.');
      return null;
    }
  }
}


let ItemManager = {
 items: [],
  
  
  create(itemName, category, quantity) {
    let newItem = new itemCreator(itemName, category, quantity);
    if (newItem.SKU) {
      console.log(`${newItem.name} has been added.`);
      this.items.push(newItem);
      return newItem;
    } else {
      console.log('New item not created.');
      return null
    };
  },

  update(SKU, object) {
  this.items.forEach(itemObject => {
    if (itemObject.SKU === SKU) {
      Object.assign(itemObject, object);
     }
   });
  },

  delete(SKU) {
    this.items = this.items.filter(item => item.SKU !== SKU); // Remove item by SKU
    console.log(`Item with SKU: ${SKU} has been deleted.`);
  },

  itemsList() {
    if (ItemManager.items.length === 0) {
      console.log(`the list is empty`);
    } else {
      console.log(`the current list of items are:`);
      ItemManager.items.forEach(item => console.log(item.name));
    }
  },

  inStock() {
    console.log('The items in stock are:');
    this.items.filter(item => item.quantity > 0).forEach(item => console.log(item.name));
  },

  itemsInCategory(itemCategory) {
    console.log(`The list of ${itemCategory} are: `)
    ItemManager.items.forEach(item => {
      if (itemCategory === item.category) {
        console.log(item.name);
      }
    })
  },

}

let ReportManager = {
  init(itemManager) {
    this.itemManager = itemManager;
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
    let inStockItems = this.itemManager.items.filter(item => item.quantity > 0).map(item => item.name);
    console.log(`The items in stock are: ${inStockItems.join(', ')}`);
  }
}

ItemManager.create('basket ball', 'sports', 0);           // valid item
ItemManager.create('asd', 'sports', 0);
ItemManager.create('soccer ball', 'sports', 5);           // valid item
ItemManager.create('football', 'sports');
ItemManager.create('football', 'sports', 3);              // valid item
ItemManager.create('kitchen pot', 'cooking items', 0);
ItemManager.create('kitchen pot', 'cooking', 3);          // valid item
// returns list with the 4 valid items
ItemManager.items;

ReportManager.init(ItemManager);
// logs soccer ball,football,kitchen pot
ReportManager.reportInStock();

ItemManager.update('SOCSP', { quantity: 0 });
// returns list with the item objects for football and kitchen pot
ItemManager.inStock();
// football,kitchen pot
ReportManager.reportInStock();

// returns list with the item objects for basket ball, soccer ball, and football
ItemManager.itemsInCategory('sports');

ItemManager.delete('SOCSP');
// returns list the remaining 3 valid items (soccer ball is removed from the list)
ItemManager.items;

let kitchenPotReporter = ReportManager.itemInfo('KITCO');
kitchenPotReporter.itemInfo();
// logs
// skuCode: KITCO
// itemName: kitchen pot
// category: cooking
// quantity: 3

ItemManager.update('KITCO', { quantity: 10 });
kitchenPotReporter.itemInfo();
// logs
// skuCode: KITCO
// itemName: kitchen pot
// category: cooking
// quantity: 10