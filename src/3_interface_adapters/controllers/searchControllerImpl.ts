import {IUseCase} from "../../1_enterprise_business_rules/use_cases/iUseCase";
import {IController} from "../../2_application_business_rules/controllers/iController";

export default class SearchControllerImpl extends IController {
    useCase: IUseCase;

    constructor(useCase: IUseCase) {
        super();
        this.useCase = useCase;
    }

    invoke(q: any): any {
        return this.useCase.invoke(q);
    }
}