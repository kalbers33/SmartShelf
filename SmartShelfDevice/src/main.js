//This is the main SmartShelf Device JS file

var whiteSkin = new Skin({fill: "white"});
var greenSkin = new Skin({fill: "green"});
var redSkin = new Skin({fill: "red"});
var blueSkin = new Skin({fill: "blue"});
var yellowSkin = new Skin({fill: "yellow"});
var labelStyle = new Style({font:"bold 20px", color:"black"});

Handler.bind("/getParameters", Behavior({
	onInvoke: function(handler, message){
		message.responseText = JSON.stringify({});
		message.status = 200;
	}
}));


Handler.bind("/reset", Behavior({
	onInvoke: function(handler, message){
		message.responseText = JSON.stringify({});
		message.status = 200;
	}
}));
var Shelves = [];
Shelves[0] = new Label({left:0, right:0, height:40, string:"Initializing...", style: labelStyle, skin: greenSkin});
Shelves[1] = new Label({left:0, right:0, height:40, string:"Initializing...", style: labelStyle, skin: redSkin});
Shelves[2] = new Label({left:0, right:0, height:40, string:"Initializing...", style: labelStyle, skin: blueSkin});

Shelves[3] = new Label({left:0, right:0, height:40, string:"Initializing...", style: labelStyle, skin: greenSkin});
Shelves[4] = new Label({left:0, right:0, height:40, string:"Initializing...", style: labelStyle, skin: redSkin});
Shelves[5] = new Label({left:0, right:0, height:40, string:"Initializing...", style: labelStyle, skin: blueSkin});

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

Handler.bind("/respond", Behavior({
	onInvoke: function(handler, message){
		message.responseText = "SmartShelf Device Found!";
		message.status = 200;
	}
}));

Handler.bind("/weightResults", Object.create(Behavior.prototype, {
	onInvoke: { value: function( handler, message ){
				application.distribute( "weightRecord", message.requestObject );
			}}
}));


var ApplicationBehavior = Behavior.template({
	onLaunch: function(application) {
		application.shared = true;
	},
	onDisplaying : function(application){
		application.invoke( new MessageWithObject( "pins:/itemWeights/read?repeat=on&callback=/weightResults&interval=70" ) );
	
	},
	onQuit: function(application) {
		application.shared = false;
	},
	weightRecord : function(params, data) {
		Shelves[0].string = data.Row1Column1;
		Shelves[1].string = data.Row1Column2;
		Shelves[2].string = data.Row1Column3;
		Shelves[3].string = data.Row2Column1;
		Shelves[4].string = data.Row2Column2;
		Shelves[5].string = data.Row2Column3;
	}
})


application.add(mainColumn);
application.behavior = new ApplicationBehavior();
application.invoke( new MessageWithObject( "pins:configure", {
	itemWeights: {
		require: "weightSensors",
			pins: {
				Row1Column1: { pin: 60 },
				Row1Column2: { pin: 53 },
				Row1Column3: { pin: 50},
				Row2Column1: { pin: 62 },
				Row2Column2: { pin: 63 },
				Row2Column3: { pin: 64},
	        }
	 }
}));