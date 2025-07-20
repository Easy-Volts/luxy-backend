import {
  Controller,
  Patch,
  Param,
  Body,
  ParseIntPipe,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { USER_SERVICE, UserService } from '../interface/user.service';
import { UpdateLocationDto } from '../../../dtos/update.location.dto';
import { Users } from '../../../domain/entities/user.model'; // Adjust path to your Users entity
import { AuthGuard } from 'src/commons/security/guard';
import { RolesGuard } from 'src/commons/security/roles.guard';
import { UserType } from 'src/enums/user.enum';
import { Roles } from 'src/commons/decorator/roles.decorator';
import { Authenticated } from 'src/commons/decorator/auth.decorator';
import { ApiResponses } from 'src/dtos/response';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
@Authenticated()
@Roles(UserType.ADMIN, UserType.CUSTOMER)
export class UserController {
  private userService: UserService;
  constructor(@Inject(USER_SERVICE) userService: UserService) {
    this.userService = userService;
  }
  @Patch(':id/location')
  @ApiOperation({ summary: 'Update user location by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User location updated successfully',
    type: Users,
  })
  async updateUserLocation(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLocationDto,
  ): Promise<ApiResponses<any>> {
    return this.userService.updateUserLocation(id, dto);
  }
}
