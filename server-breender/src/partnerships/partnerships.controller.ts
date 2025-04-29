import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PartnershipsService } from './partnerships.service';

@Controller('partnerships')
@UseGuards(AuthGuard)
export class PartnershipsController {
  constructor(private readonly partnershipsService: PartnershipsService) { }


}
