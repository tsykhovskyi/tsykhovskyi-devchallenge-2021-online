import { Request, Response } from "express";
import {
  SimpleBoxRequest,
  SimpleBoxRequestValidator,
} from "./simple-box-request";
import { errorResponse, successResponse } from "./response";
import { Renderer } from "../plotter/renderer";
import { FieldFigureDistributor } from "../box/field-figure-distributor";

export class SimpleBoxController {
  private validator: SimpleBoxRequestValidator;
  private renderer: Renderer;
  private distributor: FieldFigureDistributor;

  constructor() {
    this.validator = new SimpleBoxRequestValidator();
    this.renderer = new Renderer();
    this.distributor = new FieldFigureDistributor();
  }

  index(req: Request, res: Response) {
    let body = req.body;
    let request: SimpleBoxRequest;

    try {
      request = this.validator.validate(body);
    } catch (err) {
      return errorResponse(res, err as Error);
    }

    const boxes = this.distributor.fillBoxes(
      request.boxSize,
      request.sheetSize
    );
    if (boxes.length === 0) {
      return errorResponse(
        res,
        new Error(
          "Invalid sheet size. Too small for producing at least one box"
        )
      );
    }
    const commands = this.renderer.render(boxes);

    successResponse(res, boxes.length, commands);
  }
}
