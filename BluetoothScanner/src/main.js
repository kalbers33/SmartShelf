// KPR Script file

var data = {
	scannedValue: -1,
	scannedWeight: -1
};

var whiteSkin = new Skin( { fill:"white" } );

var smartShelfLogo = Picture.template(function($){ return {
	height: 50, name:"smartShelfLogo", url:"logoblack.png"
};
});

Handler.bind("/getData", Behavior({
	onInvoke: function(handler, message){
		message.responseText = JSON.stringify( { value: data.scannedValue, weight: data.scannedWeight} );
		message.status = 200;
	}
}));

var ScanContainer = Container.template(function($) { return { left: 0, right: 0, top: 0, bottom: 0, skin: new Skin({ fill: 'white',}), contents: [
	Label($, { left: 0, right: 0, 
	style: new Style({ color: 'black', font: '26px', horizontal: 'null', vertical: 'null', }), behavior: Object.create((ScanContainer.behaviors[0]).prototype), string: '- - -', }),
], }});

ScanContainer.behaviors = new Array(1);
ScanContainer.behaviors[0] = Behavior.template({
	onScanned: function(content, result) {
		content.string = "Scan Value: "+result.toFixed(0);
		data.scannedValue = result;
	},
})

var WeightContainer = Container.template(function($) { return { left: 0, right: 0, top: 0, bottom: 0, skin: new Skin({ fill: 'white',}), contents: [
	Label($, { left: 0, right: 0, 
	style: new Style({ color: 'black', font: '26px', horizontal: 'null', vertical: 'null', }), behavior: Object.create((WeightContainer.behaviors[0]).prototype), string: '- - -', }),
], }});

WeightContainer.behaviors = new Array(1);
WeightContainer.behaviors[0] = Behavior.template({
	onWeightScanned: function(content, result) {
		content.string = "Scan Weight: "+result.toFixed(0);
		data.scannedWeight = result;
	},
})

var mainColumn = new Column({
	left: 0, right: 0, top: 0, bottom: 0, skin: whiteSkin,
	contents: [
		new smartShelfLogo(),
		new ScanContainer(),
		new WeightContainer()
	]
});

Handler.bind("/getScan", Object.create(Behavior.prototype, {
	onInvoke: { value: function( handler, message ){
        		var result = message.requestObject;  
        		application.distribute( "onScanned", result ); 		
        	}}
}));

Handler.bind("/getWeight", Object.create(Behavior.prototype, {
	onInvoke: { value: function( handler, message ){
        		var result = message.requestObject;  
        		application.distribute( "onWeightScanned", result ); 		
        	}}
}));

application.invoke( new MessageWithObject( "pins:configure", {
	ScannedValue: {
        require: "ScannedValue",
        pins: {
            scannedValue: { sda: 27, clock: 29 }
        }
    },
    ScannedWeight: {
        require: "ScannedWeight",
        pins: {
            scannedWeight: { sda: 31, clock: 33 }
        }
    }
}));

application.invoke( new MessageWithObject( "pins:/ScannedValue/read?" + 
	serializeQuery( {
		repeat: "on",
		interval: 500,
		callback: "/getScan"
} ) ) );

application.invoke( new MessageWithObject( "pins:/ScannedWeight/read?" + 
	serializeQuery( {
		repeat: "on",
		interval: 500,
		callback: "/getWeight"
} ) ) );

var ApplicationBehavior = Behavior.template({
	onLaunch: function(application) {
		application.shared = true;
	},
	onQuit: function(application) {
		application.shared = false;
	},
})

application.add(mainColumn);
application.behavior = new ApplicationBehavior();