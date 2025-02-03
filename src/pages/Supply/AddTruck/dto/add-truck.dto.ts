import { IsISO8601, IsNotEmpty, IsNumberString, IsOptional, IsString, validate, ValidateNested } from "class-validator";
// import { Type } from "class-transformer";

export class Step1Dto {
    @ValidateNested({ message: "Select a value from the dropdown" })
    @IsNotEmpty({ message: "Homebase is required" })
    pickupPoint: LocationPointDto;

    @ValidateNested({ message: "Select a value from the dropdown" })
    @IsNotEmpty({ message: "Homebase is required" })
    dropPoint: LocationPointDto;
}

export class LocationPointDto {
    @IsNotEmpty({ message: "Location name is required" })
    @IsString({ message: "Location name must be a string" })
    name: string;

    @IsNotEmpty({ message: "Place ID is required" })
    @IsString({ message: "Place ID must be a string" })
    placeId: string;
}

export class Step2Dto {
    @IsNotEmpty({ message: "Registration number is required" })
    @IsString({ message: "Registration number must be a string" })
    regNo: string;

    @IsOptional()
    @IsNumberString({}, { message: "Minimum price must be a valid number" })
    minPrice?: string;

    @IsOptional()
    @IsISO8601({}, { message: "Expiration time must be a valid date" })
    expirationTime?: string;

    @IsNotEmpty({ message: "Quantity is required" })
    @IsNumberString({}, { message: "Quantity must be a valid number" })
    quantity: string;

    @IsNotEmpty({ message: "Body is required" })
    @IsString({ message: "Body must be a string" })
    body: string;

    @IsNotEmpty({ message: "Length is required" })
    @IsNumberString({}, { message: "Length must be a valid number" })
    length: string;

    @IsOptional()
    @IsString({ message: "Unit must be a string" })
    unit?: string;
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