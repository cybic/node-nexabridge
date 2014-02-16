var util          = require('util'),
    serialport    = require('serialport'),
    winston       = require('winston');

var EventEmitter  = require('events').EventEmitter;



var log = new winston.Logger({
  transports: [
    new winston.transports.Console( {level: 'debug', colorize: true, timeStamp: true} )
  ]
});

function NexaBridge( port, nexaId ) {
  // TODO: Make find mech
  /*var nexaPort = findNexaPort();*/
  var nexaPort = port; 
  return new nexabridge( nexaPort, nexaId );
}

function nexabridge( nexaPort, nexaId ) {
  EventEmitter.call( this );

  var self = this;
  self.id = nexaId;
  var SerialPort = serialport.SerialPort;
  var serial = new SerialPort("/dev/ttyACM1", {
    baudrate: 9600,
    parser: serialport.parsers.readline("\n")
  });

  serial.on( 'open', function() {
      /*log.info( 'Opened serial connection' );*/
    log.info( 'Opened serial conn' );
    self.emit( 'connect' );

    // TODO: Arduino bridge must report on ready state instead of timeout here
    setTimeout( function() {
      self.emit( 'ready' );
    }, 2000 );

  });

  serial.on( 'data', function(data) {

    log.debug( 'DATA:' + data );
    self.emit( 'data', data );
  });
    

  function setId(id) {
    nexaId = id;
  }

  function send( device, state ) {
      serial.write( generateCommand( self.id, device, state, false ) + '\n' );
  }

  function sendln( data ) {
    log.debug( 'Sending data: ' + data );
    serial.write( data + "\n" );
    serial.flush( function() { log.debug( 'blæh' ) });
  }

  function generateCommand( nexaId, device, state, group ) {
    return util.format( 'SEND ADV %s %s %s %s', nexaId, device, (state) ? '1' : '0', (group) ? '1' : '0' );
  }

  this.sendln = sendln;
  this.send = send;

}
util.inherits( nexabridge, EventEmitter );

module.exports.NexaBridge = NexaBridge;
