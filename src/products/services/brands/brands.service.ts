import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { BrandEntity } from '../../../products/models/brand.entity';
import { BrandI } from '../../../products/models/brand.interface';
import { CreateBrandDto, UpdateBrandDto } from '../../../products/models/dto/brand.dto';
import { Repository } from 'typeorm';
import { PaginatedResult, Pagination } from '../../../products/models/pagination.interface';
import { AppConstants } from '../../../app.constants';

@Injectable()
export class BrandsService {
    constructor(
            @InjectRepository(BrandEntity)
        private brandRepository: Repository<BrandEntity>,
    ) {}

    create(createdBrandsDto: CreateBrandDto) {
        return from(this.brandRepository.save(createdBrandsDto)).pipe(
            map((savedBrands: BrandI) => {
                const { ...brands } = savedBrands;
                return brands;
            })
        )
    }

    getAllBrands(pagination: Pagination): Observable<PaginatedResult<BrandI>> {
        return from(this.brandRepository.findAndCount({
            skip: pagination.offset,
            take: pagination.limit,
            order: { createdAt: "DESC" }
        })).pipe(
        map(([products, total]) => ({
            total: total,
            offset: pagination.offset,
            limit: pagination.limit,
            data: products
        })));
    }

    async update(updatedBrandDto: UpdateBrandDto): Promise<Observable<any>> {
        const Id = Number(updatedBrandDto.Id);
        const brand = await this.brandRepository.findOne({ where: { Id } });

        if (brand) {
            const upsertDto = { ...updatedBrandDto, Id };
            return from(this.brandRepository.upsert(upsertDto, ['Id'])).pipe(
                switchMap(() =>
                    from(this.brandRepository.findOne({ where: { Id } })).pipe(
                        map((updatedBrand) => {
                            if (!updatedBrand) {
                                throw new Error('Brand update failed');
                            }
                            return updatedBrand as BrandI;
                        })
                    )
                )
            );
        } else {
            return of([]);
        }
    }

    findOne(Id: number): Observable<any> {
        return from(this.brandRepository.findOne({
            where: {Id},
            select: [
                'Id', 'Name', 'ThumnailImage', 'Slug', 'Status'
            ]
        }));
    }

    async delete(Id: number) {
        const brand = await this.brandRepository.findOne({ where: { Id } });
        if (!brand) {
            return false;
        }

        brand.Status = AppConstants.app.status.inactive; // deactivate instead of deleting
        await this.brandRepository.save(brand);

        return true;
    }
}
