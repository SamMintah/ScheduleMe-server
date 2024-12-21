export class Meeting {
    constructor(id, startTime, timezone, duration, participants, title, description) {
        this.id = id;
        this.startTime = startTime;
        this.timezone = timezone;
        this.duration = duration;
        this.participants = participants;
        this.title = title;
        this.description = description;
    }
}