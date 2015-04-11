
var THEME = require("themes/flat/theme");
var BUTTONS = require("controls/buttons");


//dictionary: item --> shelf number
 

var currentScreenName = "";
var previousScreenName = "";


//current scanned item: name and weight
var currScannedItem = {
	name:"",
	individualWeight:0
};

var itemDetectedShelfNumber = -1;

deviceURL_scanner = "";
deviceURL = "";

var valueReceived = false;

/*******Jamie************/


/*******Naren************/

var itemType = -1;
var itemValue = -1;

var data = {
	scannedValue: -1,
	scannedWeight: -1
};

var BackButtonTemplate = BUTTONS.Button.template(function($){ return{
	left: 10, right: 10, top:10, height:50, skin: buttonSkin,
	contents: [
		new Label({left:0, right:0, height:40, string:$.textForLabel, style: $.textFormat})
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			mainContainer.remove(mainContainer.last);
			mainContainer.add(homeWidget);
			previousScreenName = currentScreenName;
			currentScreenName = "homeWidget";
		}}
	})
}});

var ScanButtonTemplate = BUTTONS.Button.template(function($){ return{
	left: 10, right: 10, top:10, height:50, skin: buttonSkin,
	contents: [
		new Label({left:0, right:0, height:40, string:$.textForLabel, style: $.textFormat})
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			mainContainer.remove(mainContainer.last);
			mainContainer.add(scanInventory);
			previousScreenName = currentScreenName;
			currentScreenName = "scanInventory";
		}}
	})
}});

var MainShelfButtonTemplate = BUTTONS.Button.template(function($){ return{
	left: 10, right: 10, top:10, height:50, skin: buttonSkin,
	contents: [
		new Label({left:0, right:0, height:40, string:$.textForLabel, style: $.textFormat})
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			mainContainer.remove(mainContainer.last);
			mainContainer.add(mainShelf);
		}}
	})
}});

var locateItemButtonTemplate = BUTTONS.Button.template(function($){ return{
	left: 10, right: 10, top:10, height:50, skin: buttonSkin,
	contents: [
		new Label({left:0, right:0, height:40, string:$.textForLabel, style: $.textFormat})
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			mainContainer.remove(mainContainer.last);
			mainContainer.add(locateItemContainer);
			//locateItemColumn.insert(appleButton, locateItemColumn.last);			
			previousScreenName = currentScreenName;
			currentScreenName = "locateItemContainer";
		}}
	})
}});

var ProceedScanButtonTemplate = BUTTONS.Button.template(function($){ return{
	left: 10, right: 10, top:10, height:50, skin: buttonSkin,
	contents: [
		new Label({left:0, right:0, height:40, string:$.textForLabel, style: $.textFormat})
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			if (valueReceived == true) {
				mainContainer.remove(mainContainer.last);
				mainContainer.add(scanInventoryPlaceItem);
				previousScreenName = currentScreenName;
				currentScreenName = "scanInventoryPlaceItem";
			}
		}}
	})
}});

var ProceedToShowButtonTemplate = BUTTONS.Button.template(function($){ return{
	left: 10, right: 10, top:10, height:50, skin: buttonSkin,
	contents: [
		new Label({left:0, right:0, height:40, string:$.textForLabel, style: $.textFormat})
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			mainContainer.remove(mainContainer.last);
			mainContainer.add(scanInventoryShelfDisplay);
			previousScreenName = currentScreenName;
			currentScreenName = "scanInventoryShelfDisplay";
		}}
	})
}});

var LowItemsButtonTemplate = BUTTONS.Button.template(function($){ return{
	left: 10, right: 10, top:10, height:50, skin: buttonSkin,
	contents: [
		new Label({left:0, right:0, height:40, string:$.textForLabel, style: $.textFormat})
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			mainContainer.remove(mainContainer.last);
			mainContainer.add(lowItemContainer);
			//this should be adding a low items list container
		}}
	})
}});

var smartShelfLogo = Picture.template(function($){ return {
	height: 100, name:"smartShelfLogo", url:"../../SmartShelfLogo.png"
};
});

var scanInventoryText = new Text({left: 0, right: 0, top: 10, height: 40, string: "Scan Inventory", 
								style: new Style({font:"30px", color:"black"}), name:"scanInventoryText"});
var waitingforScannerText = new Text({left: 0, right: 0, top: 10, height: 40, string: "Waiting for scanner...", skin: new Skin({fill: "#FFFFFF"}), 
									style: new Style({font:"25px", color:"black"}), name:"waitingforScannerText"});
var itemTypeText = new Text({left: 0, right: 0, top: 10, height: 40, string: "Item Type: ", skin: new Skin({fill: "#FFFFFF"}), 
									style: new Style({font:"25px", color:"black"}), name:"itemTypeText"});
var itemWeightText = new Text({left: 0, right: 0, top: 10, height: 40, string: "Item Weight: ", skin: new Skin({fill: "#FFFFFF"}), 
									style: new Style({font:"25px", color:"black"}), name:"itemWeightText"});
var detectedText = new Text({left: 0, right: 0, top: 10, height: 40, string: "Item detected", skin: new Skin({fill: "#FFFFFF"}), 
									style: new Style({font:"25px", color:"black"}), name:"detectedText"});
var placeItemText = new Text({left: 0, right: 0, top: 10, height: 40, string: "Place item on shelf", skin: new Skin({fill: "#FFFFFF"}), 
									style: new Style({font:"25px", color:"black"}), name:"placeItemText"});

var bigText = new Style({font:"20px", color:"#FFFFFF"});
var buttonSkin = new Skin({fill:"#00AA44"});
var greySkin = new Skin({fill:"#AAAAAA"});
var whiteSkin = new Skin({fill:"white"});

var backButton = new BackButtonTemplate({textForLabel:"Back", name: "backButton", textFormat: bigText});
//FIXME: back and home do the same thing now. Need to track previous screen to implement back correctly
var homeButton = new BackButtonTemplate({textForLabel:"Home", name: "homeButton", textFormat: bigText});
var scanButton = new ScanButtonTemplate({textForLabel:"Scan", name: "scanButton", textFormat: bigText});
var mainShelfButton = new MainShelfButtonTemplate({textForLabel:"Main Shelf", name: "mainShelfButton", textFormat: bigText});
var locateItemButton = new locateItemButtonTemplate({textForLabel:"Locate Item", name: "locateItemButton", textFormat: bigText});
var proceedScanButton = new ProceedScanButtonTemplate({textForLabel:"Proceed", name: "proceedScanButton", textFormat: bigText});
var proceedToShowButton = new ProceedToShowButtonTemplate({textForLabel:"Proceed", name: "proceedToShowButton", textFormat: bigText});
var lowItemsButton = new LowItemsButtonTemplate({textForLabel:"Low Items", name: "lowItemsButton", textFormat: bigText});

Handler.bind("/discover", Behavior({
	onInvoke: function(handler, message){
		if (JSON.parse(message.requestText).id == "bluetoothscanner") {
			deviceURL_scanner = JSON.parse(message.requestText).url;
		}
		else if (JSON.parse(message.requestText).id == "smartshelfdevice") {
			deviceURL = JSON.parse(message.requestText).url;
		}
	}
}));

Handler.bind("/forget", Behavior({
	onInvoke: function(handler, message){
		if (JSON.parse(message.requestText).id == "bluetoothscanner") {
			deviceURL_scanner = "";
		}
		else if (JSON.parse(message.requestText).id == "smartshelfdevice") {
			deviceURL = "";
		}
	}
}));

Handler.bind("/getScannerData", {
    onInvoke: function(handler, message){
    	handler.invoke(new Message(deviceURL_scanner + "getData"), Message.JSON);
    },
    onComplete: function(handler, message, json){
    	if (deviceURL_scanner != "") {
			data.scannedValue = json.value.toFixed(0);
			data.scannedWeight = json.weight.toFixed(0);
			if (data.scannedValue != 0 && data.scannedWeight != 0) {
				valueReceived = true;
				waitingforScannerText.string = "Value received";
				itemType = data.scannedValue
				itemWeight = data.scannedWeight;
				var value = itemType;
				currScannedItem.individualWeight = itemWeight;
				if (value == 1) {
					currScannedItem.name = "Apples"
				}
				if (value == 2) {
					currScannedItem.name = "Oranges"
				}
				if (value == 3) {
					currScannedItem.name = "Carrots"
				}
				if (value == 4) {
					currScannedItem.name = "Bananas"
				}
				if (value == 5) {
					currScannedItem.name = "Celery"
				}
				if (value == 6) {
					currScannedItem.name = "Potatoes"
				}

				itemTypeText.string = "Item Type: " + currScannedItem.name;
				itemWeightText.string = "Item Weight: " + currScannedItem.individualWeight + "g";
			}
			else {
				waitingforScannerText.string = "Waiting for scanner...";
				valueReceived = false;
			}
		}
		handler.invoke( new Message("/delayScanner"));
    }
});


Handler.bind("/delayScanner", {
    onInvoke: function(handler, message){
        handler.wait(1000); //will call onComplete after 1 seconds
    },
    onComplete: function(handler, message){
        handler.invoke(new Message("/getScannerData"));
    }
});

var itemInformationObjects = [];

Handler.bind("/getItemData", {
	onInvoke: function(handler, message){
    	if(deviceURL != "") handler.invoke(new Message(deviceURL + "getAllItemInformation"), Message.JSON);
    	else handler.invoke(new Message("/delayItemData"));
	},
	onComplete: function(handler, message, json){
		itemInformationObjects = json;
		trace("App Side: " + json[0].totalWeight.toString() + "\n" );
        handler.invoke(new Message("/delayItemData"));
	}
});

Handler.bind("/delayItemData", {
    onInvoke: function(handler, message){
        handler.wait(1000); //will call onComplete after 1 seconds
    },
    onComplete: function(handler, message){
        handler.invoke(new Message("/getItemData"));
    }
});

Handler.bind("/getNewItem", {
    onInvoke: function(handler, message){
    	if(deviceURL != "") {
	    	var msg = new Message(deviceURL + "newItem");
	    	msg.requestText = JSON.stringify(currScannedItem);
	    	handler.invoke(msg, Message.JSON);
	    }else handler.invoke( new Message("/delayNewItem"));
    },
    onComplete: function(handler, message, json){
    	if (deviceURL != "") {
			trace("Item detected on shelf: " +json.newShelf + "\n");
			if (json.newShelf != -1) {
				if (currentScreenName == "scanInventoryPlaceItem") {
					itemDetectedShelfNumber = json.newShelf;
					trace("New item detected on ", json.newShelf);
					switch (itemDetectedShelfNumber) {
						case 0: box0.first.next.skin = itemDetectedSkin;
								break;
						case 1: box1.first.next.skin = itemDetectedSkin;
								break;
						case 2: box2.first.next.skin = itemDetectedSkin;
								break;
						case 3: box3.first.next.skin = itemDetectedSkin;
								break;
						case 4: box4.first.next.skin = itemDetectedSkin;
								break;
						case 5: box5.first.next.skin = itemDetectedSkin;
								break;
					}
					mainContainer.remove(mainContainer.last);
					mainContainer.add(mainShelf);
					previousScreenName = currentScreenName;
					currentScreenName = "mainShelf";
				}
			}
			else {
				if (currentScreenName != "mainShelf" && itemDetectedShelfNumber != -1) {
					box1.first.next.skin = boxSkin;
					switch (itemDetectedShelfNumber) {
						case 0: box0.first.next.skin = boxSkin;
								break;
						case 1: box1.first.next.skin = boxSkin;
								break;
						case 2: box2.first.next.skin = boxSkin;
								break;
						case 3: box3.first.next.skin = boxSkin;
								break;
						case 4: box4.first.next.skin = boxSkin;
								break;
						case 5: box5.first.next.skin = boxSkin;
								break;
					}
					itemDetectedShelfNumber = -1;
				}
			}
		}
		handler.invoke( new Message("/delayNewItem"));
    }
});

Handler.bind("/delayNewItem", {
    onInvoke: function(handler, message){
        handler.wait(1000); //will call onComplete after 1 seconds
    },
    onComplete: function(handler, message){
        handler.invoke(new Message("/getNewItem"));
    }
});

var navigation = Line.template(function($) { return{
	left: 0, right: 0, top: 0, bottom: 0, height: 50,
	skin: whiteSkin,
	contents:[
		new BackButtonTemplate({textForLabel:"Back", name: "backButton", textFormat: bigText}),
		new BackButtonTemplate({textForLabel:"Home", name: "homeButton", textFormat: bigText})
	]
}});

var scanInventory = new Container({
	left: 0, right: 0, top: 0, bottom: 0, active: true, skin: whiteSkin,
	contents: [
		new Column({
			left: 0, right: 0, top: 5, bottom: 5,
			contents: [
				new smartShelfLogo(),
				scanInventoryText,
				waitingforScannerText,
				proceedScanButton,
				new navigation()
			]
		}),
	]
});

var scanInventoryPlaceItem = new Container({
	left: 0, right: 0, top: 0, bottom: 0, active: true, skin: whiteSkin,
	contents: [
		new Column({
			left: 0, right: 0, top: 5, bottom: 5,
			contents: [
				new smartShelfLogo(),
				//scanInventoryText,
				placeItemText,
				itemTypeText,
				itemWeightText,
				new navigation()
			]
		}),
	]
});

var scanInventoryShelfDisplay = new Container({
	left: 0, right: 0, top: 0, bottom: 0, active: true, skin: whiteSkin,
	contents: [
		new Column({
			left: 0, right: 0, top: 5, bottom: 5,
			contents: [
				new smartShelfLogo(),
				detectedText,
				//shelfImage,
				new navigation()
			]
		}),
	]
});

//FIXME: Should be changed to what Jamie implements for the home screen
var homeWidget = new Container({
	left: 0, right: 0, top: 0, bottom: 0, active: true, skin: whiteSkin,
	contents: [
		new Column({
			left: 0, right: 0, top: 5, bottom: 5,
			contents: [
				new smartShelfLogo(),
				scanButton,
				//FIXME: Dummy button. Should be accessible once Kevin implements changes
				mainShelfButton,				
				locateItemButton,
				lowItemsButton
			]
		}),
	]
});

/*******Tanisha**********/
var boxSkin = new Skin( { fill:"#CD853F" } );
var whiteSkin = new Skin( { fill:"white" } );
var blackSkin = new Skin( { fill:"black" } );
var highlightSkin = new Skin( { fill:"red" } );
var itemDetectedSkin = new Skin( { fill:"green" } );
var LEDSkin = new Skin( { fill:"blue" } );
var labelStyle = new Style( { font: "bold 18px", color:"black" } ); //#32CD32
var stockStyle = new Style( { font: "bold 25px", color:"#778899" } );
var titleStyle = new Style( { font: "bold 40px", color:"black" } );

var mainShelf = new Container({
  left:0, right:0, top:0, bottom:0,
  skin: whiteSkin,
  contents:[
  	new Label({left:0, right:0, top:20, height: 40, string: "Smart Shelf", style: titleStyle}),
    new Container({left:20, right:20, top: 180, height: 15, skin:blackSkin}),
    new Container({left:20, right:20, top:300, height: 15, skin:blackSkin}),
    new Container({left:20, right:20, top:420, height: 15, skin:blackSkin}),
    new navigation()
  ]
});

var box0 = new Container({
  left:20, width: 90, height: 80, top:100,
  skin: highlightSkin,
  name: "box0",
  contents: [
  	new Container({left:25, width:40, top: 80, height: 15, skin:LEDSkin}),
  	//new Label({left:0, right:0, top:0, height: 20, string: "Hello World", style: labelStyle}),
  	//new Container({left:15, width:70, top: 10, height: 70, skin:boxSkin}),
  	new Container({left:10, width:70, top: 30, height: 50, skin:boxSkin}),
  	new Label({left:0, right:0, bottom:75, height: 20, string: "Hello World", style: labelStyle}),
  	new Label({left:0, right:0, top: 7, height: 20, string: "5", style: stockStyle}),
  	//new Content({left:0, right:0, top:0, bottom:0, skin: logoSkin})
  ]
}); 

var box1 = new Container({
  left:115, width: 90, height: 80, top:100,
  skin: highlightSkin,
  name: "box1",
  contents: [
  	new Container({left:25, width:40, top: 80, height: 15, skin:LEDSkin}),
  	new Container({left:10, width:70, top: 30, height: 50, skin:boxSkin}),
  	new Label({left:0, right:0, bottom:75, height: 20, string: "Hello World", style: labelStyle}),
  	new Label({left:0, right:0, top: 7, height: 20, string: "5", style: stockStyle}),
  ]
}); 

var box2 = new Container({
  left:210, width: 90, height: 80, top:100,
  skin: highlightSkin,
  name: "box2",
  contents: [
  	new Container({left:25, width:40, top: 80, height: 15, skin:LEDSkin}),
  	new Container({left:10, width:70, top: 30, height: 50, skin:boxSkin}),
  	new Label({left:0, right:0, bottom:75, height: 20, string: "Hello World", style: labelStyle}),
  	new Label({left:0, right:0, top: 7, height: 20, string: "5", style: stockStyle}),
  ]
}); 

var box3 = new Container({
  left:20, width: 90, height: 80, top:220,
  skin: highlightSkin,
  name: "box3",
  contents: [
  	new Container({left:25, width:40, top: 80, height: 15, skin:LEDSkin}),
  	new Container({left:10, width:70, top: 30, height: 50, skin:boxSkin}),
  	new Label({left:0, right:0, bottom:75, height: 20, string: "Hello World", style: labelStyle}),
  	new Label({left:0, right:0, top: 7, height: 20, string: "5", style: stockStyle}),
  ]
}); 

var box4 = new Container({
  left:115, width: 90, height: 80, top:220,
  skin: highlightSkin,
  name: "box4",
  contents: [
  	new Container({left:25, width:40, top: 80, height: 15, skin:LEDSkin}),
  	new Container({left:10, width:70, top: 30, height: 50, skin:boxSkin}),
  	new Label({left:0, right:0, bottom:75, height: 20, string: "Hello World", style: labelStyle}),
  	new Label({left:0, right:0, top: 7, height: 20, string: "5", style: stockStyle}),
  ]
}); 

var box5 = new Container({
  left:210, width: 90, height: 80, top:220,
  skin: highlightSkin,
  name: "box5",
  contents: [
  	new Container({left:25, width:40, top: 80, height: 15, skin:LEDSkin}),
  	new Container({left:10, width:70, top: 30, height: 50, skin:boxSkin}),
  	new Label({left:0, right:0, bottom:75, height: 20, string: "Hello World", style: labelStyle}),
  	new Label({left:0, right:0, top: 7, height: 20, string: "5", style: stockStyle}),
  ]
}); 

var box6 = new Container({
  left:20, width: 90, height: 80, top:340,
  skin: highlightSkin,
  name: "box6",
  contents: [
  	new Container({left:25, width:40, top: 80, height: 15, skin:LEDSkin}),
  	new Container({left:10, width:70, top: 30, height: 50, skin:boxSkin}),
  	new Label({left:0, right:0, bottom:75, height: 20, string: "Hello World", style: labelStyle}),
  	new Label({left:0, right:0, top: 7, height: 20, string: "5", style: stockStyle}),
  ]
}); 

var box7 = new Container({
  left:115, width: 90, height: 80, top:340,
  skin: highlightSkin,
  name: "box7",
  contents: [
  	new Container({left:25, width:40, top: 80, height: 15, skin:LEDSkin}),
  	new Container({left:10, width:70, top: 30, height: 50, skin:boxSkin}),
  	new Label({left:0, right:0, bottom:75, height: 20, string: "Hello World", style: labelStyle}),
  	new Label({left:0, right:0, top: 7, height: 20, string: "5", style: stockStyle}),
  ]
}); 

var box8 = new Container({
  left:210, width: 90, height: 80, top:340,
  skin: highlightSkin,
  name: "box8",
  contents: [
  	new Container({left:25, width:40, top: 80, height: 15, skin:LEDSkin}),
  	new Container({left:10, width:70, top: 30, height: 50, skin:boxSkin}),
  	new Label({left:0, right:0, bottom:75, height: 20, string: "Hello World", style: labelStyle}),
  	new Label({left:0, right:0, top: 7, height: 20, string: "5", style: stockStyle}),
  ]
}); 



//application.add(mainShelf);
mainShelf.add(box0);
mainShelf.add(box1);
mainShelf.add(box2);
mainShelf.add(box3);
mainShelf.add(box4);
mainShelf.add(box5);
mainShelf.add(box6);
mainShelf.add(box7);
mainShelf.add(box8);

/*******Ji-hern**********/
//Locate Item
var labelStyle = new Style({ font:"bold 20px", color:"white"});
var whiteSkin = new Skin( { fill:"white" } );

var apple = BUTTONS.Button.template(function($){ return{
	left: 20, right: 20, height: 50, skin: new Skin({ fill: "#CCFFCC" }),
	contents: [
		new Label({left:0, right:0, string:"A P P L E S", style: labelStyle}),
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			mainContainer.remove(mainContainer.last);
			mainContainer.add(mainShelf);
			previousScreenName = currentScreenName;
			currentScreenName = "mainShelf";
			if (deviceURL != ""){
				//if (deviceURL != "") content.invoke(new Message(deviceURL + "getFoodCount"), Message.JSON);
			}
		}},
		onComplete: { value: function(content, message, json){
		
		}}
	})
}});

var orange = BUTTONS.Button.template(function($){ return{
	left: 20, right: 20, height: 50, skin: new Skin({ fill: "#FFCC66" }),
	contents: [
		new Label({left:0, right:0, string:"O R A N G E S", style: labelStyle}),
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			mainContainer.remove(mainContainer.last);
			mainContainer.add(mainShelf);
			previousScreenName = currentScreenName;
			currentScreenName = "mainShelf";
			if (deviceURL != ""){
				//if (deviceURL != "") content.invoke(new Message(deviceURL + "getFoodCount"), Message.JSON);
			}
		}},
		onComplete: { value: function(content, message, json){
		}}
	})
}});

var banana = BUTTONS.Button.template(function($){ return{
	left: 20, right: 20, height: 50, skin: new Skin({ fill: "#99CCFF" }),
	contents: [
		new Label({left:0, right:0, string:"B A N A N A S", style: labelStyle}),
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			mainContainer.remove(mainContainer.last);
			mainContainer.add(mainShelf);
			previousScreenName = currentScreenName;
			currentScreenName = "mainShelf";
			if (deviceURL != ""){
				//if (deviceURL != "") content.invoke(new Message(deviceURL + "getFoodCount"), Message.JSON);
			}
		}},
		onComplete: { value: function(content, message, json){
		}}
	})
}});

var potato = BUTTONS.Button.template(function($){ return{
	left: 20, right: 20, height: 50, skin: new Skin({ fill: "#ffc3a0" }),
	contents: [
		new Label({left:0, right:0, string:"P O T A T O E S", style: labelStyle}),
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			mainContainer.remove(mainContainer.last);
			mainContainer.add(mainShelf);
			previousScreenName = currentScreenName;
			currentScreenName = "mainShelf";
			if (deviceURL != ""){
				//if (deviceURL != "") content.invoke(new Message(deviceURL + "getFoodCount"), Message.JSON);
			}
		}},
		onComplete: { value: function(content, message, json){
		}}
	})
}});

var carrot = BUTTONS.Button.template(function($){ return{
	left: 20, right: 20, height: 50, skin: new Skin({ fill: "#fa877a" }),
	contents: [
		new Label({left:0, right:0, string:"C A R R O T S", style: labelStyle}),
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			mainContainer.remove(mainContainer.last);
			mainContainer.add(mainShelf);
			previousScreenName = currentScreenName;
			currentScreenName = "mainShelf";
			if (deviceURL != ""){
				//if (deviceURL != "") content.invoke(new Message(deviceURL + "getFoodCount"), Message.JSON);
			}
		}},
		onComplete: { value: function(content, message, json){
		}}
	})
}});

var celery = BUTTONS.Button.template(function($){ return{
	left: 20, right: 20, height: 50, skin: new Skin({ fill: "#7aedfa" }),
	contents: [
		new Label({left:0, right:0, string:"C E L E R Y", style: labelStyle}),
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			mainContainer.remove(mainContainer.last);
			mainContainer.add(mainShelf);
			previousScreenName = currentScreenName;
			currentScreenName = "mainShelf";
			if (deviceURL != ""){
				//if (deviceURL != "") content.invoke(new Message(deviceURL + "getFoodCount"), Message.JSON);
			}
		}},
		onComplete: { value: function(content, message, json){
		}}
	})
}});

var appleButton = new apple();
var orangeButton = new orange();
var bananaButton = new banana();
var potatoButton = new potato();
var carrotButton = new carrot();
var celeryButton = new celery();

var locateItemColumn = new Column({
	left: 0, right: 0, top: 10, bottom: 0, active: true, skin: whiteSkin, name: "locateItemColumn",
	contents: [
		new navigation()
	]
});

var locateItemContainer = new Container({
	left: 0, right: 0, top: 5, bottom: 0, active: true, skin: whiteSkin,
	contents: [
		new Column({
			left: 0, right: 0, top: 0, bottom: 0,
			contents: [
				new smartShelfLogo(),	
				locateItemColumn,
			]
		}),	
	]
});

//Low Items
var appleLabel = new Label({left:0, right:0, string:"Apples", style: labelStyle});
var orangeLabel = new Label({left:0, right:0, string:"Oranges", style: labelStyle});
var bananaLabel = new Label({left:0, right:0, string:"Bananas", style: labelStyle});
var potatoLabel = new Label({left:0, right:0, string:"Potatoes", style: labelStyle});
var carrotLabel = new Label({left:0, right:0, string:"Carrots", style: labelStyle});
var celeryLabel = new Label({left:0, right:0, string:"Celery", style: labelStyle});

var lowItemColumn = new Column({
	left: 0, right: 0, top: 10, bottom: 0, active: true, skin: whiteSkin, name: "lowItemColumn",
	contents: [
		new navigation()
	]
});

//DOuble check

var lowItemContainer = new Container({
	left: 0, right: 0, top: 5, bottom: 0, active: true, skin: whiteSkin,
	contents: [
		new Column({
			left: 0, right: 0, top: 0, bottom: 0,
			contents: [
				new smartShelfLogo(),	
				lowItemColumn,
			]
		}),	
	]
});

/*******Ji-hern**********/

var mainContainer = new Container({
	left: 0, right: 0, top: 0, bottom: 0, active: true, skin: whiteSkin,
	contents: [
		homeWidget
	],
});

var ApplicationBehavior = Behavior.template({
	onDisplayed: function(application) {
		application.discover("bluetoothscanner");
		application.discover("smartshelfdevice");
	},
	onLaunch: function(application) {
		application.shared = true;
		application.invoke(new Message("/getScannerData"));
		application.invoke(new Message("/getNewItem"));
		application.invoke(new Message("/getItemData"));
	},
	onQuit: function(application) {
		application.forget("bluetoothscanner");
		applicaiton.forget("smartshelfdevice");
		application.shared = true;
	},
})

application.behavior = new ApplicationBehavior();
application.add(mainContainer);
