import { Response } from 'express';
import { Command } from '../plotter/models';
import { FigurePositionInterface } from '../box/models';

export function errorResponse(res: Response, err: Error) {
  res.statusCode = 422;
  res.send({
    success: false,
    error: err.message
  });
}

export function successResponse(res: Response, amount: number, program: Command[], boxes: FigurePositionInterface[]) {
  res.statusCode = 200;
  res.send({
    success: true,
    amount,
    boxes: boxes.map(box => [box.offsetPoint, box.figure.direction]),
    program,
  });
}
