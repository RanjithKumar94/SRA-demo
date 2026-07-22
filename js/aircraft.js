const aircraft = [

{
callsign:"ETH773",
type:"B737",

route:"SRA",

// Random position
randomStart:true,
maxRange:25,

range:0,
bearing:0,

x:0,
y:0,

labelAngle:0,


// Current aircraft heading
heading:80,


// Lost aircraft orbit
orbiting:true,

orbitRadius:10,

orbitDirection:"RIGHT",

orbitAngle:0,

orbitSpeed:3,


// ATC commands

turnCommand:"NONE",
turnRate:3,


// Speed

speed:220,
targetSpeed:220,
speedChangeRate:2,


// Altitude

level:30,
targetLevel:30,
verticalSpeed:0,


history:[],


// Status

lost:true,
requestingHelp:true,

active:false,
spawned:false

}

];
