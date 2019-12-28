import {IImageObject} from "../../2_application_business_rules/gateways/iSearchGateway";
import {IUseCase} from "../../1_enterprise_business_rules/use_cases/iUseCase";
import {IImageTextGateway} from "../gateways/iImageTextGateway";
import {IImageGateway} from "../gateways/iImageGateway";
import {ISearchGateway} from "../gateways/iSearchGateway";
import {inject, injectable} from "inversify";
import {TYPES} from "../../types";
import {IInputPort} from "../../1_enterprise_business_rules/use_cases/port/iInputPort";

@injectable()
export default class SaveInteractorImpl implements IUseCase {
    private imageTextGateWay: IImageTextGateway;
    private imageGateWay: IImageGateway;
    private searchGateWay: ISearchGateway;

    constructor(
        @inject(TYPES.ImageTextGateway) imageTextGateWay: IImageTextGateway,
        @inject(TYPES.ImageGateway) imageGateWay: IImageGateway,
        @inject(TYPES.SearchGateway) searchGateWay: ISearchGateway) {
        this.imageTextGateWay = imageTextGateWay;
        this.imageGateWay = imageGateWay;
        this.searchGateWay = searchGateWay;
    }

    async invoke(inputPort: IInputPort<string>): Promise<any> {
        const url: string = inputPort.get();
        const text = await this.imageTextGateWay.text(url);
        const saved_url = await this.imageGateWay.save(url);
        const content: Array<IImageObject> = [{
            "url": saved_url,
            "text": text
        }];
        await this.searchGateWay.save(content);
    }
}