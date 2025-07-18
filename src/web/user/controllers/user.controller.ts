import { Controller, Patch, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UserService } from '../interface/user.service';
import { UpdateLocationDto } from '../../../dtos/update.location.dto';
import { Users } from '../../../domain/entities/user.model'; // Adjust path to your Users entity

@ApiTags('Users') // Group in Swagger UI
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
  ) {
    return this.userService.updateUserLocation(id, dto);
  }
}

