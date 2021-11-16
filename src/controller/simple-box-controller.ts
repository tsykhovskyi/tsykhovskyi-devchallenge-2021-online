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

    const result = (new Renderer()).fillBoxes(request.boxSize, request.sheetSize);

    successResponse(res, result);
  }
}
