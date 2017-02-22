
interface ErrorConstructor
{
    /**
     * Creates an {@link Error} object that represents the {@link Sys.ArgumentException} exception.
     * @param paramName
     *      (Optional) The name of the parameter as a string that caused the exception. The value can be null. 
     * @param message
     *      (Optional) An error message string. If message is null, a default message is used.
     */
    argument( paramName?: any, message?: string): Error;

    create( message: string, errorInfo: any ): Error;

    popStackFrame(): void;
}

Error.argument = ( paramName?: any, message?: string ) =>
{
    let displayMessage = "Sys.ArgumentException: " + ( message ? message : Sys.Res.argument );
    if ( paramName )
    {
        displayMessage += "\n" + String.format(Sys.Res.paramName, paramName);
    }
    let err = Error.create( displayMessage, { name: "Sys.ArgumentException", paramName: paramName } );
    //err.popStackFrame();
    return err;
}

Error.create = ( message: string, errorInfo: any ) =>
{
    var err = new Error( message );
    err.message = message;
    if (errorInfo) {
        for (var v in errorInfo) {
            err[v] = errorInfo[v];
        }
    }
    //err.popStackFrame();
    return err;
}

Error.popStackFrame = () =>
{
    if (typeof(this.stack) === "undefined" || this.stack === null ||
        typeof(this.fileName) === "undefined" || this.fileName === null ||
        typeof(this.lineNumber) === "undefined" || this.lineNumber === null)
    {
        return;
    }
    var stackFrames = this.stack.split("\n");
    var currentFrame = stackFrames[0];
    var pattern = this.fileName + ":" + this.lineNumber;
    while(typeof(currentFrame) !== "undefined" &&
        currentFrame !== null &&
        currentFrame.indexOf(pattern) === -1) {
        stackFrames.shift();
        currentFrame = stackFrames[0];
    }
    var nextFrame = stackFrames[1];
    if (typeof(nextFrame) === "undefined" || nextFrame === null) {
        return;
    }
    var nextFrameParts = nextFrame.match(/@(.*):(\d+)$/);
    if (typeof(nextFrameParts) === "undefined" || nextFrameParts === null) {
        return;
    }
    this.fileName = nextFrameParts[1];
    this.lineNumber = parseInt(nextFrameParts[2]);
    stackFrames.shift();
    this.stack = stackFrames.join("\n");
}
