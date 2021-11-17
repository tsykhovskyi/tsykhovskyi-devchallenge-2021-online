import { BoxSize, SheetSize } from "../box/models";

export interface SimpleBoxRequest {
  sheetSize: SheetSize;
  boxSize: BoxSize;
}

export class SimpleBoxRequestValidator {
  validate(body: any): SimpleBoxRequest {
    if (
      typeof body["sheetSize"] !== "object" ||
      typeof body["boxSize"] !== "object"
    ) {
      throw new Error("Invalid input format. Invalid request structure");
    }

    if (
      typeof body["sheetSize"]["w"] !== "number" ||
      typeof body["sheetSize"]["l"] !== "number" ||
      typeof body["boxSize"]["w"] !== "number" ||
      typeof body["boxSize"]["d"] !== "number" ||
      typeof body["boxSize"]["h"] !== "number"
    ) {
      throw new Error("Invalid input format. Invalid request structure");
    }

    if (
      body["sheetSize"]["w"] <= 0 ||
      body["sheetSize"]["l"] <= 0 ||
      body["boxSize"]["w"] <= 0 ||
      body["boxSize"]["d"] <= 0 ||
      body["boxSize"]["h"] <= 0
    ) {
      throw new Error(
        "Invalid input format.  Please use only positive integers"
      );
    }

    return {
      sheetSize: {
        width: body["sheetSize"]["w"],
        length: body["sheetSize"]["l"],
      },
      boxSize: {
        width: body["boxSize"]["w"],
        depth: body["boxSize"]["d"],
        height: body["boxSize"]["h"],
      },
    };
  }
}
