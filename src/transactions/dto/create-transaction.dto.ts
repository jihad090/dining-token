import { IsNotEmpty, IsString, IsNumber, IsEnum ,Min, Max} from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  bkashNumber: string;

  @IsNotEmpty()
  @IsString()
  trxId: string;

  @IsNotEmpty()
  @IsEnum(['15_days', '30_days', 'rest_month'])
  packageType: string;


  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'Days must be at least 1' }) 
  @Max(31, { message: 'Days cannot exceed 31' }) 
  daysCount: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1) 
  amount: number;
}