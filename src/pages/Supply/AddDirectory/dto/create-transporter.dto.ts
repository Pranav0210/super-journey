import { ArrayNotEmpty, IsNotEmpty, IsOptional, IsString, Validate, validate, ValidateNested, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: "OperatingCityNotSameAsHomebase", async: false })
export class ArrayMustNotContainValue implements ValidatorConstraintInterface {
  validate(items: OperatingCity[], args: ValidationArguments) {
    const forbiddenItem = (args.object as any).homebase;
    if (!forbiddenItem || !forbiddenItem.place_id) return true;

    return !items.some(item => item.placeId === forbiddenItem.placeId)
  }

  defaultMessage(args: ValidationArguments) {
    return `The array must not contain the forbidden value: "${(args.object as any).homebase}"`;
  }
}

export class Step1Dto {

  @IsNotEmpty({ message: "Company name is required" })
  @IsString({ message: "Company name must be a string" })
  companyName: string;

  @IsOptional()
  @IsString({ message: "Description must be a string" })
  description?: string;

  @ValidateNested({ message: "Select a value from the dropdown" })
  @IsNotEmpty({ message: "Homebase is required" })
  homebase: OperatingCity;

  @Validate(ArrayMustNotContainValue, { message: "Homebase not allowed in operating cities" })
  @ArrayNotEmpty({ message: "Atleast one operating city is required" })
  operatingCities: OperatingCity[]
}

export class OperatingCity {
  @IsNotEmpty({ message: "Homebase is required" })
  @IsString({ message: "Location name must be a string" })
  name: string;

  @IsNotEmpty({ message: "placeId is required" })
  @IsString({ message: "placeId must be a string" })
  placeId: string;
}

export const validateStepData = async (stepData: any, dtoClass: any) => {
  const dto = Object.assign(new dtoClass(), stepData);
  const errors = await validate(dto);

  if (errors.length > 0) {
    return errors.map((error) => ({
      field: error.property,
      message: Object.values(error.constraints || {}).join(", "),
    }));
  }

  return null;
};