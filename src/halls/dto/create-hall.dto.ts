import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateHallDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Capacity is required' })
  @IsNumber({}, { message: 'Capacity must be a number' })
  capacity: number;
}