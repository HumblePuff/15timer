function formatCurrentTime(hours, minutes) {
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
}
function formatRemainingTime(minutes, seconds) {
    return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    function calculateCountdown() {
        var now = new Date();
        var minutes = now.getMinutes();
        var seconds = now.getSeconds();
        var countdown = (10 - (minutes % 10)) * 60 - seconds;
        return countdown;
    }
    setInterval(function () {
        var now = new Date();
        var countdown = calculateCountdown();
        var minutesRemaining = Math.floor(countdown / 60);
        var secondsRemaining = countdown % 60;
        var text = document.getElementById("input").value;
        var firstTimeIndex = text.indexOf(")");
        var secondTimeIndex = text.indexOf("(", firstTimeIndex + 1);
        document.getElementById("current-time").textContent = formatCurrentTime(
            now.getHours(),
            now.getMinutes()
            );
            var totalSecondsRemaining = minutesRemaining * 60 + secondsRemaining;
            var progress = (10 * 60 - totalSecondsRemaining) / (10 * 60);
            document.getElementById(
                "input"
                ).style.background = `linear-gradient(to right, rgb(100, 0, 0, .5) ${
                    progress * 100
                }%, #000 ${progress * 100}%)`;
                deleteOldNotes();
                if (now.getMinutes() % 10 == 0 && now.getSeconds() == 0) {
                    playTone(440, 500);
                }
            }, 1000);
            function autoSave() {
                localStorage.setItem(
                    "notepad_text",
                    document.getElementById("input").value
                    );
                }
                function autoRetrieve() {
                    if (localStorage.getItem("notepad_text")) {
                        document.getElementById("input").value = localStorage.getItem("notepad_text");
                    }
                    var lastRemovedNote = localStorage.getItem("last_removed_note");
                    if (lastRemovedNote) {
                        document.getElementById("last-line").textContent = lastRemovedNote;
                        var now = new Date();
                        var lastNoteHours = Number(lastRemovedNote.split(':')[0]);
                        var lastNoteMinutes = Number(lastRemovedNote.split(':')[1]);
                        var lastNoteDate = new Date();
                        lastNoteDate.setHours(lastNoteHours, lastNoteMinutes);
                        var diffMinutes = Math.abs(now - lastNoteDate) / 60000; // in minutes
                        document.getElementById("last-line").style.visibility = diffMinutes > 10 ? "visible" : "hidden";
                    }
                    var displayText = localStorage.getItem("display_text");
                    if (displayText) {
                        document.getElementById("display-text").textContent = displayText;
                    }
                }
                function playTone(frequency = 440, duration = 500) {
                    var now = new Date();
                    if (now.getHours() >= 9) {
                        var audioContext = new (window.AudioContext ||
                            window.webkitAudioContext)();
                            var oscillator = audioContext.createOscillator();
                            oscillator.frequency.value = frequency;
                            oscillator.type = "square";
                            oscillator.connect(audioContext.destination);
                            oscillator.start();
                            setTimeout(function () {
                                oscillator.stop();
                            }, duration);
                        }
                    }
                    function deleteOldNotes() {
                        var now = new Date();
                        var fourHoursLater = new Date(now.getTime() + 4 * 60 * 60 * 1000);
                        var notes = document.getElementById("input").value.split("\n");
                        var index = 0;
                        var lastRemovedNote = "";
                        var displayText = "";
                        for (var note of notes) {
                            var noteTime = note.match(/\(([^)]+)\)/);
                            if (noteTime) {
                                var [hours, minutes] = noteTime[1].split(":").map(Number);
                                var noteDate = new Date();
                                noteDate.setHours(hours, minutes, 0, 0);
                                if (noteDate <= now || noteDate >= fourHoursLater ) {
                                    index += 1;
                                    var noteParts = note.split(') ');
                                    if (noteParts.length > 1) {
                                        lastRemovedNote = noteTime[0];
                                        displayText = noteParts[1];
                                    }
                                } else {
                                    break;
                                }
                            } else {
                                index += 1;
                            }
                        }
                        notes.splice(0, index);
                        document.getElementById("input").value = notes.join("\n");
                        if (lastRemovedNote.length > 1) {
                            lastRemovedNote = lastRemovedNote.replace(/[()]/g, "");
                            document.getElementById("last-line").textContent = lastRemovedNote;
                            localStorage.setItem("last_removed_note", lastRemovedNote);
                            var now = new Date();
                            var lastNoteHours = Number(lastRemovedNote.split(':')[0]);
                            var lastNoteMinutes = Number(lastRemovedNote.split(':')[1]);
                            var lastNoteDate = new Date();
                            lastNoteDate.setHours(lastNoteHours, lastNoteMinutes);
                            var diffMinutes = Math.abs(now - lastNoteDate) / 60000; // in minutes
                            document.getElementById("last-line").style.visibility = diffMinutes > 10 ? "visible" : "hidden";
                        }
                        if (displayText.length > 1) {
                            document.getElementById("display-text").textContent = displayText;
                            localStorage.setItem("display_text", displayText);
                        }
                        autoSave();
                    }
                    document.body.addEventListener("click", function () {
                        recognition.start();
                    });
                    function calculateEndTime() {
                        var lastNote = document.getElementById("input").value.split("\n").pop();
                        var hours, minutes;
                        if (lastNote.length > 0) {
                            var lastEndTime = lastNote.match(/\(([^)]+)\)/)[1];
                            [hours, minutes] = lastEndTime.split(":").map(Number);
                            if (minutes === 50) {
                                minutes = 0;
                                hours = (hours + 1) % 24;
                            } else {
                                minutes += 10;
                            }
                        } else {
                            var now = new Date();
                            hours = now.getHours();
                            minutes = now.getMinutes();
                            var remainingMinutes = 10 - (minutes % 10);
                            minutes = (minutes + remainingMinutes) % 60;
                            if (minutes < now.getMinutes()) {
                                hours = (hours + 1) % 24;
                            }
                        }
                        return formatCurrentTime(hours, minutes);
                    }
                    document.getElementById("input").addEventListener("input", autoSave);
                    autoRetrieve();
                    var recognition = new (window.SpeechRecognition ||
                        window.webkitSpeechRecognition ||
                        window.mozSpeechRecognition ||
                        window.msSpeechRecognition)();
                        recognition.lang = "en-US";
                        recognition.interimResults = false;
                        recognition.maxAlternatives = 5;
                        recognition.onresult = function (event) {
                            var speechResult = event.results[0][0].transcript;
                            var maxLength = 50;
                            var formattedEndTime = calculateEndTime();
                            var lastNote = document.getElementById("input").value.split("\n").pop();
                            if (lastNote.startsWith("(" + formattedEndTime + ")")) {
                                formattedEndTime = calculateEndTime(true);
                            }
                            speechResult = "(" + formattedEndTime + ")  " + speechResult;
                            if (speechResult.length > maxLength) {
                                speechResult = speechResult.substring(0, maxLength - 3) + "...";
                            }
                            document.getElementById("input").value += "\n" + speechResult;
                            autoSave();
                            document.getElementById("input").readOnly = false;
                        };
                        recognition.onnomatch = function () {
                            document.getElementById("input").readOnly = false;
                        };
                        recognition.onerror = function () {
                            document.getElementById("input").readOnly = false;
                        };
                        document.body.addEventListener("click", function () {
                            document.getElementById("input").readOnly = true;
                            recognition.start();
                        });