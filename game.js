/* =========================================================
   2:17 AM — CINEMATIC HORROR
   FIXED OBJECT-BASED CAMERA SYSTEM
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const room = document.getElementById("room");

const startScreen =
    document.getElementById("start-screen");

const startButton =
    document.getElementById("start-button");

const hud =
    document.getElementById("hud");

const storyUI =
    document.getElementById("story-ui");

const storyText =
    document.getElementById("story-text");

const choices =
    document.getElementById("choices");

const sceneLocation =
    document.getElementById("scene-location");

const sceneTime =
    document.getElementById("scene-time");

const doorObject =
    document.getElementById("door-object");

const door =
    document.getElementById("door");

const hallway =
    document.getElementById("hallway");

const windowObject =
    document.getElementById("window-object");

const windowShadow =
    document.getElementById("window-shadow");

const phoneObject =
    document.getElementById("phone-object");

const phoneScreen =
    document.getElementById("phone-screen");

const personShadow =
    document.getElementById("person-shadow");

const endingScreen =
    document.getElementById("ending-screen");

const endingLabel =
    document.getElementById("ending-label");

const endingTitle =
    document.getElementById("ending-title");

const endingText =
    document.getElementById("ending-text");

const endingButton =
    document.getElementById("ending-button");

const endingFlash =
    document.getElementById("ending-flash");

const creditScreen =
    document.getElementById("credit-screen");

const playAgain =
    document.getElementById("play-again");

const soundToggle =
    document.getElementById("sound-toggle");


/* =========================================================
   AUDIO
========================================================= */

const sounds = {

    ambience:
        new Audio("./assets/sounds/ambience.mp3"),

    door:
        new Audio("./assets/sounds/door-creak.mp3"),

    knock:
        new Audio("./assets/sounds/knock.mp3"),

    footsteps:
        new Audio("./assets/sounds/footsteps.mp3"),

    phone:
        new Audio("./assets/sounds/phone-vibrate.mp3"),

    window:
        new Audio("./assets/sounds/window-knock.mp3"),

    breathing:
        new Audio("./assets/sounds/breathing.mp3"),

    jumpscare:
        new Audio("./assets/sounds/jumpscare.mp3"),

    camera:
        new Audio("./assets/sounds/camera.mp3"),

    heartbeat:
        new Audio("./assets/sounds/heartbeat.mp3"),

    credit:
        new Audio("./assets/sounds/credit-music.mp3")
};


let soundEnabled = true;

sounds.ambience.loop = true;
sounds.credit.loop = true;

sounds.ambience.volume = .24;
sounds.door.volume = .75;
sounds.knock.volume = .85;
sounds.footsteps.volume = .55;
sounds.phone.volume = .75;
sounds.window.volume = .75;
sounds.breathing.volume = .55;
sounds.jumpscare.volume = .9;
sounds.camera.volume = .5;
sounds.heartbeat.volume = .65;
sounds.credit.volume = .35;


/* =========================================================
   AUDIO FUNCTIONS
========================================================= */

function playSound(name, restart = true) {

    if (!soundEnabled) return;

    const audio = sounds[name];

    if (!audio) return;

    try {

        if (restart) {
            audio.currentTime = 0;
        }

        audio.play().catch(() => {});

    } catch (e) {}

}


function stopSound(name) {

    const audio = sounds[name];

    if (!audio) return;

    try {

        audio.pause();
        audio.currentTime = 0;

    } catch (e) {}

}


function stopSceneSounds() {

    [
        "door",
        "knock",
        "footsteps",
        "phone",
        "window",
        "breathing",
        "jumpscare",
        "camera",
        "heartbeat"
    ].forEach(stopSound);

}


/* =========================================================
   FIXED CAMERA SYSTEM
========================================================= */

/*
    IMPORTANT:

    We DO NOT use hard-coded camera coordinates anymore.

    The camera calculates the actual position of the target
    element inside #room.

    This prevents:

    Door -> Window
    Window -> Door
    Phone -> random area
*/


function getRoomCenter() {

    const rect =
        room.getBoundingClientRect();

    return {

        x: rect.left + rect.width / 2,

        y: rect.top + rect.height / 2

    };

}


function getElementCenter(element) {

    const rect =
        element.getBoundingClientRect();

    return {

        x: rect.left + rect.width / 2,

        y: rect.top + rect.height / 2

    };

}


function focusCameraOn(
    element,
    scale = 1.35,
    duration = 2.6,
    offsetX = 0,
    offsetY = 0
) {

    const roomCenter =
        getRoomCenter();

    const target =
        getElementCenter(element);


    /*
       Difference between target and screen center.
       Move room in the OPPOSITE direction.
    */

    const moveX =
        roomCenter.x -
        target.x +
        offsetX;

    const moveY =
        roomCenter.y -
        target.y +
        offsetY;


    room.style.transition =
        `transform ${duration}s cubic-bezier(.22,.61,.36,1)`;


    room.style.transform =
        `translate3d(${moveX}px, ${moveY}px, 0) scale(${scale})`;

}


function cameraReset(duration = 1.5) {

    room.style.transition =
        `transform ${duration}s cubic-bezier(.22,.61,.36,1)`;

    room.style.transform =
        "translate3d(0,0,0) scale(1)";

}


/* =========================================================
   SMALL CAMERA EFFECTS
========================================================= */

function cameraShake(
    amount = 5,
    duration = 400
) {

    const original =
        room.style.transform;


    const start =
        performance.now();


    function shake(now) {

        const elapsed =
            now - start;

        if (elapsed >= duration) {

            room.style.transform =
                original;

            return;
        }


        const progress =
            1 - elapsed / duration;

        const x =
            (Math.random() - .5) *
            amount *
            progress;

        const y =
            (Math.random() - .5) *
            amount *
            progress;


        room.style.transform =
            `${original} translate3d(${x}px, ${y}px, 0)`;


        requestAnimationFrame(shake);

    }


    requestAnimationFrame(shake);

}


/* =========================================================
   STORY
========================================================= */

const scenes = {

    start: {

        location: "BEDROOM",

        time: "2:17 AM",

        text:
            "You wake up without knowing why. The room is quiet. Too quiet.",

        choices: [

            {
                text: "LOOK AT THE DOOR",
                next: "door"
            },

            {
                text: "LOOK AT THE WINDOW",
                next: "window"
            },

            {
                text: "CHECK YOUR PHONE",
                next: "phone"
            }

        ]

    },


    door: {

        location: "BEDROOM",

        time: "2:17 AM",

        text:
            "Three knocks come from the other side of the door.",

        choices: [

            {
                text: "OPEN THE DOOR",
                next: "doorOpen"
            },

            {
                text: "STAY IN BED",
                next: "bed"
            }

        ]

    },


    window: {

        location: "WINDOW",

        time: "2:18 AM",

        text:
            "Something moves outside your window.",

        choices: [

            {
                text: "LOOK CLOSER",
                next: "windowCloser"
            },

            {
                text: "MOVE AWAY",
                next: "windowAway"
            }

        ]

    },


    phone: {

        location: "BEDROOM",

        time: "2:18 AM",

        text:
            "Your phone lights up by itself. Incoming call: UNKNOWN.",

        choices: [

            {
                text: "ANSWER",
                next: "answerPhone"
            },

            {
                text: "IGNORE IT",
                next: "ignorePhone"
            }

        ]

    },


    doorOpen: {

        location: "HALLWAY",

        time: "2:19 AM",

        text:
            "The hallway is empty. But you can hear someone breathing.",

        choices: [

            {
                text: "STEP INTO THE HALL",
                next: "hallway"
            },

            {
                text: "CLOSE THE DOOR",
                next: "closeDoor"
            }

        ]

    },


    bed: {

        location: "BEDROOM",

        time: "2:19 AM",

        text:
            "You pull the blanket over yourself. Something moves underneath the bed.",

        choices: [

            {
                text: "LISTEN",
                next: "listen"
            },

            {
                text: "RUN",
                next: "run"
            }

        ]

    },


    windowCloser: {

        location: "WINDOW",

        time: "2:19 AM",

        text:
            "You get closer. A hand slowly appears against the glass.",

        choices: [

            {
                text: "TOUCH THE GLASS",
                next: "touchGlass"
            },

            {
                text: "BACK AWAY",
                next: "windowBack"
            }

        ]

    },


    windowAway: {

        location: "BEDROOM",

        time: "2:19 AM",

        text:
            "You step away from the window. The knocking starts behind you.",

        choices: [

            {
                text: "TURN AROUND",
                next: "death"
            },

            {
                text: "DON'T LOOK",
                next: "dream"
            }

        ]

    },


    answerPhone: {

        location: "BEDROOM",

        time: "2:20 AM",

        text:
            "You answer. Nobody speaks. Then you hear your own voice whisper your name.",

        choices: [

            {
                text: "SAY HELLO",
                next: "phoneReply"
            },

            {
                text: "HANG UP",
                next: "hangUp"
            }

        ]

    },


    ignorePhone: {

        location: "BEDROOM",

        time: "2:20 AM",

        text:
            "The phone stops ringing. A second later, it rings again — from underneath your bed.",

        choices: [

            {
                text: "LOOK UNDER THE BED",
                next: "underBed"
            },

            {
                text: "CLOSE YOUR EYES",
                next: "dream"
            }

        ]

    },


    hallway: {

        location: "HALLWAY",

        time: "2:21 AM",

        text:
            "The breathing stops. Then footsteps begin behind you.",

        choices: [

            {
                text: "RUN",
                next: "run"
            },

            {
                text: "TURN AROUND",
                next: "death"
            }

        ]

    },


    closeDoor: {

        location: "BEDROOM",

        time: "2:21 AM",

        text:
            "You close the door. Something knocks from inside the room.",

        choices: [

            {
                text: "OPEN IT AGAIN",
                next: "death"
            },

            {
                text: "GO BACK TO BED",
                next: "dream"
            }

        ]

    },


    listen: {

        location: "BEDROOM",

        time: "2:20 AM",

        text:
            "You hear breathing beneath the bed. Then a whisper: \"Don't look.\"",

        choices: [

            {
                text: "LOOK",
                next: "underBed"
            },

            {
                text: "STAY STILL",
                next: "dream"
            }

        ]

    },


    run: {

        location: "HALLWAY",

        time: "2:21 AM",

        text:
            "You run. The hallway seems to stretch further with every step.",

        choices: [

            {
                text: "KEEP RUNNING",
                next: "runDeath"
            },

            {
                text: "STOP",
                next: "death"
            }

        ]

    },


    touchGlass: {

        location: "WINDOW",

        time: "2:20 AM",

        text:
            "The glass is warm. Something on the other side smiles.",

        choices: [

            {
                text: "LOOK AT ITS FACE",
                next: "death"
            },

            {
                text: "CLOSE YOUR EYES",
                next: "dream"
            }

        ]

    },


    windowBack: {

        location: "BEDROOM",

        time: "2:20 AM",

        text:
            "You step back. The figure outside disappears.",

        choices: [

            {
                text: "CHECK AGAIN",
                next: "death"
            },

            {
                text: "RETURN TO BED",
                next: "dream"
            }

        ]

    },


    phoneReply: {

        location: "BEDROOM",

        time: "2:21 AM",

        text:
            "The voice answers immediately: \"I'm already here.\"",

        choices: [

            {
                text: "LOOK BEHIND YOU",
                next: "death"
            },

            {
                text: "CLOSE YOUR EYES",
                next: "dream"
            }

        ]

    },


    hangUp: {

        location: "BEDROOM",

        time: "2:21 AM",

        text:
            "You hang up. Your phone immediately displays a photo of you sleeping.",

        choices: [

            {
                text: "LOOK AT THE PHOTO",
                next: "death"
            },

            {
                text: "TURN THE PHONE OFF",
                next: "dream"
            }

        ]

    },


    underBed: {

        location: "UNDER THE BED",

        time: "2:22 AM",

        text:
            "There is nothing there. Then you notice the phone camera is recording.",

        choices: [

            {
                text: "LOOK AT THE CAMERA",
                next: "death"
            },

            {
                text: "COVER THE CAMERA",
                next: "dream"
            }

        ]

    },


    runDeath: {

        location: "HALLWAY",

        time: "2:22 AM",

        text:
            "You keep running. The footsteps are suddenly right beside you.",

        choices: [

            {
                text: "KEEP GOING",
                next: "death"
            }

        ]

    }

};


/* =========================================================
   SCENE ANIMATION
========================================================= */

async function animateScene(scene) {

    stopSceneSounds();

    /* reset temporary visuals */

    windowShadow.classList.remove("visible");

    phoneObject.classList.remove("ringing");

    phoneScreen.classList.remove("active");

    personShadow.classList.remove("visible");

    room.classList.remove("horror-pass");

    room.classList.remove("eyes");


    /* =====================================================
       DOOR
    ===================================================== */

    if (scene === "door") {

        /*
            CAMERA TARGET = doorObject

            It will calculate actual door position.
        */

        focusCameraOn(
            doorObject,
            1.35,
            2.8
        );

        await wait(1900);

        playSound("knock");

        await wait(700);

        playSound("knock");

        await wait(700);

        playSound("knock");

        /*
            Subtle horror movement in background.
        */

        setTimeout(() => {

            room.classList.add("horror-pass");

        }, 500);

        return;
    }


    /* =====================================================
       OPEN DOOR
    ===================================================== */

    if (scene === "doorOpen") {

        focusCameraOn(
            doorObject,
            1.42,
            2.5
        );

        await wait(1500);

        playSound("door");

        door.classList.add("open");

        hallway.classList.add("active");

        await wait(900);

        /*
            AFTER DOOR OPENS,
            move camera further into hallway.
        */

        focusCameraOn(
            hallway,
            1.5,
            2.8
        );

        return;
    }


    /* =====================================================
       HALLWAY
    ===================================================== */

    if (scene === "hallway") {

        focusCameraOn(
            hallway,
            1.5,
            2.8
        );

        await wait(2000);

        playSound("breathing");

        room.classList.add("eyes");

        return;
    }


    /* =====================================================
       CLOSE DOOR
    ===================================================== */

    if (scene === "closeDoor") {

        focusCameraOn(
            doorObject,
            1.35,
            2.4
        );

        await wait(1400);

        door.classList.remove("open");

        playSound("door");

        await wait(1000);

        playSound("knock");

        return;
    }


    /* =====================================================
       WINDOW
    ===================================================== */

    if (scene === "window") {

        /*
            CAMERA TARGET = windowObject
        */

        focusCameraOn(
            windowObject,
            1.42,
            2.8
        );

        await wait(1800);

        playSound("window");

        setTimeout(() => {

            room.classList.add("horror-pass");

        }, 400);

        return;
    }


    /* =====================================================
       WINDOW CLOSER
    ===================================================== */

    if (scene === "windowCloser") {

        focusCameraOn(
            windowObject,
            1.65,
            2.8
        );

        await wait(1700);

        playSound("window");

        await wait(700);

        windowShadow.classList.add("visible");

        return;
    }


    /* =====================================================
       WINDOW AWAY
    ===================================================== */

    if (scene === "windowAway") {

        focusCameraOn(
            windowObject,
            1.35,
            2.3
        );

        await wait(1500);

        playSound("window");

        await wait(700);

        cameraReset(2.3);

        return;
    }


    /* =====================================================
       TOUCH GLASS
    ===================================================== */

    if (scene === "touchGlass") {

        focusCameraOn(
            windowObject,
            1.8,
            2.8
        );

        await wait(1700);

        windowShadow.classList.add("visible");

        playSound("breathing");

        return;
    }


    /* =====================================================
       WINDOW BACK
    ===================================================== */

    if (scene === "windowBack") {

        focusCameraOn(
            windowObject,
            1.4,
            2.3
        );

        await wait(1400);

        windowShadow.classList.remove("visible");

        return;
    }


    /* =====================================================
       PHONE
    ===================================================== */

    if (
        scene === "phone" ||
        scene === "answerPhone" ||
        scene === "ignorePhone" ||
        scene === "phoneReply" ||
        scene === "hangUp"
    ) {

        /*
            CAMERA TARGET = phoneObject
        */

        focusCameraOn(
            phoneObject,
            1.65,
            2.8,
            0,
            35
        );

        await wait(1800);

        phoneScreen.classList.add("active");

        phoneObject.classList.add("ringing");

        playSound("phone");

        return;
    }


    /* =====================================================
       BED
    ===================================================== */

    if (
        scene === "bed" ||
        scene === "listen" ||
        scene === "underBed"
    ) {

        focusCameraOn(
            document.getElementById("bed-object"),
            1.45,
            2.7,
            0,
            20
        );

        await wait(1800);

        playSound("breathing");

        room.classList.add("eyes");

        return;
    }


    /* =====================================================
       RUN
    ===================================================== */

    if (
        scene === "run" ||
        scene === "runDeath"
    ) {

        focusCameraOn(
            hallway,
            1.55,
            2.2
        );

        playSound("footsteps");

        room.classList.add("horror-pass");

        return;
    }


    /* =====================================================
       DEATH
    ===================================================== */

    if (scene === "death") {

        cameraShake(
            7,
            650
        );

        await wait(350);

        playSound("heartbeat");

        await wait(700);

        playSound("jumpscare");

        personShadow.classList.add("visible");

        endingFlash.style.opacity = ".8";

        setTimeout(() => {

            endingFlash.style.opacity = "0";

        }, 100);

        return;
    }


    /* =====================================================
       DREAM
    ===================================================== */

    if (scene === "dream") {

        stopSceneSounds();

        cameraReset(5);

        await wait(1200);

        playSound("breathing");

        await wait(1700);

        stopSound("breathing");

        playSound("camera");

        return;
    }

}


/* =========================================================
   SHOW SCENE
========================================================= */

let busy = false;

async function showScene(id) {

    if (busy) return;

    const scene =
        scenes[id];

    if (!scene) return;

    busy = true;


    storyText.classList.remove("show");

    choices.innerHTML = "";


    await wait(350);


    sceneLocation.textContent =
        scene.location;

    sceneTime.textContent =
        scene.time;


    storyText.textContent =
        scene.text;


    storyText.classList.add("show");


    await animateScene(id);


    scene.choices.forEach(
        (choice, index) => {

            const button =
                document.createElement("button");

            button.className =
                "choice";

            button.textContent =
                choice.text;

            button.style.animationDelay =
                `${index * .12}s`;

            button.addEventListener(
                "click",
                () => {

                    selectChoice(
                        choice.next
                    );

                }
            );

            choices.appendChild(
                button
            );

        }
    );


    busy = false;
}


/* =========================================================
   SELECT CHOICE
========================================================= */

async function selectChoice(next) {

    if (busy) return;

    busy = true;


    storyText.classList.remove("show");

    choices.style.pointerEvents =
        "none";


    await wait(350);


    choices.style.pointerEvents =
        "auto";


    if (
        next === "death" ||
        next === "runDeath"
    ) {

        await showDeath();

        return;
    }


    if (next === "dream") {

        await showDream();

        return;
    }


    busy = false;

    showScene(next);

}


/* =========================================================
   DEATH
========================================================= */

async function showDeath() {

    stopSceneSounds();

    await animateScene("death");

    await wait(900);


    endingScreen.classList.add(
        "visible"
    );

    endingScreen.classList.add(
        "death"
    );


    endingLabel.textContent =
        "THE NIGHT DID NOT END WELL";


    endingTitle.textContent =
        "YOU DIED";


    endingText.textContent =
        "Whatever was inside the room was already closer than you thought.";


    endingButton.textContent =
        "TRY AGAIN";


    endingButton.onclick =
        () => {

            resetGame();

        };


    busy = false;
}


/* =========================================================
   WINNING
========================================================= */

async function showDream() {

    stopSceneSounds();

    await animateScene("dream");

    await wait(1800);


    endingScreen.classList.remove(
        "death"
    );

    endingScreen.classList.add(
        "visible"
    );


    endingLabel.textContent =
        "THE MORNING AFTER";


    endingTitle.textContent =
        "JUST A DREAM";


    endingText.textContent =
        "You open your eyes. Morning light fills the room. Your phone is beside you. 2:17 AM was only a dream.";


    endingButton.textContent =
        "CONTINUE";


    endingButton.onclick =
        () => {

            endingScreen.classList.remove(
                "visible"
            );

            setTimeout(
                startCredits,
                1200
            );

        };


    busy = false;
}


/* =========================================================
   CREDIT
========================================================= */

async function startCredits() {

    stopSceneSounds();

    playSound(
        "credit"
    );


    creditScreen.classList.add(
        "visible"
    );


    const lines = [

        document.getElementById(
            "credit-line-1"
        ),

        document.getElementById(
            "credit-line-2"
        ),

        document.getElementById(
            "credit-line-3"
        ),

        document.getElementById(
            "credit-line-4"
        ),

        document.getElementById(
            "credit-line-5"
        ),

        document.getElementById(
            "credit-line-6"
        )

    ];


    lines.forEach(
        line =>
            line.classList.remove(
                "show"
            )
    );


    for (
        let i = 0;
        i < lines.length;
        i++
    ) {

        const line =
            lines[i];

        line.classList.add(
            "show"
        );


        await wait(
            i === lines.length - 1
                ? 3500
                : 2600
        );


        if (
            i !==
            lines.length - 1
        ) {

            line.classList.remove(
                "show"
            );

            await wait(900);

        }

    }


    playAgain.classList.add(
        "show"
    );

}


/* =========================================================
   RESET
========================================================= */

function resetGame() {

    stopSceneSounds();

    stopSound("credit");


    endingScreen.classList.remove(
        "visible"
    );

    endingScreen.classList.remove(
        "death"
    );


    creditScreen.classList.remove(
        "visible"
    );


    playAgain.classList.remove(
        "show"
    );


    startScreen.classList.remove(
        "hidden"
    );


    storyUI.classList.remove(
        "visible"
    );


    hud.classList.remove(
        "visible"
    );


    personShadow.classList.remove(
        "visible"
    );


    windowShadow.classList.remove(
        "visible"
    );


    phoneObject.classList.remove(
        "ringing"
    );


    phoneScreen.classList.remove(
        "active"
    );


    door.classList.remove(
        "open"
    );


    hallway.classList.remove(
        "active"
    );


    room.classList.remove(
        "horror-pass"
    );


    room.classList.remove(
        "eyes"
    );


    cameraReset(.2);


    choices.innerHTML = "";


    storyText.classList.remove(
        "show"
    );


    busy = false;

}


/* =========================================================
   START GAME
========================================================= */

startButton.addEventListener(
    "click",
    async () => {

        if (busy) return;

        busy = true;


        startScreen.classList.add(
            "hidden"
        );


        setTimeout(
            () => {

                hud.classList.add(
                    "visible"
                );

                storyUI.classList.add(
                    "visible"
                );

            },
            700
        );


        playSound(
            "ambience",
            false
        );


        await wait(1200);


        busy = false;


        showScene(
            "start"
        );

    }
);


/* =========================================================
   PLAY AGAIN
========================================================= */

playAgain.addEventListener(
    "click",
    () => {

        resetGame();

    }
);


/* =========================================================
   SOUND TOGGLE
========================================================= */

soundToggle.addEventListener(
    "click",
    () => {

        soundEnabled =
            !soundEnabled;


        soundToggle.textContent =
            soundEnabled
                ? "SOUND ON"
                : "SOUND OFF";


        if (!soundEnabled) {

            Object.values(
                sounds
            ).forEach(
                audio =>
                    audio.pause()
            );

        } else {

            playSound(
                "ambience",
                false
            );

        }

    }
);


/* =========================================================
   UTILITY
========================================================= */

function wait(ms) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );

}


/* =========================================================
   INITIAL
========================================================= */

cameraReset(.1);

console.log(
    "2:17 AM — FIXED CINEMATIC CAMERA"
);