//This is the main SmartShelf Device JS file

var whiteSkin = new Skin({fill: "white"});
var greenSkin = new Skin({fill: "green"});
var redSkin = new Skin({fill: "red"});
var blueSkin = new Skin({fill: "blue"});
var yellowSkin = new Skin({fill: "yellow"});
var labelStyle = new Style({font:"bold 20px", color:"black"});

var okSkin = new Skin({fill: "white"});
var lowSkin = new Skin({fill: "yellow"});
var outSkin = new Skin({fill: "red"});
var addShelfSkin = new Skin({fill: "blue"});

var numberOfShelves = 6;
var Shelves = [];
for(i = 0; i <numberOfShelves; i++)
{
	Shelves[i] = new Label({left:0, right:0, bottom: 0, height:40, string:"0", style: labelStyle, skin: outSkin});
}

var itemInformationObjects = [];
var itemToAdd;
var lastItemAdded = -1;
var currentlyLookingForItem = false;

var ItemInformation = function($){
	this.name = $.name;
	if($.hasOwnProperty("count")){
		this.count = $.count;
	}else{
		this.count = 0;
	}
	this.individualWeight = $.individualWeight;
	this.totalWeight = 0;
	this.maxWeight = 0;
	this.percentFull = 0.0;
	this.lastWeight = this.totalWeight;
	this.lowThreshold = 0.25; //25% item is low!
	this.outThreshold = 0.1; //10% is essentially out (empty box)
	this.status = "out"; //"out", "low", "ok"
}

ItemInformation.prototype.updateItemWeight = function(itemIndex, weight){
	this.totalWeight = weight;
	if(this.maxWeight < weight){
		this.maxWeight = weight;
	}if(this.lastWeight < weight){
		if(currentlyLookingForItem) {
			currentlyLookingForItem = false;
			lastItemAdded = itemIndex;
			//TODO: Now Add the item!
			this.name = itemToAdd.name;
			this.individualWeight = itemToAdd.individualWeight;
			this.maxWeight = weight;
			//trace("New Item Named: " + this.name + " to shelf "+ itemIndex.toString() +  "\n");
		}
	}
	this.lastWeight = weight;
	if(this.individualWeight > 0) this.count = Math.round(weight/this.individualWeight);
	if(this.maxWeight > 0) this.percentFull = this.totalWeight/this.maxWeight;
	if(this.percentFull < this.lowThreshold) {
		this.status = "low";
		Shelves[itemIndex].skin = lowSkin;
	}
	else {
		this.status = "ok";
		Shelves[itemIndex].skin = okSkin;
	}
	if(this.percentFull < this.outThreshold) {
		this.status = "out";
		Shelves[itemIndex].skin = outSkin;
	}
	
}

Handler.bind("/getAllItemInformation", Behavior({
	onInvoke: function(handler, message){
		//trace(itemInformationObjects[0].totalWeight.toString() + "\n");
		message.responseText = JSON.stringify(itemInformationObjects);
		message.status = 200;
	}
}));


Handler.bind("/newItem", Behavior({
	onInvoke: function(handler, message){
		itemToAdd = new ItemInformation(JSON.parse(message.requestText));
		message.responseText = JSON.stringify({newShelf: lastItemAdded});
		if(lastItemAdded != -1) currentlyLookingForItem = false;
		else currentlyLookingForItem = true;
		lastItemAdded = -1;
		message.status = 200;
	}
}));


Handler.bind("/respond", Behavior({
	onInvoke: function(handler, message){
		message.responseText = "SmartShelf Device Found!";
		message.status = 200;
	}
}));

//Used by the simulator, don't delete.
Handler.bind("/weightResults", Object.create(Behavior.prototype, {
	onInvoke: { value: function( handler, message ){
				application.distribute( "weightRecord", message.requestObject );
			}}
}));



/*Shelves[0] = new Label({left:0, right:0, bottom: 0, height:40, string:"0", style: labelStyle, skin: greenSkin});
Shelves[1] = new Label({left:0, right:0, bottom: 0, height:40, string:"0", style: labelStyle, skin: redSkin});
Shelves[2] = new Label({left:0, right:0, bottom: 0, height:40, string:"0", style: labelStyle, skin: blueSkin});

Shelves[3] = new Label({left:0, right:0, bottom: 0, height:40, string:"0", style: labelStyle, skin: greenSkin});
Shelves[4] = new Label({left:0, right:0, bottom: 0, height:40, string:"0", style: labelStyle, skin: redSkin});
Shelves[5] = new Label({left:0, right:0, bottom: 0, height:40, string:"0", style: labelStyle, skin: blueSkin}); //*/

var topShelf = new Line({
	left:0, right:0, top: 0, bottom: 0, skin: whiteSkin,
	contents: [
	Shelves[0],
	Shelves[1],
	Shelves[2],
	]
});

var bottomShelf = new Line({
	left:0, right:0, top: 0, bottom: 0, skin: whiteSkin,
	contents: [
	Shelves[3],
	Shelves[4],
	Shelves[5],
	]
});

var mainColumn = new Column({
	left:0, right:0, top: 0, bottom: 0, skin: whiteSkin,
	contents: [
	new  Label({left:0, right:0, height:40, string:"", style: labelStyle}),
	topShelf,
	new  Label({left:0, right:0, height:40, string:"", style: labelStyle}),
	bottomShelf
	]
});




var ApplicationBehavior = Behavior.template({
	onLaunch: function(application) {
		application.shared = true;
		for(i = 0; i < 6; i++){
			itemInformationObjects[i] = new ItemInformation({name: "none", individualWeight: 50});
		} 
	},
	onDisplaying : function(application){
		application.invoke( new MessageWithObject( "pins:/itemWeights/read?repeat=on&callback=/weightResults&interval=70" ) );
	
	},
	onQuit: function(application) {
		application.shared = false;
	},
	weightRecord : function(params, data) {
		for(i = 0; i < numberOfShelves; i++)
		{
			Shelves[i].string = data["Shelf"+i.toString()];
			itemInformationObjects[i].updateItemWeight(i, data["Shelf"+i.toString()]);
		}
	}
})

var applicationPins = {};

for(i = 0; i < numberOfShelves; i++)
{
	applicationPins["Shelf"+i.toString()] = {pin: i};
}


application.add(mainColumn);
application.behavior = new ApplicationBehavior();
application.invoke( new MessageWithObject( "pins:configure", {
	itemWeights: {
		require: "weightSensors",
			pins: applicationPins
	 }
}));