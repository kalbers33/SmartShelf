// KPR Script file

var data = {
	scannedValue: -1
};

var whiteSkin = new Skin( { fill:"white" } );

var smartShelfLogo = Picture.template(function($){ return {
	height: 100, name:"smartShelfLogo", url:"../../SmartShelfLogo.png"
};
});

Handler.bind("/getData", Behavior({
	onInvoke: function(handler, message){
		message.responseText = JSON.stringify( { value: data.scannedValue } );
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

var mainColumn = new Column({
	left: 0, right: 0, top: 0, bottom: 0, skin: whiteSkin,
	contents: [
		new smartShelfLogo(),
		new ScanContainer(),
	]
});

Handler.bind("/getScan", Object.create(Behavior.prototype, {
	onInvoke: { value: function( handler, message ){
        		var result = message.requestObject;  
        		application.distribute( "onScanned", result ); 		
        	}}
}));

application.invoke( new MessageWithObject( "pins:configure", {
	ScannedValue: {
        require: "ScannedValue",
        pins: {
            scannedValue: { sda: 27, clock: 29 }
        }
    },
}));

application.invoke( new MessageWithObject( "pins:/ScannedValue/read?" + 
	serializeQuery( {
		repeat: "on",
		interval: 500,
		callback: "/getScan"
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