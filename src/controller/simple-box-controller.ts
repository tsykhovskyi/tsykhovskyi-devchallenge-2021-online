import { Request, Response } from 'express';
import { SimpleBoxRequest, SimpleBoxRequestValidator } from './simple-box-request';
import { errorResponse, successResponse } from './response';
import { FieldFigureDistributor } from '../box/fieldFigureDistributor';
import { Renderer } from '../plotter/renderer';

export class SimpleBoxController {
  private validator: SimpleBoxRequestValidator;
  private renderer: Renderer;

  constructor() {
    this.validator = new SimpleBoxRequestValidator();
    this.renderer = new Renderer();
  }

  index(req: Request, res: Response) {
    let body = req.body;
    let request: SimpleBoxRequest;

    try {
      request = this.validator.validate(body);
    } catch (err) {
      return errorResponse(res, err as Error)
    }

    const distributor = new FieldFigureDistributor();
    const boxes = distributor.fillBoxes(request.boxSize, request.sheetSize);
    if (boxes.length === 0) {
      errorResponse(res, new Error('Invalid sheet size. Too small for producing at least one box'));
    }


    const commands = this.renderer.render(boxes);

    successResponse(res, boxes.length, commands, boxes);
  }
}
