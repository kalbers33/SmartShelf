var THEME = require("themes/flat/theme");
var BUTTONS = require("controls/buttons");
 
var labelStyle2 = new Style({ font:"bold 20px", color:"black"});

var skinType = new Array(14);
skinType[0] = new Skin({fill:"#5856d6"});
skinType[1] = new Skin({fill:"#007aff"});
skinType[2] = new Skin({fill:"#34aadc"});
skinType[3] = new Skin({fill:"#5ac8fa"});
skinType[4] = new Skin({fill:"#4cd964"});
skinType[5] = new Skin({fill:"#ff2d55"});
skinType[6] = new Skin({fill:"#ff3b30"});
skinType[7] = new Skin({fill:"#ff9500"});
skinType[8] = new Skin({fill:"#ffcc00"});
skinType[9] = new Skin({fill:"#8e8e93"});
skinType[10] = new Skin({fill:"#00796b"});
skinType[11] = new Skin({fill:"#009688"});
skinType[12] = new Skin({fill:"#b2dfdb"});
skinType[13] = new Skin({fill:"#cddc39"});

var appStyle = new Style({color:"#FFFFFF", font:"25px Roboto"});
 
//Low Items
var appleLabel = new Label({left:0, right:0, string:"Apples", style: labelStyle2});
var orangeLabel = new Label({left:0, right:0, string:"Oranges", style: labelStyle2});
var bananaLabel = new Label({left:0, right:0, string:"Bananas", style: labelStyle2});
var potatoLabel = new Label({left:0, right:0, string:"Potatoes", style: labelStyle2});
var carrotLabel = new Label({left:0, right:0, string:"Carrots", style: labelStyle2});
var celeryLabel = new Label({left:0, right:0, string:"Celery", style: labelStyle2});
 
//list of box containers
var box = [];

//dictionary: item --> shelf number
var shelfDic = {};
var lowDic = {};
 
//Normal Highlight moved for code order issues
var noHighlight = new Skin( { fill:"white" } );
 
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
/*******Tanisha**********/
var boxSkin = new Skin( { fill:"#CD853F" } );
var whiteSkin = new Skin( { fill:"white" } );
var blackSkin = new Skin( { fill:"black" } );
var highlightSkin = new Skin( { fill:"yellow" } );
var redSkin = new Skin( { fill:"red" } );
var itemDetectedSkin = new Skin( { fill:"green" } );
var LEDSkin = new Skin( { fill:"blue" } );
var labelStyle = new Style( { font: "bold 18px", color:"black" } ); //#32CD32
var stockStyle = new Style( { font: "bold 25px", color:"#778899" } );
var titleStyle = new Style( { font: "bold 40px", color:"black" } );

var buttonLogoTemplate = Picture.template(function($){ return {
						height: $.imageSize, name:$.name, url:$.url
					};
				});

var newButtonTemplate = BUTTONS.Button.template(function($){ return{
    left: 0, right: 0, top:0, bottom:0, skin: $.buttonSkin,
    contents: [
		new buttonLogoTemplate({name:$.name, url:$.imageurl, imageSize:$.imageSize}),
        new Label({left:0, right:0, bottom: 10, string:$.textForLabel, style: $.textFormat})
    ],
    behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
        onTap: {
    		value: function(content) {
    			$.buttonFunc(content)
        }}
    })
}});

var newButtonOnlyTemplate = BUTTONS.Button.template(function($){ return{
    top:0, bottom:0, width: 50, skin: $.buttonSkin, left: $.left,
    contents: [
		new buttonLogoTemplate({name:$.name, url:$.imageurl, imageSize:$.imageSize}),
    ],
    behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
        onTap: {
    		value: function(content) {
    			$.buttonFunc(content)
        }}
    })
}});

var mainShelf = new Container({
  left:0, right:0, top:0, bottom:0,
  skin: whiteSkin,
  contents:[
	    new Container({left:20, right:20, top: 180, height: 15, skin:blackSkin}),
	    new Container({left:20, right:20, top:300, height: 15, skin:blackSkin}),
	    new Container({left:20, right:20, top:420, height: 15, skin:blackSkin}),
    //
  ]
});

//Creating box objects
var newBoxTemplate = Container.template(function($){ return{
    left:$.left, width: $.width, height: $.height, top:$.top,
	  skin: noHighlight,
	  name: $.name,
	  contents: [
	  	new Container({left:25, width:40, top: 80, height: 15, skin:LEDSkin}),
	  	new Container({left:10, width:70, top: 30, height: 50, skin:boxSkin}),
	  	new Label({left:0, right:0, bottom:75, height: 20, string: "Hello World", style: labelStyle}),
	  	new Label({left:0, right:0, top: 7, height: 20, string: "5", style: stockStyle}),
	  ]
}});

var box = new Array(10);

box[0] = new newBoxTemplate({left:20, width: 90, height: 80, top:100, name: "box0"})
box[1] = new newBoxTemplate({left:115, width: 90, height: 80, top:100, name: "box[1]"})
box[2] = new newBoxTemplate({left:210, width: 90, height: 80, top:100, name: "box[2]"})
box[3] = new newBoxTemplate({left:20, width: 90, height: 80, top:220, name: "box[3]"})
box[4] = new newBoxTemplate({left:115, width: 90, height: 80, top:220, name: "box[4]"})
box[5] = new newBoxTemplate({left:210, width: 90, height: 80, top:220, name: "box[5]"})
box[6] = new newBoxTemplate({left:20, width: 90, height: 80, top:340, name: "box[6]"})
box[7] = new newBoxTemplate({left:115, width: 90, height: 80, top:340, name: "box[7]"})
box[8] = new newBoxTemplate({left:210, width: 90, height: 80, top:340, name: "box[8]"})

/*******Naren************/

var itemType = -1;
var itemValue = -1;

var data = {
	scannedValue: -1,
	scannedWeight: -1
};

var smartShelfLogo = Picture.template(function($){ return {
	height:200, name:"smartShelfLogo", url:"app_home1.png"
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
				
				if (currentScreenName == "scanInventory") {
					mainContainer.remove(mainContainer.last);
					mainContainer.add(scanInventoryPlaceItem);
					previousScreenName = currentScreenName;
					currentScreenName = "scanInventoryPlaceItem";
				}
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
                for (i = 0; i < itemInformationObjects.length; i++) {
                        var lowCount = false;
                        if (itemInformationObjects[i].status === "low"){
                                lowCount = true;
                        }
                        lowDic[itemInformationObjects[i].name] = [lowCount, itemInformationObjects[i].count];
                }                      
                for (var i = 0; i < 6; i++) {
                        //var count = json[i].count;
                        box[i][3].string = json[i].count;
                        if (itemInformationObjects[i].status === "low") {
                                box[i][0].skin = highlightSkin;
                        } else if (itemInformationObjects[i].status === "out") {
                                box[i][0].skin = redSkin
                        } else {
                                box[i][0].skin = LEDSkin
                        }
                }
        trace("App Side: " + json[0].status + "\n" );
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

var newBackFunc = function(content) {
	trace("in back function");
	box[0].skin = noHighlight;
	box[1].skin = noHighlight;
	box[2].skin = noHighlight;
	box[3].skin = noHighlight;
	box[4].skin = noHighlight;
	box[5].skin = noHighlight;
	switch(previousScreenName) {
		case "scanInventory":
			mainContainer.remove(mainContainer.last);
			mainContainer.add(scanInventory);
			previousScreenName = "homeWidget";
			currentScreenName = "scanInventory";
			break;
		case "scanInventoryPlaceItem":
			mainContainer.remove(mainContainer.last);
			mainContainer.add(scanInventoryPlaceItem);
			previousScreenName = "scanInventory";
			currentScreenName = "scanInventoryPlaceItem";
			break;
		case "locateItemContainer":
			mainContainer.remove(mainContainer.last);
			mainContainer.add(locateItemContainer);
			previousScreenName = "homeWidget";
			currentScreenName = "locateItemContainer";
			break;
		case "lowItemContainer":
			mainContainer.remove(mainContainer.last);
			mainContainer.add(lowItemContainer);
			previousScreenName = currentScreenName;
			currentScreenName = "lowItemContainer";
			break;
		case "mainShelf":
			mainContainer.remove(mainContainer.last);
			mainContainer.add(mainShelf);
			previousScreenName = currentScreenName;
			currentScreenName = "mainShelf";
			break;
		default:
			mainContainer.remove(mainContainer.last);
			mainContainer.add(homeWidget);
			previousScreenName = currentScreenName;
			currentScreenName = "homeWidget";
	}
}

var newHomeFunc = function(content) {
	trace("in home function");
	box[0].skin = noHighlight;
	box[1].skin = noHighlight;
	box[2].skin = noHighlight;
	box[3].skin = noHighlight;
	box[4].skin = noHighlight;
	box[5].skin = noHighlight;
	mainContainer.remove(mainContainer.last);
	mainContainer.add(homeWidget);
	previousScreenName = currentScreenName;
	currentScreenName = "homeWidget";
}

//Bottom navigation bar: skins, logo template, botton template
var nav_skin = new Skin({fill:"black"});

var nav_shelf_skin = new Skin({fill:"#5AC8FB", 
	//borders:{left:2, right:2, top:2, bottom:2}, stroke:"white"
  });
var nav_scan_skin = new Skin({fill:"#FFCD02", 
	//borders:{left:2, right:2, top:2, bottom:2}, stroke:"white"
  });
var nav_low_skin = new Skin({fill:"#007AFF", 
	//borders:{left:2, right:2, top:2, bottom:2}, stroke:"white"
  });
var nav_search_skin = new Skin({fill:"#4CD964", 
	//borders:{left:2, right:2, top:2, bottom:2}, stroke:"white"
  });

var name_to_skin = {"shelf": nav_shelf_skin, "scan": nav_scan_skin, "low": nav_low_skin, "search": nav_search_skin};

var navLogoTemplate = Picture.template(function($){ return {
						bottom: $.bottom, left: $.left_logo, right:0, name:$.name, url:$.url, height: $.size
					};
				});

var newButtonBottomNavTemplate = BUTTONS.Button.template(function($){ return{
    left:$.left, width:82, height:50, bottom:0, skin: nav_skin, name:$.name,
    contents: [
    	new navLogoTemplate({bottom: $.bottom, left_logo: $.left_logo, name: $.name_logo, url: $.url, size: $.size})
    
    ],
    behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
        onTouchEnded: {
          value: function(content) {
            trace("CONTENT NAME:" + content.name + '\n');
            for (var key in name_to_skin) {
              nav = content.container
              if (key != content.name) {
                //nav[key].skin = nav_skin;
            }}
            //content.skin = name_to_skin[content.name];
            $.buttonFunc(content)
        }}

    })
}});

var navigation = Line.template(function($) { return{
	height: 50, left: 0, right: 0, top:0,
	skin: skinType[2],
	contents:[
		new newButtonOnlyTemplate({textForLabel:"", name: "back", textFormat: appStyle, 
					buttonSkin:skinType[2], imageurl: "back_white.png", buttonFunc: newBackFunc, imageSize:20, left: 0 }),
		new newButtonOnlyTemplate({textForLabel:"", name: "home", textFormat: appStyle, 
					buttonSkin:skinType[2], imageurl: "home_white.png", buttonFunc: newHomeFunc, imageSize:20, left: 220})
	]
}});

var shelfNavigationButton = new navigation();
mainShelf.add(shelfNavigationButton);

var scanInventory = new Container({
	left: 0, right: 0, top: 0, bottom: 0, active: true, skin: whiteSkin,
	contents: [
		new Column({
			left: 0, right: 0, top: 0, bottom: 0,
			contents: [
				new navigation(),
				new smartShelfLogo(),
				scanInventoryText,
				waitingforScannerText,
			]
		}),
	]
});

var scanInventoryPlaceItem = new Container({
	left: 0, right: 0, top: 0, bottom: 0, active: true, skin: whiteSkin,
	contents: [
		new Column({
			left: 0, right: 0, top: 0, bottom: 5,
			contents: [
				new navigation(),
				new smartShelfLogo(),
				//scanInventoryText,
				placeItemText,
				itemTypeText,
				itemWeightText,
				
			]
		}),
	]
});

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
                        box[shelfDic["Apples"]].skin = highlightSkin;
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
			box[shelfDic["Oranges"]].skin = highlightSkin;
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
			box[shelfDic["Bananas"]].skin = highlightSkin;
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
			box[shelfDic["Potatoes"]].skin = highlightSkin;
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
			box[shelfDic["Carrots"]].skin = highlightSkin;
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
			box[shelfDic["Celery"]].skin = highlightSkin;
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
        left: 0, right: 0, top: 10, active: true, skin: whiteSkin, name: "locateItemColumn",
        contents: [
                //new navigation()
        ]
});
 
var locateItemContainer = new Container({
        left: 0, right: 0, top: 0, bottom: 0, active: true, skin: whiteSkin,
        contents: [
                new Column({
                        //left: 0, right: 0, top: 5, bottom: 0,
                        left: 0, right: 0, top: 0, bottom: 0,
                        contents: [
                				new navigation(),
                                new smartShelfLogo(),  
                                locateItemColumn,
                               
                        ]
                }),    
        ]
});
 
 
 
var lowItemColumn = new Column({
	left: 0, right: 0, top: 10, bottom: 0, active: true, skin: whiteSkin, name: "lowItemColumn",
	contents: [
		//new navigation()
	]
});


/************Handler: get new item*************/
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
						case 0: box[0].first.next.skin = itemDetectedSkin;
								mainShelf.insert(box[0], mainShelf.last);
								box[0][2].string = currScannedItem.name;
								box[0][3].string = currScannedItem.individualWeight;
								shelfDic[currScannedItem.name] = 0;
								break;
						case 1: box[1].first.next.skin = itemDetectedSkin;
								mainShelf.insert(box[1], mainShelf.last);
								box[1][2].string = currScannedItem.name;
								box[1][3].string = currScannedItem.individualWeight;
								shelfDic[currScannedItem.name] = 1;
								break;
						case 2: box[2].first.next.skin = itemDetectedSkin;
								mainShelf.insert(box[2], mainShelf.last);
								box[2][2].string = currScannedItem.name;
								box[2][3].string = currScannedItem.individualWeight;
								shelfDic[currScannedItem.name] = 2;
								break;
						case 3: box[3].first.next.skin = itemDetectedSkin;
								mainShelf.insert(box[3], mainShelf.last);
								box[3][2].string = currScannedItem.name;
								box[3][3].string = currScannedItem.individualWeight;
								shelfDic[currScannedItem.name] = 3;
								break;
						case 4: box[4].first.next.skin = itemDetectedSkin;
								mainShelf.insert(box[4], mainShelf.last);
								box[4][2].string = currScannedItem.name;
								box[4][3].string = currScannedItem.individualWeight;
								shelfDic[currScannedItem.name] = 4;
								break;
						case 5: box[5].first.next.skin = itemDetectedSkin;
								mainShelf.insert(box[5], mainShelf.last);
								box[5][2].string = currScannedItem.name;
								box[5][3].string = currScannedItem.individualWeight;
								shelfDic[currScannedItem.name] = 5;
								break;
					}
					
					switch(currScannedItem.name) {
						case "Apples":
									locateItemColumn.add(appleButton);
									break;
						case "Bananas":
									locateItemColumn.add(bananaButton);
									break;
						case "Carrots":
									locateItemColumn.add(carrotButton);
									break;
						case "Potatoes":
									locateItemColumn.add(potatoButton);
									break;
						case "Celery":
									locateItemColumn.add(celeryButton);
									break;
						case "Oranges":
									locateItemColumn.add(orangeButton);
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
					box[1].first.next.skin = boxSkin;
					switch (itemDetectedShelfNumber) {
						case 0: box[0].first.next.skin = boxSkin;
								break;
						case 1: box[1].first.next.skin = boxSkin;
								break;
						case 2: box[2].first.next.skin = boxSkin;
								break;
						case 3: box[3].first.next.skin = boxSkin;
								break;
						case 4: box[4].first.next.skin = boxSkin;
								break;
						case 5: box[5].first.next.skin = boxSkin;
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

//DOuble check
 
var lowItemContainer = new Container({
    //left: 0, right: 0, top: 5, bottom: 0, active: true, skin: whiteSkin,
    left: 0, right: 0, top: 0, bottom: 0, active: true, skin: whiteSkin,
    contents: [
        new Column({
            left: 0, right: 0, top: 0, bottom: 0,
            contents: [
            	new navigation(),
                new smartShelfLogo(),  
                lowItemColumn,
            ]
        }),    
    ]
});

var newScanFunc = function(content) {
	trace('newScanFunc\n');
	mainContainer.remove(mainContainer.last);
	mainContainer.add(scanInventory);
	previousScreenName = currentScreenName;
	currentScreenName = "scanInventory";
	scanInventory.last[1].skin = nav_scan_skin
}

var newMainShelfFunc = function(content) {
	trace('newMainShelfFunc\n');
	mainContainer.remove(mainContainer.last);
	mainContainer.add(mainShelf);
	previousScreenName = currentScreenName;
	currentScreenName = "mainShelf";
	mainShelf.last[0].skin = nav_shelf_skin
}

var newLocateFunc = function(content) {
	trace('newLocateFunc\n');
	mainContainer.remove(mainContainer.last);
	mainContainer.add(locateItemContainer);		
	previousScreenName = currentScreenName;
	currentScreenName = "locateItemContainer";
	locateItemContainer.last[3].skin = nav_search_skin
}

var newBackFunc = function(content) {
	box[0].skin = noHighlight;
	box[1].skin = noHighlight;
	box[2].skin = noHighlight;
	box[3].skin = noHighlight;
	box[4].skin = noHighlight;
	box[5].skin = noHighlight;
	switch(previousScreenName) {
		case "scanInventory":
			mainContainer.remove(mainContainer.last);
			mainContainer.add(scanInventory);
			previousScreenName = "homeWidget";
			currentScreenName = "scanInventory";
			break;
		case "scanInventoryPlaceItem":
			mainContainer.remove(mainContainer.last);
			mainContainer.add(scanInventoryPlaceItem);
			previousScreenName = "scanInventory";
			currentScreenName = "scanInventoryPlaceItem";
			break;
		case "locateItemContainer":
			mainContainer.remove(mainContainer.last);
			mainContainer.add(locateItemContainer);
			previousScreenName = "homeWidget";
			currentScreenName = "locateItemContainer";
			break;
		case "lowItemContainer":
			mainContainer.remove(mainContainer.last);
			mainContainer.add(lowItemContainer);
			previousScreenName = currentScreenName;
			currentScreenName = "lowItemContainer";
			break;
		case "mainShelf":
			mainContainer.remove(mainContainer.last);
			mainContainer.add(mainShelf);
			previousScreenName = currentScreenName;
			currentScreenName = "mainShelf";
			break;
		default:
			mainContainer.remove(mainContainer.last);
			mainContainer.add(homeWidget);
			previousScreenName = currentScreenName;
			currentScreenName = "homeWidget";
	}
}

var newLowFunc = function(content) {
	trace('newLowFunc\n');
	lowItemContainer.last[2].skin = nav_low_skin
	mainContainer.remove(mainContainer.last);
    mainContainer.add(lowItemContainer);
	previousScreenName = currentScreenName;
	currentScreenName = "lowItemContainer";
    var keyNames = Object.keys(lowDic);
    lowItemColumn.empty(0);                                
    for (i = 0; i < keyNames.length; i++) {
	    trace("My Key Name: " + keyNames[i] + "\n");
	    if (keyNames[i] == "Apples"){
            if (lowDic["Apples"][0] == true){
                appleLabel.string = "Apples left: " + lowDic["Apples"][1];        
                lowItemColumn.add(appleLabel);        
            }
	    }
	    if (keyNames[i] == "Bananas"){
            if (lowDic["Bananas"][0] == true){
                bananaLabel.string = "Bananas left: " + lowDic["Bananas"][1];        
                lowItemColumn.add(bananaLabel);        
            }                              
	    }
	    if (keyNames[i] == "Carrots"){
            if (lowDic["Carrots"][0] == true){
                carrotLabel.string = "Carrots left: " + lowDic["Carrots"][1];        
                lowItemColumn.add(carrotLabel);        
            }                              
	    }
	    if (keyNames[i] == "Potatoes"){
            if (lowDic["Potatoes"][0] == true){
                potatoLabel.string = "Potatoes left: " + lowDic["Potatoes"][1];        
                lowItemColumn.add(potatoLabel);        
            }                              
	    }              
	    if (keyNames[i] == "Celery"){
            if (lowDic["Celery"][0] == true){
                celeryLabel.string = "Celery left: " + lowDic["Celery"][1];        
                lowItemColumn.add(celeryLabel);        
            }                              
	    }
	    if (keyNames[i] == "Oranges"){
            if (lowDic["Oranges"][0] == true){
                orangeLabel.string = "Oranges left: " + lowDic["Oranges"][1];        
                lowItemColumn.add(orangeLabel);        
            }                              
	    }                                                                                                                                                                                                                                              
	}
    //this should be adding a low items list container
}

var newScanButton = new newButtonTemplate({textForLabel:"Scan Item", name: "newScanButton", textFormat: appStyle, 
					buttonSkin:skinType[10], imageurl: "scan_white.png", buttonFunc: newScanFunc, imageSize:100});
var newMainShelfButton = new newButtonTemplate({textForLabel:"Shelf View", name: "newMainShelfButton", textFormat: appStyle, 
					buttonSkin:skinType[11], imageurl: "shelf_white.png", buttonFunc: newMainShelfFunc, imageSize:100});
var newLocateButton = new newButtonTemplate({textForLabel:"Locate Item", name: "newLocateButton", textFormat: appStyle, 
					buttonSkin:skinType[12], imageurl: "locate_white.png", buttonFunc: newLocateFunc, imageSize:100});
var newLowButton = new newButtonTemplate({textForLabel:"Low Items", name: "newLowButton", textFormat: appStyle, 
					buttonSkin:skinType[13], imageurl: "low_white.png", buttonFunc: newLowFunc, imageSize:100});
					
//CHANGES -TANISHA (NAV BAR TEMPLATE)					
var bottom_navigation =  Container.template(function($) { return{
  left:0, right:0, height:50, bottom:0, name: "navBar",
  skin: redSkin,
  contents: [
    new newButtonBottomNavTemplate({left:0, buttonFunc: newMainShelfFunc, name:"shelf", bottom:0, left_logo: 0, url:"storage.png", name_logo:'shelf_icon', size: 45}),
    new newButtonBottomNavTemplate({left:80, buttonFunc: newScanFunc, name:"scan", bottom: 0, left_logo:0,  url:"scan.png", name_logo: 'scan_icon', size: 50}),
    new newButtonBottomNavTemplate({left:160, buttonFunc:newLowFunc, name:"low", bottom:0, left_logo: 0, url:"low.png", name_logo:'low_icon', size: 50}),
    new newButtonBottomNavTemplate({left:240, buttonFunc: newLocateFunc, name:"search", bottom:5, left_logo: 5, url:"locate.png", name_logo:'locate_icon', size: 40}),
	]
}});


//adding to all screens
scanInventory.add(new bottom_navigation());
scanInventoryPlaceItem.add(new bottom_navigation());
locateItemContainer.add(new bottom_navigation());
lowItemContainer.add(new bottom_navigation());
mainShelf.add(new bottom_navigation());
mainShelf.last[0].skin = nav_shelf_skin;
scanInventoryPlaceItem.add(new bottom_navigation());
scanInventoryPlaceItem.last[1].skin = nav_scan_skin;


var homeWidget = new Container({
    left: 0, right: 0, top: 0, bottom: 0, active: true, skin: whiteSkin,
    contents: [
        new Column({
            left: 0, right: 0, top: 0, bottom: 0,
            contents: [
                new smartShelfLogo(),
                new Column({
                	left:0, right:0, top:0, bottom:0,
                	contents: [
                		new Line({
                			left:0, right:0, top:0, bottom:0,
                			contents: [
                        		newScanButton,
                        		newMainShelfButton,
                        	]
                		}),
                		new Line({
                			left:0, right:0, top:0, bottom:0,
                			contents: [
                    			newLocateButton,
                    			newLowButton
                    		]
                		})
                	]
                })
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
