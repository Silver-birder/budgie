import {IInputPort, IInputPortFormat} from '../../../../1_enterprise_business_rules/use_cases/port/iInputPort';
import {IRequest} from '../../../controllers/iController';

export interface SearchInputPortFormat extends IInputPortFormat {
    keyword: string;
    id: number;
    tags: Array<string>;
}


export default class SearchInputPortImpl implements IInputPort<IInputPortFormat> {
    private _data: SearchInputPortFormat = {keyword: '', id: 0, tags: []};

    set(request: IRequest) {
        this._data.keyword = request.keyword;
        this._data.id = request.id;
        this._data.tags = request.tags;
    }

    get(): SearchInputPortFormat {
        return this._data;
    }
}