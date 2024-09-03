function Interval(fn, time) {
    var timer = false;
    this.start = () => {
        if (!this.isRunning())
            timer = setInterval(fn, time);
    };
    this.stop = () => {
        clearInterval(timer);
        timer = false;
    };
    this.isRunning = () => {
        return timer !== false;
    };
}

class DynamicInterval {
    constructor(func, initialTime) {
        this.func = func;
        this.tickInterval = new Interval(this.func, initialTime);
    }

    setNewTime = (newTime) => {
        this.tickInterval.stop();
        this.tickInterval = new Interval(this.func, newTime);
        if (!this.tickInterval.isRunning())
            this.tickInterval.start();
    }

    start = () => {
        if (!this.tickInterval.isRunning())
            this.tickInterval.start();
    }
}

export { Interval, DynamicInterval };
