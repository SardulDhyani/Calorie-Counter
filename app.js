// Storage Controller
const StorageCtrl = ( function(){
    // Public Methods
    return{
        storeItem : function(item){
            let items;
            // Check if any items in LS
            if(localStorage.getItem('items') === null ){
                items = [];

                // Push new item
                items.push(item);

                // Set LS
                localStorage.setItem('items', JSON.stringify(items));
            } else{
                // get items from LS
                items = JSON.parse(localStorage.getItem('items'));

                // Push new Item
                items.push(item);

                // Re set Ls 
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage : function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            } else{
                items = JSON.parse(localStorage.getItem('items'));
            }

            return items;
        },
        updateItemStorage   : function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));

            // loop through items
            items.forEach( (item, index) => {
                if( updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            } );
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage : function(id){
            let items = JSON.parse(localStorage.getItem('items'));

            // Loop through items
            items.forEach( (item, index) => {
                if(id === item.id){
                    items.splice(index, 1);
                }
            } );
            localStorage.setItem('items', JSON.stringify(items));

        },
        deleteAllItemsFromStorage : function(){
            localStorage.removeItem('items'); 
        }
    }
} )();

// Item Controller
const ItemCtrl = (function(){

    // Private
    
    // Item Constructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure / State
    const data = {
        // items : [
        //     // {id : 0, name : 'Steak Dinner', calories : 1200},
        //     // {id : 1, name : 'Cookie', calories : 200},
        //     // {id : 2, name : 'Ice Cream', calories : 100}
        // ],
        items : StorageCtrl.getItemsFromStorage(),
        currentItem : null,
        totalCalories : 0
    }

    // Public
    return{
        getItems : function(){
            return data.items;
        },
        addItem  : function(name, calories){
            let ID;

            // create id dynamically
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            } else{
                ID = 0;
            }

            // convert calories string to number
            calories = parseInt(calories);

            // create new item
            newItem = new Item(ID, name, calories);

            // push into ds
            data.items.push(newItem);

            return newItem;
        },
        getItemById : function(id){
            let found = null;
            // loop through items
            data.items.forEach( (item) => {
                if(item.id === id){
                    found = item;
                }
            } );

            return found;
        },
        updateItem : function(name, calories){
            // calories to number
            calories = parseInt(calories);

            let found = null;

            data.items.forEach( (item) => {
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            } );

            return found;
        },
        deleteItem : function(id){
            // get ids
            ids = data.items.map(function(item){
                return item.id;
            });

            // Get Index
            const index = ids.indexOf(id);

            // Remove items
            data.items.splice(index, 1);
        },
        clearAllItems : function(){
            data.items = [];
        },
        getTotalCalories : function(){
            let total = 0;
            data.items.forEach( (item) =>{
                total += item.calories;
            } );
            data.totalCalories = total;

            return data.totalCalories;
        },
        getCurrentItem : function(){
            return data.currentItem;
        },
        setCurrentItem : function(item){
            data.currentItem = item;
        },
        logData : function(){
            return data;
        }
    }

})();


// UI controller
const UICtrl = (function(){
    const UISelectors = {
        itemsList : '#item-list',
        listItems : '#item-list li',
        addBtn    : '.add-btn',
        updateBtn    : '.update-btn',
        deleteBtn    : '.delete-btn',
        clearBtn    : '.clear-btn',
        backBtn    : '.back-btn',
        itemName  : '#item-name',
        itemCalories : '#item-calories',
        calorieCounter : '.total-calories'
    };
    // Public methods
    return{
        populateItemList : function(items){
            let html = '';

            items.forEach( (item)=> {
                html += ` <li id="item-${item.id}" class="collection-item" > <strong> ${item.name} : </strong> <em> ${item.calories} Calories</em> <a href="#" class="secondary-content"> <i class="edit-item fa fa-pencil"></i> </a> </li> `;
            } );

            // Insert list item
            document.querySelector(UISelectors.itemsList).innerHTML = html;
        },
        getItemInput : function(){
            return{
                name : document.querySelector(UISelectors.itemName).value,
                calories : document.querySelector(UISelectors.itemCalories).value
            }
        },
        addListItem : function(item){
            // Show list 
            document.querySelector(UISelectors.itemsList).style.display = 'block';

            // Create li element
            const li =  document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `<strong> ${item.name} : </strong> <em> ${item.calories} Calories</em> <a href="#" class="secondary-content"> <i class="edit-item fa fa-pencil"></i> </a>`;

            // insert to Html
            document.querySelector(UISelectors.itemsList).insertAdjacentElement('beforeend', li);     
        },
        updateListItem : function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);
            // returns node list => turn node list into array (loop through node list)
            listItems = Array.from(listItems);
            listItems.forEach( (listitem) => { 
                const ItemId = listitem.getAttribute('id');
                if(ItemId === `item-${item.id}`){
                    document.querySelector(`#item-${item.id}`).innerHTML = `<strong> ${item.name} : </strong> <em> ${item.calories} Calories</em> <a href="#" class="secondary-content"> <i class="edit-item fa fa-pencil"></i> </a>`;
                }
            });

        },
        clearInputs : function(){
            // Clear inputs
            document.querySelector(UISelectors.itemName).value = ''; 
            document.querySelector(UISelectors.itemCalories).value = '';
        },
        addItemToForm : function(){
            document.querySelector(UISelectors.itemName).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCalories).value = ItemCtrl.getCurrentItem().calories;

            // Display update delete buttons
            UICtrl.showEditState();
        },
        showEditState : function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            
            document.querySelector(UISelectors.backBtn).style.display = 'inline'
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        hideList : function(){
            document.querySelector(UISelectors.itemsList).style.display = 'none';
        },
        showTotalCalories : function(totalCalories){
            // console.log(totalCalories);
            document.querySelector(UISelectors.calorieCounter).textContent  = totalCalories;
        },
        clearEditState : function(){
            UICtrl.clearInputs();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        deleteListItem : function(id){
            const itemId = `#item-${id}`;
            const item = document.querySelector(itemId);
            item.remove();
            UICtrl.clearEditState();
        },
        removeAllItems  : function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);
            // Turn node list into array
            listItems = Array.from(listItems);
            listItems.forEach( (item) => {
                item.remove();
            } );
        },
        getSelectors : function(){
            return UISelectors;
        }
    }
    
})();


// App Controller
const App = (function(ItemCtrl, StorageCtrl,UICtrl){

    // Load event listners
    const loadEventListners = function(){
        // Get UI Selectors
        const UISelectors = UICtrl.getSelectors();

        // Load Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // Disable submit on enter
        document.addEventListener('keypress', (e) => {
            if(e.keyCode === 13 || e.which === 13 ){
                e.preventDefault();
                return false;
            }
        });

        // Load Edit icon click event
        document.querySelector(UISelectors.itemsList).addEventListener('click', itemEditClick);

        // Update item event 
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // Back button event 
        document.querySelector(UISelectors.backBtn).addEventListener('click', (e) => { 
            UICtrl.clearEditState();
            e.preventDefault();
        });

        // Delete item event 
        document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteSubmit);

        // Clear All items Event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    }

    

    // Add item submit
    function itemAddSubmit(e){
        // Get form input from ui ctrl
        const input = UICtrl.getItemInput();

        // Check for inputs
        if(input.name !== '' && input.calories !== ''){
            // Add Item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            
            // Add item to UI list
            UICtrl.addListItem(newItem);

            // update total calories in ui
            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);

            // Store in LS
            StorageCtrl.storeItem(newItem);

            // Clear Inputs    
            UICtrl.clearInputs();
        }
        
        

        e.preventDefault();
    }

    // Click Edit Item
    function itemEditClick(e){
        
        if(e.target.classList.contains('edit-item')){
            // get list item id
            const listId = e.target.parentNode.parentNode.id;
            
            // Break into an array
            const listIdArr = listId.split('-');

            // Get actual Id
            const id = parseInt(listIdArr[1]);

            // Get item
            const itemToEdit = ItemCtrl.getItemById(id);

            // set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            // add item to form 
            UICtrl.addItemToForm();
        }
        e.preventDefault();
    }

    // UPDATE ITEM on submit
    function itemUpdateSubmit(e){
        // Get Item Inpur
        const input = UICtrl.getItemInput();

        // Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        // Update UI
        UICtrl.updateListItem(updatedItem);

        // update total calories in ui
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);

        // UPDATE IN LS
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState(updatedItem);

        e.preventDefault();
    }

    // Delete item
    function itemDeleteSubmit(e){
        // Get current item
        const currentItem = ItemCtrl.getCurrentItem();

        // Delete from DS
        ItemCtrl.deleteItem(currentItem.id);

        // Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        // Update calories
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);

        StorageCtrl.deleteItemFromStorage(currentItem.id);

        // Clear Edit State
        UICtrl.clearEditState();

        e.preventDefault();
    }

    // Clear All Items
    function clearAllItemsClick(e){
        // Delete all items from ds
        ItemCtrl.clearAllItems();

        // update totalCalories
        totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);

        // Delete from UI
        UICtrl.removeAllItems();

        // DELETE ALL FROM LS
        StorageCtrl.deleteAllItemsFromStorage();

        // Hide UL
        UICtrl.hideList();

        e.preventDefault();
    }

    // Public Methods
    return{
        init : function(){
            // Clear edit state
            UICtrl.clearEditState();

            // Fetch items from data structure
            const items =ItemCtrl.getItems(); 
            // Check if any items
            if(items.length === 0){
                UICtrl.hideList();
            } else{
                // Populate list with items
                UICtrl.populateItemList(items);
            }

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // Add total calories to ui
            UICtrl.showTotalCalories(totalCalories);

            // Call Load Event Listner
            loadEventListners();


        }
    }
    
})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize App
App.init();

// Code present in App controller init is necessery things which are needed when application starts