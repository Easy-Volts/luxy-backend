import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewController } from '../controllers/review.controller';
import { ReviewServiceImpl } from '../services/review.serviceImpl';
import { REVIEW_SERVICE } from '../interface/review.service';
import { Review } from '../../../domain/entities/review.model';
import { ReviewRepository } from '../../../domain/repository/review.repository';
import { SharedModule } from '../../../shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), SharedModule],
  controllers: [ReviewController],
  providers: [
    {
      provide: REVIEW_SERVICE,
      useClass: ReviewServiceImpl,
    },
    ReviewRepository,
  ],
  exports: [REVIEW_SERVICE, ReviewRepository],
})
export class ReviewModule {}
