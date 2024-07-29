const readline = require('readline');
const EventEmitter = require('events');

class AlarmClock extends EventEmitter {
    constructor() {
        super();
        this.alarms = [];
    }

    displayCurrentTime() {
        const now = new Date();
        console.log(`Current Time: ${now.toLocaleTimeString()}`);
    }

    addAlarm(time, day) {
        this.alarms.push({ time, day, snoozeCount: 0, active: true });
        console.log(`Alarm set for ${day} at ${time}`);
    }

    deleteAlarm(index) {
        if (index < this.alarms.length) {
            this.alarms.splice(index, 1);
            console.log('Alarm deleted successfully.');
        } else {
            console.log('Invalid alarm index.');
        }
    }

    snoozeAlarm(index) {
        if (index < this.alarms.length && this.alarms[index].snoozeCount < 3) {
            const [hour, minute] = this.alarms[index].time.split(':').map(Number);
            const snoozeTime = new Date();
            snoozeTime.setHours(hour);
            snoozeTime.setMinutes(minute + (this.alarms[index].snoozeCount + 1) * 5);
            this.alarms[index].snoozeCount += 1;
            this.alarms[index].time = snoozeTime.toTimeString().slice(0, 5);
            console.log(`Alarm snoozed to ${this.alarms[index].time}`);
        } else {
            console.log('Cannot snooze this alarm any further.');
        }
    }

    checkAlarms() {
        const now = new Date();
        const currentTime = now.toTimeString().slice(0, 5);
        const currentDay = now.toLocaleString('en-US', { weekday: 'long' });

        this.alarms.forEach((alarm, index) => {
            if (alarm.active && alarm.time === currentTime && alarm.day === currentDay) {
                console.log(`Alarm Alert! Time: ${alarm.time}, Day: ${alarm.day}`);
                alarm.active = false; // Deactivate alarm after it rings
            }
        });
    }
}

const alarmClock = new AlarmClock();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function mainMenu() {
    console.log(`\n1. Display Current Time\n2. Add Alarm\n3. Delete Alarm\n4. Snooze Alarm\n5. Exit`);
    rl.question('Choose an option: ', (answer) => {
        switch (answer) {
            case '1':
                alarmClock.displayCurrentTime();
                mainMenu();
                break;
            case '2':
                rl.question('Enter alarm time (HH:MM): ', (time) => {
                    rl.question('Enter day of the week: ', (day) => {
                        alarmClock.addAlarm(time, day);
                        mainMenu();
                    });
                });
                break;
            case '3':
                rl.question('Enter alarm index to delete: ', (index) => {
                    alarmClock.deleteAlarm(Number(index));
                    mainMenu();
                });
                break;
            case '4':
                rl.question('Enter alarm index to snooze: ', (index) => {
                    alarmClock.snoozeAlarm(Number(index));
                    mainMenu();
                });
                break;
            case '5':
                rl.close();
                break;
            default:
                console.log('Invalid option, please try again.');
                mainMenu();
        }
    });
}

setInterval(() => alarmClock.checkAlarms(), 60000); // Check alarms every minute

mainMenu();
