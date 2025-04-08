import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { BrandEntity } from '../../../products/models/brand.entity';
import { BrandI } from '../../../products/models/brand.interface';
import { CreateBrandDto, UpdateBrandDto } from '../../../products/models/dto/brand.dto';
import { Repository } from 'typeorm';

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

    getAllBrands() {
        return from(this.brandRepository.find());
    }

    async update(updatedBrandDto: UpdateBrandDto): Promise<Observable<any>> {
        const Id = updatedBrandDto.Id;
        const brand = await this.brandRepository.findOne({ where: { Id } });

        if (brand) {
            return from(this.brandRepository.upsert(updatedBrandDto, ['Id'])).pipe(
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
        if (brand) {
            await this.brandRepository.remove(brand);
            return true;
        }
    }
}
