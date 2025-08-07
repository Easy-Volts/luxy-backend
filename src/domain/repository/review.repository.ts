import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.model';

@Injectable()
export class ReviewRepository {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
  ) {}

  async create(reviewData: Partial<Review>): Promise<Review> {
    const review = this.reviewRepo.create(reviewData);
    return await this.reviewRepo.save(review);
  }

  async findById(id: number): Promise<Review | null> {
    return await this.reviewRepo.findOne({
      where: { id },
      relations: ['reviewer', 'reviewee', 'car'],
    });
  }

  async findByRevieweeId(revieweeId: number): Promise<Review[]> {
    return await this.reviewRepo.find({
      where: { revieweeId, isActive: true },
      relations: ['reviewer', 'reviewee', 'car'],
      order: { dateCreated: 'DESC' },
    });
  }

  async findByReviewerId(reviewerId: number): Promise<Review[]> {
    return await this.reviewRepo.find({
      where: { reviewerId, isActive: true },
      relations: ['reviewer', 'reviewee', 'car'],
      order: { dateCreated: 'DESC' },
    });
  }

  async findByCarId(carId: number): Promise<Review[]> {
    return await this.reviewRepo.find({
      where: { carId, isActive: true },
      relations: ['reviewer', 'reviewee', 'car'],
      order: { dateCreated: 'DESC' },
    });
  }

  async getAverageRating(
    revieweeId: number,
    reviewType?: string,
  ): Promise<number> {
    const query = this.reviewRepo
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'average')
      .where('review.revieweeId = :revieweeId', { revieweeId })
      .andWhere('review.isActive = :isActive', { isActive: true });

    if (reviewType) {
      query.andWhere('review.reviewType = :reviewType', { reviewType });
    }

    const result: { average: string } | undefined = await query.getRawOne();
    return result?.average ? parseFloat(result.average) : 0;
  }

  async getRatingDistribution(
    revieweeId: number,
    reviewType?: string,
  ): Promise<{ rating: number; count: string }[]> {
    const query = this.reviewRepo
      .createQueryBuilder('review')
      .select('review.rating', 'rating')
      .addSelect('COUNT(*)', 'count')
      .where('review.revieweeId = :revieweeId', { revieweeId })
      .andWhere('review.isActive = :isActive', { isActive: true })
      .groupBy('review.rating')
      .orderBy('review.rating', 'DESC');

    if (reviewType) {
      query.andWhere('review.reviewType = :reviewType', { reviewType });
    }

    return await query.getRawMany();
  }

  async getTotalReviewsCount(
    revieweeId: number,
    reviewType?: string,
  ): Promise<number> {
    const query = this.reviewRepo
      .createQueryBuilder('review')
      .where('review.revieweeId = :revieweeId', { revieweeId })
      .andWhere('review.isActive = :isActive', { isActive: true });

    if (reviewType) {
      query.andWhere('review.reviewType = :reviewType', { reviewType });
    }

    return await query.getCount();
  }

  async update(
    id: number,
    updateData: Partial<Review>,
  ): Promise<Review | null> {
    await this.reviewRepo.update(id, updateData);
    return await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.reviewRepo.update(id, { isActive: false });
  }
}
