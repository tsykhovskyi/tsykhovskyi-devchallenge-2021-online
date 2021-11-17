import { Request, Response } from 'express';
import { SimpleBoxRequest, SimpleBoxRequestValidator } from './simple-box-request';
import { errorResponse, successResponse } from './response';
import { Renderer } from '../box/renderer';

export class SimpleBoxController {
  private validator: SimpleBoxRequestValidator;
  constructor() {
    this.validator = new SimpleBoxRequestValidator();
  }

  index(req: Request, res: Response) {
    let body = req.body;
    let request: SimpleBoxRequest;

    try {
      request = this.validator.validate(body);
    } catch (err) {
      return errorResponse(res, err as Error)
    }

    const boxes = (new Renderer()).fillBoxes(request.boxSize, request.sheetSize);
    if (boxes.length === 0) {
      errorResponse(res, new Error('Invalid sheet size. Too small for producing at least one box'));
    }

    successResponse(res, boxes);
  }
}
