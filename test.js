var nexabridge = require('./nexabridge.js');

  var nexa = nexabridge.NexaBridge('/dev/ttyACM1', 12207242 );

  nexa.on( 'connect', function() {
    console.log( 'Nexa is connected' );

  });

  nexa.on( 'ready', function() {
      /*nexa.sendln( 'SEND ADV 12207242 2 0 0' );*/
    nexa.send( 2, false );
  });
  nexa.on( 'data', function(data) { console.log( 'Nexa got data: ' + data ) });



