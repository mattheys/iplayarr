import arrService from '../service/arrService';
import { Validator } from './Validator';

export class AppFormValidator extends Validator {
    async validate(input: any): Promise<{[key: string]: string}> {
        const validatorError : { [key: string]: string; } = {};
        const testResult : string | boolean = await arrService.testConnection({API_KEY : input.api_key, HOST : input.url});
        if (testResult != true){
            validatorError['api_key'] = testResult as string;
            validatorError['url'] = testResult as string;
        }
        return validatorError;
    }
}