import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class MultiEnumValidationPipe<T extends Record<string, string>> implements PipeTransform {
    constructor(private enumType: T) {}

    transform(value: any): any | undefined {
        if (!value) return undefined;

        const statusArray = value.split(',');

        statusArray.forEach((status: any) => {
            const doesStatusExist = this.enumType[status];
            if (!doesStatusExist) {
                throw new BadRequestException(
                    `Invalid query parameter value. See the acceptable values: ${Object.keys(this.enumType)
                        .map((key) => this.enumType[key])
                        .join(', ')}`,
                );
            }
        });

        return statusArray;
    }
}
