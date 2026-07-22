// ======================================
// main.js
// ATC Simulator Engine
// ======================================
let simulatorPaused = false;


const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");


if(pauseBtn){

    pauseBtn.onclick = function(){

        simulatorPaused = true;

        console.log("PAUSED =", simulatorPaused);

    };

}


if(resumeBtn){

    resumeBtn.onclick = function(){

        simulatorPaused = false;

        console.log("RESUMED =", simulatorPaused);

    };

}
let selectedAircraft = null;


// Simulation Time
let simHour = 5;
let simMinute = 0;
let simSecond = 0;

//--------------------------------------
// Time Functions
//--------------------------------------

function currentMinutes() {
    return simHour * 60 + simMinute;
}

function timeToMinutes(time) {
    const t = time.split(":");
    return parseInt(t[0]) * 60 + parseInt(t[1]);
}

function entryOffset(type) {

    switch(type){

        case "ATR72":
        case "DO228":
            return 18;

        default:
            return 14;
    }

}
document.getElementById("applyBtn").onclick = function(){

    if(selectedAircraft == null){

        alert("Select an aircraft first.");

        return;

    }


    const lvl =
    document.getElementById("level").value;


    if(lvl !== ""){


        selectedAircraft.targetLevel =
        parseInt(lvl);


        console.log(
            "LEVEL CLEARANCE:",
            selectedAircraft.callsign,
            "FL",
            selectedAircraft.targetLevel
        );

    }


};

document.getElementById("applySpeed").onclick = function(){
console.log("Speed button pressed");
    if(selectedAircraft == null){

        alert("Select an aircraft first.");

        return;

    }


    const spd =
    document.getElementById("speed").value;


    if(spd !== ""){

        selectedAircraft.targetSpeed =
        parseInt(spd);


        console.log(
            "SPEED CLEARANCE:",
            selectedAircraft.callsign,
            selectedAircraft.targetSpeed
        );

    }

};
//--------------------------------------
// Clock
//--------------------------------------

function updateClock(){

    simSecond++;

    if(simSecond>=60){

        simSecond=0;
        simMinute++;

    }

    if(simMinute>=60){

        simMinute=0;
        simHour++;

    }

    document.getElementById("clock").innerHTML =
        String(simHour).padStart(2,"0")+":"+
        String(simMinute).padStart(2,"0")+":"+
        String(simSecond).padStart(2,"0");

}

//--------------------------------------
// Spawn Aircraft
//--------------------------------------

function spawnAircraft(){

    aircraft.forEach(ac=>{

        if(ac.spawned) return;


        // ===============================
        // SRA Random Position Start
        // ===============================

        const startBearing =
        Math.random() * 360;


        const startRange =
        5 + Math.random() * ac.maxRange;


        ac.range = startRange;

        ac.bearing = startBearing;


        const start =
        bearingToXY(
            startBearing,
            startRange
        );


        ac.x = start.x;
        ac.y = start.y;


        ac.spawned = true;
        ac.active = true;


        console.log(
            ac.callsign +
            " SRA started at " +
            Math.round(startRange) +
            " NM"
        );


    });

}
// =====================================
// Arrival Descent Logic
// =====================================


//--------------------------------------
// Move Aircraft
//--------------------------------------


function moveAircraft(){

    aircraft.forEach(ac=>{

        if(!ac.active) return;


        // ===============================
        // Speed (NM per second)
        // ===============================

        let movement;

        switch(ac.type){

            case "B777":
                movement = 5.5 / 60;
                break;

            case "B737":
            case "A320":
                movement = 5.0 / 60;
                break;

            case "ATR72":
                movement = 4 / 60;
                break;

            case "DO228":
                movement = 3.5 / 60;
                break;

            default:
                movement = 5.0 / 60;

        }


        // ===============================
        // Heading turn
        // ===============================
// ======================================
// Heading Turn with Direction Control
// ======================================
// ===============================
// SRA TURN COMMAND
// ===============================

if(ac.turnCommand === "RIGHT"){

    ac.heading += ac.turnRate;

    if(ac.heading >= 360)
        ac.heading -= 360;

}


else if(ac.turnCommand === "LEFT"){

    ac.heading -= ac.turnRate;

    if(ac.heading < 0)
        ac.heading += 360;

}
        // ===============================
// Arrival phase at 8.5 NM
// ===============================

if(ac.distance <= 8.5){

    ac.arrivalPhase = true;

}
// ===============================
// Speed Control
// ===============================

if(ac.speed !== ac.targetSpeed){


    if(ac.speed > ac.targetSpeed){

        ac.speed -= ac.speedChangeRate;


        if(ac.speed < ac.targetSpeed)
            ac.speed = ac.targetSpeed;

    }


    else if(ac.speed < ac.targetSpeed){

        ac.speed += ac.speedChangeRate;


        if(ac.speed > ac.targetSpeed)
            ac.speed = ac.targetSpeed;

    }

}

// ===============================
// Controller selected descent
// ===============================

if(ac.level > ac.targetLevel){

    const descentRate = 0.25;   // FL/sec (~1500 ft/min)

    ac.level -= descentRate;

    ac.verticalSpeed = -1500;


    if(ac.level <= ac.targetLevel){

        ac.level = ac.targetLevel;

        ac.verticalSpeed = 0;

    }

}


else if(ac.level < ac.targetLevel){

    const climbRate = 0.25;

    ac.level += climbRate;

    ac.verticalSpeed = 1500;


    if(ac.level >= ac.targetLevel){

        ac.level = ac.targetLevel;

        ac.verticalSpeed = 0;

    }

}


else{

    ac.verticalSpeed = 0;

}

        // =====================================
// Final Approach Descent
// =====================================

if(ac.distance <= 8.5 && ac.targetLevel === 0){

    ac.approach = true;

}


if(ac.approach){

    // Descend based on distance remaining

    let requiredLevel = ac.distance * 2.35;

    if(requiredLevel < 0)
        requiredLevel = 0;


    if(ac.level > requiredLevel){

        ac.level -= 0.25;

        ac.verticalSpeed = -1500;


        if(ac.level <= requiredLevel){

            ac.level = requiredLevel;

        }

    }

}

        // ===============================
        // Move aircraft
        // ===============================

        // ===============================
// Move aircraft
// SRA Orbit / Normal
// ===============================


const pixels =
movement * PIXELS_PER_NM;



if(ac.orbit === true){


    // Continuous orbit turn

    if(ac.orbitDirection === "RIGHT"){

        ac.orbitHeading += ac.orbitRate;

    }
    else{

        ac.orbitHeading -= ac.orbitRate;

    }



    if(ac.orbitHeading >= 360)
        ac.orbitHeading -= 360;


    if(ac.orbitHeading < 0)
        ac.orbitHeading += 360;



    const angle =
    (ac.orbitHeading - 90) *
    Math.PI / 180;



    ac.x += Math.cos(angle) * pixels;

    ac.y += Math.sin(angle) * pixels;


}


else{


    const angle =
    (ac.heading - 90) *
    Math.PI / 180;


    ac.x += Math.cos(angle) * pixels;

    ac.y += Math.sin(angle) * pixels;


}
        // Store history trail

// Store real position history

ac.history.push({
    range: ac.range,
    bearing: ac.bearing
});


if(ac.history.length > 30){

    ac.history.shift();

}
// Update real radar position
const dx = ac.x - CCB.x;
const dy = ac.y - CCB.y;

ac.range = Math.sqrt(dx*dx + dy*dy) / PIXELS_PER_NM;

ac.bearing =
(Math.atan2(dy, dx) * 180 / Math.PI) + 90;

if(ac.bearing < 0)
    ac.bearing += 360;
        ac.distance -= movement;


        if(ac.distance < 0)
            ac.distance = 0;



        // ===============================
        // Landing
        // ===============================

        if(ac.distance <= 0.1 && ac.level <= 0){

            ac.landed = true;

        }



        // ===============================
        // Remove after 3 seconds
        // ===============================

        if(ac.landed){

            ac.removeTimer =
            (ac.removeTimer || 0) + 1;


            if(ac.removeTimer >= 3){

                ac.active = false;

                console.log(
                    ac.callsign + " removed"
                );

            }

        }


    });

}
//--------------------------------------
// Start Simulator
//--------------------------------------


setInterval(function(){

    console.log("Timer:", simulatorPaused);

    if(simulatorPaused === true){
        return;
    }

    updateClock();

    spawnAircraft();

    moveAircraft();

    if(typeof moveDepartures === "function"){
    moveDepartures();
}

    //moveUnknownBlips();

},1000);
