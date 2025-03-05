import { Validator } from "./Validator";

export class ConfigFormValidator extends Validator {
    validate(input: any): {[key: string]: string} {
        const validatorError : { [key: string]: string; } = {};
        if (!this.directoryExists(input.DOWNLOAD_DIR)){
            validatorError["DOWNLOAD_DIR"] = `Directory ${input.DOWNLOAD_DIR} does not exist`;
        }
        if (!this.directoryExists(input.COMPLETE_DIR)){
            validatorError["COMPLETE_DIR"] = `Directory ${input.COMPLETE_DIR} does not exist`;
        }
        if (!this.isNumber(input.ACTIVE_LIMIT)){
            validatorError["ACTIVE_LIMIT"] = `Download limit must be a number`;
        } else if (input.ACTIVE_LIMIT < 0) {
            validatorError["ACTIVE_LIMIT"] = `Download limit must be a positive number`;
        }
        if (!input.AUTH_USERNAME){
            validatorError["AUTH_USERNAME"] = "Please provide a Username";
        }
        if (!input.AUTH_PASSWORD){
            validatorError["AUTH_PASSWORD"] = "Please provide a Password";
        }
        return validatorError;
    }
}