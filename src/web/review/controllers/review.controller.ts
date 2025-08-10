import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  Inject,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { REVIEW_SERVICE, ReviewService } from '../interface/review.service';
import {
  CreateReviewDto,
  UpdateReviewDto,
  ReviewResponseDto,
  ReviewStatsDto,
} from '../../../dtos/review.dto';
import { ApiResponses } from '../../../dtos/response';
import { AuthGuard } from '../../../commons/security/guard';
import { RolesGuard } from '../../../commons/security/roles.guard';
import { UserType } from '../../../enums/user.enum';
import { Roles } from '../../../commons/decorator/roles.decorator';
import { Authenticated } from '../../../commons/decorator/auth.decorator';
import { CurrentUser } from 'src/commons/decorator/current-user.decorator';
import { JwtPayload as UserDetails } from 'src/web/auth/interface/jwt-payload.interface';

@ApiTags('Reviews')
@Controller('reviews')
@UseGuards(AuthGuard, RolesGuard)
@Authenticated()
@ApiBearerAuth()
export class ReviewController {
  constructor(
    @Inject(REVIEW_SERVICE) private readonly reviewService: ReviewService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({
    status: 201,
    description: 'Review created successfully',
    type: ReviewResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Roles(UserType.CUSTOMER, UserType.ADMIN)
  async createReview(
    @CurrentUser() req: UserDetails,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<ApiResponses<ReviewResponseDto>> {
    return this.reviewService.createReview(req, createReviewDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get review by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Review ID' })
  @ApiResponse({
    status: 200,
    description: 'Review retrieved successfully',
    type: ReviewResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @Roles(UserType.CUSTOMER, UserType.ADMIN)
  async getReviewById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponses<ReviewResponseDto>> {
    return this.reviewService.getReviewById(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get reviews for a specific user (reviewee)' })
  @ApiParam({ name: 'userId', type: Number, description: 'User ID' })
  @ApiQuery({
    name: 'reviewType',
    required: false,
    description: 'Filter by review type (CAR_OWNER, RENTER, CAR)',
  })
  @ApiResponse({
    status: 200,
    description: 'Reviews retrieved successfully',
    type: [ReviewResponseDto],
  })
  @Roles(UserType.CUSTOMER, UserType.ADMIN)
  async getReviewsByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('reviewType') reviewType?: string,
  ): Promise<ApiResponses<ReviewResponseDto[]>> {
    return this.reviewService.getReviewsByRevieweeId(userId, reviewType);
  }

  @Get('reviewer/:reviewerId')
  @ApiOperation({ summary: 'Get reviews written by a specific user' })
  @ApiParam({ name: 'reviewerId', type: Number, description: 'Reviewer ID' })
  @ApiResponse({
    status: 200,
    description: 'Reviews retrieved successfully',
    type: [ReviewResponseDto],
  })
  @Roles(UserType.CUSTOMER, UserType.ADMIN)
  async getReviewsByReviewerId(
    @Param('reviewerId', ParseIntPipe) reviewerId: number,
  ): Promise<ApiResponses<ReviewResponseDto[]>> {
    return this.reviewService.getReviewsByReviewerId(reviewerId);
  }

  @Get('car/:carId')
  @ApiOperation({ summary: 'Get reviews for a specific car' })
  @ApiParam({ name: 'carId', type: Number, description: 'Car ID' })
  @ApiResponse({
    status: 200,
    description: 'Car reviews retrieved successfully',
    type: [ReviewResponseDto],
  })
  @Roles(UserType.CUSTOMER, UserType.ADMIN)
  async getReviewsByCarId(
    @Param('carId', ParseIntPipe) carId: number,
  ): Promise<ApiResponses<ReviewResponseDto[]>> {
    return this.reviewService.getReviewsByCarId(carId);
  }

  @Get('stats/:userId')
  @ApiOperation({ summary: 'Get review statistics for a user' })
  @ApiParam({ name: 'userId', type: Number, description: 'User ID' })
  @ApiQuery({
    name: 'reviewType',
    required: false,
    description: 'Filter by review type (CAR_OWNER, RENTER, CAR)',
  })
  @ApiResponse({
    status: 200,
    description: 'Review statistics retrieved successfully',
    type: ReviewStatsDto,
  })
  @Roles(UserType.CUSTOMER, UserType.ADMIN)
  async getReviewStats(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('reviewType') reviewType?: string,
  ): Promise<ApiResponses<ReviewStatsDto>> {
    return this.reviewService.getReviewStats(userId, reviewType);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a review' })
  @ApiParam({ name: 'id', type: Number, description: 'Review ID' })
  @ApiResponse({
    status: 200,
    description: 'Review updated successfully',
    type: ReviewResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your review' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @Roles(UserType.CUSTOMER, UserType.ADMIN)
  async updateReview(
    @CurrentUser() req: UserDetails,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<ApiResponses<ReviewResponseDto>> {
    return this.reviewService.updateReview(id, req, updateReviewDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a review' })
  @ApiParam({ name: 'id', type: Number, description: 'Review ID' })
  @ApiResponse({
    status: 200,
    description: 'Review deleted successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - not your review' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @Roles(UserType.CUSTOMER, UserType.ADMIN)
  async deleteReview(
    @CurrentUser() req: UserDetails,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponses<{ message: string }>> {
    return this.reviewService.deleteReview(id, req);
  }

  @Get('my/reviews')
  @ApiOperation({ summary: "Get current user's reviews" })
  @ApiResponse({
    status: 200,
    description: 'User reviews retrieved successfully',
    type: [ReviewResponseDto],
  })
  @Roles(UserType.CUSTOMER, UserType.ADMIN)
  async getMyReviews(
    @CurrentUser() req: UserDetails,
  ): Promise<ApiResponses<ReviewResponseDto[]>> {
    return this.reviewService.getReviewsByReviewerId(req.userId);
  }
}
