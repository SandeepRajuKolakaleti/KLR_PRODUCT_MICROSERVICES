import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from '../../../products/models/dto/sub-category.dto';
import { SubCategoryEntity } from '../../../products/models/sub-category.entity';
import { SubCategoryI } from '../../../products/models/sub-category.interface';
import { Repository } from 'typeorm';

@Injectable()
export class SubCategoriesService {
    constructor(
        @InjectRepository(SubCategoryEntity)
        private subcategoryRepository: Repository<SubCategoryEntity>,
    ) {}

    create(createdSubCategoryDto: CreateSubCategoryDto) {
        return from(this.subcategoryRepository.save(createdSubCategoryDto)).pipe(
            map((savedSubCategory: SubCategoryI) => {
                const { ...subCategory } = savedSubCategory;
                return subCategory;
            })
        )
    }

    getAllSubCategories() {
        return from(this.subcategoryRepository.find());
    }

    async update(updatedSubCategoryDto: UpdateSubCategoryDto): Promise<Observable<any>> {
        const Id = updatedSubCategoryDto.Id;
        const subCategory = await this.subcategoryRepository.findOne({ where: { Id } });
        if (subCategory) {
            return from(this.subcategoryRepository.upsert(updatedSubCategoryDto, ['Id'])).pipe(
                switchMap(() =>
                    from(this.subcategoryRepository.findOne({ where: { Id } })).pipe(
                        map((updatedSubCategory) => {
                            if (!updatedSubCategory) {
                                throw new Error('sub category update failed');
                            }
                            return updatedSubCategory as SubCategoryI;
                        })
                    )
                )
            );
        } else {
            return of([]);
        }
    }

    findOne(Id: number): Observable<any> {
        return from(this.subcategoryRepository.find({
            where: { Id },
            select: [
                'Id', 'Name', 'ThumnailImage', 'Category', 'Slug', 'Status'
            ]
        }));
    }

    findOneByCategory(Id: number): Observable<any> {
       return from(this.subcategoryRepository.find({
            where: { Category: Id.toString() },
            select: [
                'Id', 'Name', 'ThumnailImage', 'Category', 'Slug', 'Status'
            ]
        }));
    }

    async delete(Id: number) {
        const subCategory = await this.subcategoryRepository.findOne({ where: { Id } });
        if (subCategory) {
            await this.subcategoryRepository.remove(subCategory);
            return true;
        }
    }
}
