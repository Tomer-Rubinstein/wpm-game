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

export default Interval;
