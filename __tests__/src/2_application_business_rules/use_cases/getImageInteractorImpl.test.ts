import {container} from "@src/inversify.config";
import {TYPES} from "@src/types";
import {ISearchGateway} from "@src/2_application_business_rules/gateways/iSearchGateway";
import {IPresenter} from "@src/1_enterprise_business_rules/presenters/iPresenter";
import {SearchGatewayMockImpl} from "@src/3_interface_adapters/gateways/searchGatewayMockImpl";
import {SearchPresenterMockImpl} from "@src/3_interface_adapters/presenters/searchPresenterMockImpl";
import {IUseCase} from "@src/1_enterprise_business_rules/use_cases/iUseCase";
import {GetImageInteractorImpl} from "@src/2_application_business_rules/use_cases/getImageInteractorImpl";
import {IInputPort} from "@src/1_enterprise_business_rules/use_cases/port/iInputPort";
import {
    ImageInputPortFormat,
    ImageInputPortImpl
} from "@src/2_application_business_rules/use_cases/port/input/ImageInputPortImpl";
import requestPromise from "request-promise";
import {IRequest} from "@src/2_application_business_rules/controllers/iController";


describe('invoke', () => {
    beforeEach(() => {
        container.snapshot();
        container.rebind<ISearchGateway>(TYPES.SearchGateway).to(SearchGatewayMockImpl);
        container.rebind<IPresenter>(TYPES.SearchPresenter).to(SearchPresenterMockImpl);
        const response: string = 'response data';
        jest.spyOn(requestPromise, 'get').mockImplementationOnce((): any => {
            return response;
        });
    });
    afterEach(() => {
        container.restore();
    });
    describe('Args: Binary', () => {
        it('Set Presenter View', async () => {
            // Arrange
            const searchGateWay: ISearchGateway = container.get<ISearchGateway>(TYPES.SearchGateway);
            const searchPresenter: IPresenter = container.get<IPresenter>(TYPES.SearchPresenter);
            const interactor: IUseCase = new GetImageInteractorImpl(searchGateWay, searchPresenter);
            const input: IInputPort<ImageInputPortFormat> = new ImageInputPortImpl();
            const request: IRequest = {id: 1, extension: 'jpg', keyword: '', quote: '', tags: [], url: '', savedImage: false};
            input.set(request);

            // Act
            await interactor.invoke(input);

            // Assert
            expect(interactor.presenter.view).toBe('binary');
        });
    });
});