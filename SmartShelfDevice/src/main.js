//This is the main SmartShelf Device JS file

var whiteSkin = new Skin({fill: "white"});
var greenSkin = new Skin({fill: "green"});
var redSkin = new Skin({fill: "red"});
var yellowSkin = new Skin({fill: "yellow"});
var labelStyle = new Style({font:"bold 40px", color:"black"});

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
var Shelves = [[]];
Shelves[0][0] = new Label({left:0, right:0, height:40, string:"Initializing...", style: labelStyle});
Shelves[0][1] = new Label({left:0, right:0, height:40, string:"Initializing...", style: labelStyle});
Shelves[0][2] = new Label({left:0, right:0, height:40, string:"Initializing...", style: labelStyle});

var mainColumn = new Column({
	left:0, right:0, top: 0, bottom: 0, skin: whiteSkin,
	contents: [
	Shelves[0][0],
	Shelves[0][1],
	Shelves[0][2]
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
		Shelves[0][0].string = data.Row1Column1;
		Shelves[0][1].string = data.Row1Column2;
		Shelves[0][2].string = data.Row1Column3;
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
	        }
	 }
}));