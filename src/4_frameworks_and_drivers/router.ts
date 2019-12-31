import 'reflect-metadata';

import express, {Request, Response, Router} from 'express';
import {IController} from '../2_application_business_rules/controllers/iController';
import {container} from '../inversify.config';
import {TYPES} from '../types';
import {
    SEARCH_TYPES,
    SearchControllerQuery,
} from '../3_interface_adapters/controllers/searchControllerImpl';
import {
    IMAGE_TYPES,
    ImageControllerQuery,
} from '../3_interface_adapters/controllers/imageControllerImpl';

// TODO: validator
const router: Router = express.Router();

const imageRouteMatch = new RegExp(/images(\/\d+)?\.json$/);
const imageSaveMatch = new RegExp(/images\.json$/);
const imageNormalMatch = new RegExp(/images\/(\d+)\.json$/);

const imageUrlRouteMatch = new RegExp(/(\d+)\.(?<!json)([A-Za-z]+)$/);

const searchRouteMatch = new RegExp(/search(\/(newest|random))?\.json/);
const searchNormalMatch = new RegExp(/search\.json/);
const searchNewestMatch = new RegExp(/search\/newest\.json$/);
const searchRandomMatch = new RegExp(/search\/random\.json$/);

/*
/images.json
/images/[id].json
 */
router.get(imageRouteMatch, async (req: Request, res: Response) => {
    let controllerType: Symbol = IMAGE_TYPES.NORMAL;
    let query: ImageControllerQuery = new ImageControllerQuery();
    let matched: RegExpMatchArray;

    if (req.path.match(imageSaveMatch)) {
        controllerType = IMAGE_TYPES.SAVE;
        query.url = req.query.url || '';
        query.quote = req.query.quote || '';
        query.tags = req.query.tags || '';
    } else if (matched = req.path.match(imageNormalMatch) || [], matched.length > 0) {
        controllerType = IMAGE_TYPES.NORMAL;
        const id: string = matched[1];
        query.id = id;
    }
    const controller: IController = container.get<IController>(TYPES.ImageController);
    controller.useCaseType = controllerType;
    await controller.invoke(query);
    res.send(controller.useCase.presenter.view);
});

/*
/search.json
/search/newest.json
/search/random.json
 */
router.get(searchRouteMatch, async (req: Request, res: Response) => {
    let controllerType: Symbol = SEARCH_TYPES.NORMAL;
    let query: SearchControllerQuery = new SearchControllerQuery();
    if (req.path.match(searchNormalMatch)) {
        controllerType = SEARCH_TYPES.NORMAL;
        query.q = req.query.q || '';
    } else if (req.path.match(searchNewestMatch)) {
        controllerType = SEARCH_TYPES.NEWEST;
    } else if (req.path.match(searchRandomMatch)) {
        controllerType = SEARCH_TYPES.RANDOM;
    } else {
        res.send('NOT FOUND');
        return;
    }
    const controller: IController = container.get<IController>(TYPES.SearchController);
    controller.useCaseType = controllerType;
    await controller.invoke(query);
    res.send(controller.useCase.presenter.view);
});

router.get(imageUrlRouteMatch, async (req: Request, res: Response) => {
    const matched: RegExpMatchArray = req.path.match(imageUrlRouteMatch) || [];
    const id: string = matched[1];
    const ext: string = matched[2];
    const query: ImageControllerQuery = new ImageControllerQuery();
    query.id = id;
    const controller: IController = container.get<IController>(TYPES.ImageController);
    controller.useCaseType = IMAGE_TYPES.NORMAL;
    await controller.invoke(query);
    const view: {} = controller.useCase.presenter.view;
    res.send(controller.useCase.presenter.view);
});

export default router