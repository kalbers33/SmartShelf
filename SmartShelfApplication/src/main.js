var CONTROLS_THEME = require('themes/flat/theme');
var THEME = require('themes/sample/theme');
for ( var i in CONTROLS_THEME ){
    THEME[i] = CONTROLS_THEME[i]
}
var BUTTONS = require("controls/buttons");
var SCREEN = require('mobile/screen');
var SCROLLER = require('mobile/scroller');
 
var transparent_skin = new Skin({});
 
 
var black_rectange = Picture.template(function($){ return {
	top: $.top, left: $.left, height:70, name:"black_rectange", url:"black.png",
};
});

var black_long_rectange = Picture.template(function($){ return {
	top: $.top, left: $.left, height:70, name:"black_long_rectange", url:"black_long.png",
};
});

var placeItemImage = Picture.template(function($){ return {
	top:30, height:100, name:"place_item", url:"PlaceItem.png",
};
});


 //loading page
var BusyPicture = Picture.template(function($) { return { behavior: Object.create((BusyPicture.behaviors[0]).prototype), url: 'waiting.png', }});
BusyPicture.behaviors = new Array(1);
BusyPicture.behaviors[0] = Behavior.template({
//@line 33
	onCreate: function(picture, data) {
		this.bump = data.speed * 20;
				if ( 0 == this.bump )
					this.bump = 1;
	},
//@line 38
	onLoaded: function(picture) {
		picture.origin = { x:picture.width >> 1, y:picture.height >> 1 };
				picture.scale = { x:0.5, y:0.5 };
				picture.rotation = 0;
				picture.start();
	},
//@line 44
	onTimeChanged: function(picture) {
		var rotation = picture.rotation;
				rotation -= this.bump;
				if (rotation < 0) rotation = 360;
				picture.rotation = rotation;
	},
})

var loading = Container.template(function($) { return { left: 0, right: 0, top: 0, skin: transparent_skin, contents: [
//@line 54
	BusyPicture($, { }),
	
], }});


 
 
 
 
var labelStyle2 = new Style({ font:"bold 20px", color:"black"});

var skinType = new Array(14);
skinType[0] = new Skin({fill:"#5856d6"});
skinType[1] = new Skin({fill:"#007aff"});
skinType[2] = new Skin({fill:"#2B2B2A"});
skinType[3] = new Skin({fill:"#5ac8fa"});
skinType[4] = new Skin({fill:"#4cd964"});
skinType[5] = new Skin({fill:"#ff2d55"});
skinType[6] = new Skin({fill:"#ff3b30"});
skinType[7] = new Skin({fill:"#ff9500"});
skinType[8] = new Skin({fill:"#ffcc00"});
skinType[9] = new Skin({fill:"#8e8e93"});
skinType[10] = new Skin({fill:"#0297A7"});
skinType[11] = new Skin({fill:"#A7D3D6"});
skinType[12] = new Skin({fill:"#B6E2EB"});
skinType[13] = new Skin({fill:"#CDDC34"});

var background_photo = new Texture("background.png");
var background_skin = new Skin({
  width:350,
  height:550,
  right:50,
  texture: background_photo,
  fill:"white"
});

var appStyle = new Style({color:"#FFFFFF", font:"20px Roboto"});



var emptyBoxBehavior = Object.create(Behavior.prototype, {
  onTouchEnded: {value:  function(container, id, x, y, ticks){
 //   trace("You touched at: " + x + ", " + y + "\n");
 //   trace(container.name + "\n");
    //container.opacity = .5;
    newScanFunc(container)
  }}
});

var emptyBox = Picture.template(function($){ return {
	left: $.left, top: $.top,  height:80, width: 100, name:$.name, url:"box.png", behavior: emptyBoxBehavior,
	active: true,
	
};
});

var emptyBoxList = []

emptyBoxList[0] = new emptyBox({left: 15, top:100, name:"ebox0"}),
emptyBoxList[1] = new emptyBox({left: 110, top:100, name:"ebox1"}),
emptyBoxList[2] = new emptyBox({left: 205, top:100, name:"ebox2"}),
emptyBoxList[3] = new emptyBox({left: 15, top:220, name:"ebox3"}),
emptyBoxList[4] = new emptyBox({left: 110, top:220, name:"ebox4"}),
emptyBoxList[5] = new emptyBox({left:205, top:220, name:"ebox5"}),     
	    
emptyBoxList[6] = new emptyBox({left: 15, top:340, name:"ebox6"}),
emptyBoxList[7] = new emptyBox({left: 110, top:340, name:"ebox7"}),
emptyBoxList[8] = new emptyBox({left: 205, top:340, name:"ebox8"}),
//Scroller template

var ScreenContainer = Container.template(function($) { return {
	left:0, right:0, height:200, top:60, //200
	contents: [
	   		/* Note that the scroller is declared as having only an empty
	   		 * Column and a scrollbar.  All the entries will be added 
	   		 * programmatically. */ 
	   		SCROLLER.VerticalScroller($, { 
	   			contents: [
              			Column($, { left: 0, right: 0, height:0, top:10, bottom: 2, name: 'menu', }),
              			SCROLLER.VerticalScrollbar($, { }),
              			]
	   		})
	   		]
	}});
	
var data = new Object();
var locateItemColumn = new ScreenContainer(data);
//locateItemColumn.first.reveal({height: 200});
 
var items = ["Bar Soap", "Coca Cola", "Pringles Original", "Lays Sweet Onion", 
			"Whole Milk", "Low Fat Milk", "Sugar 500g", "Sugar 1kg", "Oats",
			"Cereal", "Olive Oil", "Sunflower Oil", "Charmin Toilet Paper",
			"Bounty Paper Towels", "Cascade Dish Detergent", "Downy Fabric Softner",
			"Vitamin C Tablets", "Pita Chips", "Salter Butter", "Plain Butter"];
/*var items = ["Apple", "Orange", "Banana", "Potato", 
			"Carrot", "Celery"];*/

//Low Items
var itemLabels = new Array(items.length)
for (var i = 0; i < itemLabels.length; i++) {
	itemLabels[i] = new Label({left:0, right:0, string: items[i], style: labelStyle2});
} 

//list of box containers
var box = [];

//dictionary: item --> shelf number
var shelfDic = {};
var lowDic = {};
 
//Normal Highlight moved for code order issues
//var noHighlight = new Skin( { fill:"white" } );
var noHighlight = transparent_skin;
 
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
//var labelStyle = new Style( { font: "bold 18px", color:"black" } ); //#32CD32
var labelStyle_shelf = new Style( { font: "bold 18px", color:"white", horizontal:"center"} );
var stockStyle = new Style( { font: "bold 30px", color:"white"} );
var titleStyle = new Style( { font: "bold 40px", color:"black" } );

var buttonLogoTemplate = Picture.template(function($){ return {
						top: 20, height: $.imageSize, name:$.name, url:$.url
					};
				});
				
var loadingImageTemplate = Picture.template(function($){ return {
						height: 50, url:$.url
					};
				});

var loadingImageWidget = new loadingImageTemplate({url: "barcode_0.png"});

var newButtonTemplate = BUTTONS.Button.template(function($){ return{
    left: 3, right: 3, top:3, bottom:3, skin: $.buttonSkin,
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
  skin: background_skin,
  contents:[
	    new Container({left:20, right:20, top: 180, height: 15, skin:blackSkin}),
	    new Container({left:20, right:20, top:300, height: 15, skin:blackSkin}),
	    new Container({left:20, right:20, top:420, height: 15, skin:blackSkin}),
	    emptyBoxList[0],emptyBoxList[1],emptyBoxList[2],emptyBoxList[3], emptyBoxList[4],emptyBoxList[5],
	    emptyBoxList[6], emptyBoxList[7], emptyBoxList[8],
	    
	    
  ]
});

//Creating box objects
var newBoxTemplate = Container.template(function($){ return{
    left:$.left, width: $.width, height: $.height, top:$.top,
	  skin: noHighlight,
	  name: $.name,
	  contents: [
	  	new Container({left:25, width:40, top: 60, height: 15, skin:LEDSkin}),
	  	new Container({left:10, width:70, top: 10, height: 50, skin:boxSkin}),
	  	new Text({left: 0, right:0, bottom:75, height: 20, string: "Hello World", style: labelStyle_shelf}),
	  	new Label({top: 15, height: 45, string: "5", style: stockStyle}),
	  ]
}});

var box = new Array(10);

box[0] = new newBoxTemplate({left:20, width: 90, height: 60, top:120, name: "box[0]"})
box[1] = new newBoxTemplate({left:115, width: 90, height: 60, top:120, name: "box[1]"})
box[2] = new newBoxTemplate({left:210, width: 90, height: 60, top:120, name: "box[2]"})
box[3] = new newBoxTemplate({left:20, width: 90, height: 60, top:240, name: "box[3]"})
box[4] = new newBoxTemplate({left:115, width: 90, height: 60, top:240, name: "box[4]"})
box[5] = new newBoxTemplate({left:210, width: 90, height: 60, top:240, name: "box[5]"})
box[6] = new newBoxTemplate({left:20, width: 90, height: 60, top:360, name: "box[6]"})
box[7] = new newBoxTemplate({left:115, width: 90, height: 60, top:360, name: "box[7]"})
box[8] = new newBoxTemplate({left:210, width: 90, height: 60, top:360, name: "box[8]"})




/*******Naren************/

var itemType = -1;
var itemValue = -1;

var data = {
	scannedValue: -1,
	scannedWeight: -1
};

var smartShelfLogo = Picture.template(function($){ return {
	top:-25, height:160, name:"smartShelfLogo", url:"logo.png"
};
});





var scanInventoryText = new Text({left: 20, right: 0, top: 20, height: 40, string: "Please scan the item you wish to add on the shelf", 
								style: new Style({font:"25px", color:"white", horizontal: "center"}), name:"scanInventoryText"});
var waitingforScannerText = new Text({left: 60, right: 0, top: -10, height: 40, string: "Waiting for scanner...", horizontal: "center",
									style: new Style({font:"25px", color:"white"}), name:"waitingforScannerText"});
var placeItemText = new Label({top: -220, height: 40, string: "", //Item Type: 
									style: new Style({font:"30px", color:"white"}), name:"placeItemText"});
var itemTypeText = new Label({top: 40, height: 40, string: "", //Item Type: 
									style: new Style({font:"30px", color:"white"}), name:"itemTypeText"});
var itemWeightText = new Label({top: 60 , height: 40, string: "",  //Item Weight: 
									style: new Style({font:"30px", color:"white"}), name:"itemWeightText"});
var detectedText = new Text({left: 0, right: 0, top: 10, height: 40, string: "Item detected", skin: new Skin({fill: "#FFFFFF"}), 

									style: new Style({font:"25px", color:"black"}), name:"detectedText"});
//var placeItemText = new Text({left: 0, right: 0, top: 10, height: 40, string: "Place item on shelf", skin: new Skin({fill: "#FFFFFF"}), 
//									style: new Style({font:"25px", color:"black"}), name:"placeItemText"});
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

var loadingIter = 0;
var loadingImages = ["barcode_0.png", "barcode_1.png", "barcode_2.png", "barcode_3.png",
					"barcode_4.png", "barcode_5.png", "barcode_6.png"];

Handler.bind("/getScannerData", {
    onInvoke: function(handler, message){
    	handler.invoke(new Message(deviceURL_scanner + "getData"), Message.JSON);
    },
    onComplete: function(handler, message, json){
    	if (deviceURL_scanner != "") {
			data.scannedValue = json.value.toFixed(0);
			data.scannedWeight = json.weight.toFixed(0);
			if (data.scannedValue != 0 && data.scannedWeight != 0) {
				loadingIter = 0;
				valueReceived = true;
				waitingforScannerText.string = "Value received";
				itemType = data.scannedValue
				itemWeight = data.scannedWeight;
				var value = itemType;
				currScannedItem.individualWeight = itemWeight;
				
				currScannedItem.name = items[value];

				//itemTypeText.string = "Item Type: " + currScannedItem.name;
				itemTypeText.string = currScannedItem.name;
				//itemWeightText.string = "Item Weight: " + currScannedItem.individualWeight + "g";
				itemWeightText.string = currScannedItem.individualWeight + "g";
				placeItemText.string = "Place item on any shelf";
				if (currentScreenName == "scanInventory") {
					mainContainer.remove(mainContainer.last);
					mainContainer.add(scanInventoryPlaceItem);
					previousScreenName = currentScreenName;
					currentScreenName = "scanInventoryPlaceItem";
				}
			}
			else {
				waitingforScannerText.string = "Waiting for scanner...";
				loadingImageWidget.url = loadingImages[loadingIter];
				loadingIter += 1;
				if (loadingIter == 7) {
					loadingIter = 0;
				}
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
var locatedItem = -1; 

Handler.bind("/getItemData", {
        onInvoke: function(handler, message){
        if(deviceURL != "") handler.invoke(new Message(deviceURL + "getAllItemInformation"), Message.JSON);
        else handler.invoke(new Message("/delayItemData"));
        },
        onComplete: function(handler, message, json){
                itemInformationObjects = json;
                for (var i = 0; i < itemInformationObjects.length; i++) {
                        var lowCount = false;
                        if (itemInformationObjects[i].status === "low"){
                                lowCount = true;
                        }
                        lowDic[itemInformationObjects[i].name] = [lowCount, itemInformationObjects[i].count];
                }                      
                for (var i = 0; i < 9; i++) {
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
	for (i = 0; i < 6; i++) {
		box[i].skin = noHighlight;
	}
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
	for (i = 0; i < 6; i++) {
		box[i].skin = noHighlight;
	}
	mainContainer.remove(mainContainer.last);
	mainContainer.add(homeWidget);
	previousScreenName = currentScreenName;
	currentScreenName = "homeWidget";
}

//Bottom navigation bar: skins, logo template, botton template
var nav_skin = new Skin({fill:"#686868"});

var nav_scan_skin = new Skin({fill:"#0297A7", 
	//borders:{left:2, right:2, top:2, bottom:2}, stroke:"white"
  });
var nav_shelf_skin = new Skin({fill:"#A7D3D6", 
	//borders:{left:2, right:2, top:2, bottom:2}, stroke:"white"
  });
var nav_search_skin = new Skin({fill:"#B6E2EB", 
	//borders:{left:2, right:2, top:2, bottom:2}, stroke:"white"
  }); 
var nav_low_skin = new Skin({fill:"#CDDC34", 
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

var navigation_bar_style = new Style({ font:"bold 28px Dotum", color:"white"});
var navigation = Container.template(function($) { return{
	height: 50, left: 0, right: 0, top:0,
	skin: skinType[2],
	contents:[
		new Label({string:$.displayName, style: navigation_bar_style}),
		new newButtonOnlyTemplate({textForLabel:"", name: "back", textFormat: appStyle, 
					buttonSkin:skinType[2], imageurl: "back_white.png", buttonFunc: newBackFunc, imageSize:20, left: 0 }),
		
		new newButtonOnlyTemplate({textForLabel:"", name: "home", textFormat: appStyle, 
					buttonSkin:skinType[2], imageurl: "home_white.png", buttonFunc: newHomeFunc, imageSize:20, left: 270})
	]
}});

var shelfNavigationButton = new navigation({displayName: "Shelf"});
mainShelf.add(shelfNavigationButton);

var scanInventory = new Container({
	left: 0, right: 0, top: 0, bottom: 0, active: true, skin: background_skin,
	contents: [
		new Column({
			left: 0, right: 0, top: 0, bottom: 0,
			contents: [
				new navigation({displayName: "Scan Inventory"}),
				//new smartShelfLogo(),
				scanInventoryText,
				
				//loadingImageWidget
				new loading( { speed: 0.4 } ), 
				waitingforScannerText,
			]
		}),
	]
});

var scan_place_item_label = new black_long_rectange({top: 20, left: -100});
var scan_item_name_label = new black_rectange({top: 10, left: 15});
var scan_item_weight_label = new black_rectange({top: 20, left: 90});
scan_place_item_label.opacity = 0.7;
scan_item_name_label.opacity = 0.7;
scan_item_weight_label.opacity = 0.7;
scan_item_weight_label.scale = {x:.5,y:1};


var scanInventoryPlaceItem = new Container({
	left: 0, right: 0, top: 0, bottom: 0, active: true, skin: background_skin,
	contents: [
		new Column({
			left: 0, right: 0, top: 0, bottom: 5,
			contents: [
				new navigation({displayName: "Scan Inventory"}),
				scan_place_item_label,
				scan_item_name_label,
				scan_item_weight_label,
				placeItemText,
				itemTypeText,
				itemWeightText,
			]
		}),
	]
});

var labelStyle = new Style({ font:"bold 20px", color:"white", horizontalAlignment: "center"});
 
var whiteSkin = new Skin( { fill:"white" } );

Handler.bind("/locateItemDevice", {
	onInvoke: function(handler, message){
		//This will highlight the item on the shelf, put this somewhere.
		var msg = new Message(deviceURL + "locateItem");
		msg.requestText = JSON.stringify({value: locatedItem});
		if(deviceURL != "") handler.invoke(msg, Message.JSON);
		else handler.invoke(new Message("/locateItemDelay"));
	},
	onComplete: function(handler, message, json){
		handler.invoke(new Message("/locateItemDelay"));
	}
});

Handler.bind("/locateItemDelay", {
	onInvoke: function(handler, message){
		handler.wait(1000);
	},
	onComplete: function(handler, message){
		handler.invoke(new Message("/locateItemDevice"));
	}
});


var inventoryTemplate = BUTTONS.Button.template(function($){ return{
    //left: 20, right: 20, height: 50, skin: new Skin({ fill: "#CCFFCC" }),
    left: 20, right: 20, height: 50, skin: new Skin({ fill: $.color }),
    contents: [
    	new Label({left:0, right:0, string:$.displayName, style: labelStyle}),
    ],
    behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
        onTap: { value: function(content){
        		locatedItem = shelfDic[$.itemName];
        		trace(shelfDic[$.itemName]);
        		for (var key in shelfDic) {
        			//box[shelfDic[key]].skin = whiteSkin;
        			box[shelfDic[key]].skin = transparent_skin;
        		}
                box[shelfDic[$.itemName]].skin = highlightSkin;
                
                mainContainer.remove(mainContainer.last);
                mainContainer.add(mainShelf);
                previousScreenName = currentScreenName;
                currentScreenName = "mainShelf";
        }},
        onComplete: { value: function(content, message, json){
       
        }}
    })
}});




var itemButtons = new Array(items.length);

var button_colors = ["#CCFFCC", "#FFCC66", "#99CCFF", "#ffc3a0", "#fa877a", "#7aedfa"]
for (i = 0; i < itemButtons.length; i++) {
	var chosen_color = i % 6;
	itemButtons[i] = new inventoryTemplate({itemName:items[i], displayName: items[i], color: button_colors[chosen_color]});
}
 
//var locateItemColumn = new Column({
/*
var locateItemColumn = new Scroller({
        left: 0, right: 0, top: 10, active: true, skin: whiteSkin, name: "locateItemColumn",
        contents: [
        ]
});*/
 
var locateItemContainer = new Container({
    left: 0, right: 0, top: 0, bottom: 0, active: true, skin: background_skin,
    contents: [
    	
               // new smartShelfLogo(),  
                locateItemColumn,
                new navigation({displayName: "Locate Item"}),
    /*
        new Column({
            left: 0, right: 0, top: 0, bottom: 0,
            contents: [
            	
				new navigation(),
                new smartShelfLogo(),  
                locateItemColumn,
                
            ]
        }),   */ 
    ]
});

var lowItemColumn = new Column({
	left: 0, right: 0, top: 10, bottom: 0, active: true, skin: transparent_skin, name: "lowItemColumn",
	contents: [
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
			//trace("Item detected on shelf: " +json.newShelf + "\n");
			if (json.newShelf != -1) {
				if (currentScreenName == "scanInventoryPlaceItem") {
					itemDetectedShelfNumber = json.newShelf;
					//trace("New item detected on ", json.newShelf);
					
					box[itemDetectedShelfNumber].first.next.skin = itemDetectedSkin;
					//mainShelf.insert(box[itemDetectedShelfNumber], mainShelf.last);
					mainShelf.add(box[itemDetectedShelfNumber]);
					mainShelf.remove(emptyBoxList[itemDetectedShelfNumber]);
					box[itemDetectedShelfNumber][2].string = currScannedItem.name;
					box[itemDetectedShelfNumber][3].string = currScannedItem.individualWeight;
					shelfDic[currScannedItem.name] = itemDetectedShelfNumber;
					
					for (i = 0; i < items.length; i++) {
						if (items[i] == currScannedItem.name) {
							//locateItemColumn.add(itemButtons[i]);
							//screen.first.menu.add(itemButtons[i]);
							locateItemColumn.first.menu.add(itemButtons[i]);
							break;
						}
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
					box[itemDetectedShelfNumber].first.next.skin = boxSkin;
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
    left: 0, right: 0, top: 0, bottom: 0, active: true, skin: background_skin,
    contents: [
        new Column({
            left: 0, right: 0, top: 0, bottom: 0,
            contents: [
            	new navigation({displayName: "Low Items"}),
                new smartShelfLogo(),  
                lowItemColumn,
            ]
        }),    
    ]
});

var newScanFunc = function(content) {
	mainContainer.remove(mainContainer.last);
	mainContainer.add(scanInventory);
	previousScreenName = currentScreenName;
	currentScreenName = "scanInventory";
	scanInventory.last[1].skin = nav_scan_skin
}

var newMainShelfFunc = function(content) {
	mainContainer.remove(mainContainer.last);
	mainContainer.add(mainShelf);
	previousScreenName = currentScreenName;
	currentScreenName = "mainShelf";
	mainShelf.last[0].skin = nav_shelf_skin
}

var newLocateFunc = function(content) {
	mainContainer.remove(mainContainer.last);
	mainContainer.add(locateItemContainer);		
	previousScreenName = currentScreenName;
	currentScreenName = "locateItemContainer";
	locateItemContainer.last[3].skin = nav_search_skin
}

var newBackFunc = function(content) {
	for (i = 0; i < 9; i++) {
		box[i].skin = noHighlight
	}
	
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
	lowItemContainer.last[2].skin = nav_low_skin
	mainContainer.remove(mainContainer.last);
    mainContainer.add(lowItemContainer);
	previousScreenName = currentScreenName;
	currentScreenName = "lowItemContainer";
    var keyNames = Object.keys(lowDic);
    lowItemColumn.empty(0);                                
    for (i = 0; i < keyNames.length; i++) {
	  //  trace("My Key Name: " + keyNames[i] + "\n");
	    
	    for (var j = 0; j < items.length; j++) {
	    	if (keyNames[i] == items[j]){
	            if (lowDic[items[j]][0] == true){
	                itemLabels[j].string = items[j] + " left: " + lowDic[items[j]][1];        
	                lowItemColumn.add(itemLabels[j]);        
	            }
		    }
		}                                                                                                                                                                                                                             
	}
    //this should be adding a low items list container
}

var newScanButton = new newButtonTemplate({textForLabel:"Add Item", name: "newScanButton", textFormat: appStyle, 
					buttonSkin:skinType[10], imageurl: "scan_white.png", buttonFunc: newScanFunc, imageSize:70});
var newMainShelfButton = new newButtonTemplate({textForLabel:"Shelf View", name: "newMainShelfButton", textFormat: appStyle, 
					buttonSkin:skinType[11], imageurl: "shelf_white.png", buttonFunc: newMainShelfFunc, imageSize:70});
var newLocateButton = new newButtonTemplate({textForLabel:"Locate Item", name: "newLocateButton", textFormat: appStyle, 
					buttonSkin:skinType[12], imageurl: "locate_white.png", buttonFunc: newLocateFunc, imageSize:70});
var newLowButton = new newButtonTemplate({textForLabel:"Low Items", name: "newLowButton", textFormat: appStyle, 
					buttonSkin:skinType[13], imageurl: "low_white.png", buttonFunc: newLowFunc, imageSize:70});
					
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


var logoSkin = new Skin({fill:"#2B2B2A"});
var logoBack = new Container({
  left:0, right:0, top:0, bottom:422,
  skin: logoSkin,
  contents:[
  ]
});
var homeWidget = new Container({
    left: 0, right: 0, top: 0, bottom: 0, active: true, skin: background_skin,
    contents: [
        logoBack,             
        new Column({
            left: 0, right: 0, top: 0, bottom: 0,
            contents: [
                new smartShelfLogo(),
                new Column({
                	left:0, right:0, top:0, bottom:0,
                	contents: [
                		new Line({
                			left:20, right:20, top:60, bottom:0,
                			contents: [
                        		newScanButton,
                        		newMainShelfButton,
                        	]
                		}),
                		new Line({
                			left:20, right:20, top:0, bottom:60,
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
 
var mainContainer = new Container({
    left: 0, right: 0, top: 0, bottom: 0, active: true, skin: background_skin,
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
        application.invoke(new Message("/locateItemDevice"));
    },
    onQuit: function(application) {
        application.forget("bluetoothscanner");
        applicaiton.forget("smartshelfdevice");
        application.shared = true;
    },
})
 
 
 
application.behavior = new ApplicationBehavior();
application.add(mainContainer);
