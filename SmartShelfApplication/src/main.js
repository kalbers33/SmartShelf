
/*******Jamie************/




/*******Tanisha**********/




/*******Ji-hern**********/




/*******Naren************/
var THEME = require("themes/flat/theme");
var BUTTONS = require("controls/buttons");

deviceURL_scanner = "";
deviceURL = "";

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
			mainContainer.remove(mainContainer.last);
			mainContainer.add(scanInventoryPlaceItem);
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
var proceedScanButton = new ProceedScanButtonTemplate({textForLabel:"Proceed", name: "proceedScanButton", textFormat: bigText});
var proceedToShowButton = new ProceedToShowButtonTemplate({textForLabel:"Proceed", name: "proceedToShowButton", textFormat: bigText});

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
				waitingforScannerText.string = "Value received";
				itemType = data.scannedValue
				itemWeight = data.scannedWeight;
				itemTypeText.string = "Item Type: " + itemType;
				itemWeightText.string = "Item Weight: " + itemWeight;
			}
			else {
				waitingforScannerText.string += ".";
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
				scanButton
			]
		}),
	]
});

var mainContainer = new Container({
	left: 0, right: 0, top: 0, bottom: 0, active: true, skin: whiteSkin,
	contents: [
		scanInventory
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
		application.invoke(new Message("/getDeviceData"));
	},
	onQuit: function(application) {
		application.forget("bluetoothscanner");
		applicaiton.forget("smartshelfdevice");
		application.shared = true;
	},
})

application.behavior = new ApplicationBehavior();
application.add(mainContainer);