import {IOutputPort} from "../../../../1_enterprise_business_rules/use_cases/port/iOutputPort";

export default class SaveOutputPort implements IOutputPort<string> {
    private readonly _result: string;

    constructor(result: string) {
        this._result = result;
    }

    get(): string {
        return this._result;
    }
}