export class CustomError extends Error{
    constructor(errorStatus, errorMessage){
        super(errorMessage);
        this.errorStatus = errorStatus ? errorStatus : 500;
        this.errorMessage = errorMessage ? errorMessage : "Custom Error - Unknown Error.";
    }
}