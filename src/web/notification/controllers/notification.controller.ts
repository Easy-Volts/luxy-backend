// src/web/notifications/controllers/notification.controller.ts
import {
  Controller,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  Query,
  Inject,
  UseGuards,
  Delete,
  Post,
  Body,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/commons/security/guard';
import { RolesGuard } from 'src/commons/security/roles.guard';
import { Authenticated } from 'src/commons/decorator/auth.decorator';
import { Roles } from 'src/commons/decorator/roles.decorator';
import { UserType } from 'src/enums/user.enum';
import { ApiResponses } from 'src/dtos/response';
import { CurrentUser } from 'src/commons/decorator/current-user.decorator';
import {
  NOTIFICATION_SERVICE,
  NotificationService,
} from '../interface/notification.service';
import { ListNotificationsQueryDto } from 'src/dtos/notification.query.dto';
import { CreateNotificationDto } from 'src/dtos/create.notification.dto';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(AuthGuard, RolesGuard)
@Authenticated()
@Roles(UserType.ADMIN, UserType.CUSTOMER)
export class NotificationController {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List notifications for current user' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'read', required: false, example: 'false' })
  @ApiQuery({ name: 'type', required: false, example: 'RIDE_BOOKED' })
  @ApiResponse({ status: 200, description: 'Notifications fetched' })
  async list(
    @CurrentUser() user: { id: number },
    @Query() query: ListNotificationsQueryDto,
  ): Promise<ApiResponses<any>> {
    return this.notificationService.list(user, query);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notification count' })
  async unreadCount(
    @CurrentUser() user: { id: number },
  ): Promise<ApiResponses<any>> {
    return this.notificationService.unreadCount(user);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  async markRead(
    @CurrentUser() user: { id: number },
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponses<any>> {
    return this.notificationService.markRead(user, id);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllRead(
    @CurrentUser() user: { id: number },
  ): Promise<ApiResponses<any>> {
    return this.notificationService.markAllRead(user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification' })
  async delete(
    @CurrentUser() user: { id: number },
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponses<any>> {
    return this.notificationService.delete(user, id);
  }

  // Admin/internal create – useful for seeding or system events
  @Post()
  @Roles(UserType.ADMIN)
  @ApiOperation({ summary: 'Create a notification (admin/internal)' })
  @ApiBody({ type: CreateNotificationDto })
  async create(@Body() dto: CreateNotificationDto): Promise<ApiResponses<any>> {
    return this.notificationService.create(dto);
  }
}
