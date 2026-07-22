// ======================================
// aircraft.js
// SRA Aircraft Database
// ======================================


const aircraft = [

{

callsign:"ETH773",

type:"B737",

route:"SRA",




// Initial random position

range:20,

bearing:120,


x:0,
y:0,



// Label

labelAngle:0,



// Flight state

active:false,
spawned:false,



// ===============================
// SRA ORBIT
// ===============================

orbit:true,

orbitDirection:"RIGHT",

orbitHeading:0,

orbitRate:3,



// ===============================
// Movement
// ===============================

speed:220,

targetSpeed:220,

speedChangeRate:2,



// ===============================
// Level
// ===============================

level:50,

targetLevel:50,

verticalSpeed:0,



// ===============================
// ATC Commands
// ===============================

turnCommand:"NONE",

heading:0,



// ===============================
// History trail
// ===============================

history:[],



// ===============================
// Arrival
// ===============================

arrivalPhase:false,

landed:false,

removeTimer:0


}

];
