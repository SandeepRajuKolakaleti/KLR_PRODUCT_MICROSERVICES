import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { ChildCategoryEntity } from '../../../products/models/child-category.entity';
import { ChildCategoryI } from '../../../products/models/child-category.interface';
import { CreateChildCategoryDto, UpdateChildCategoryDto } from '../../../products/models/dto/child-category.dto';
import { Repository } from 'typeorm';

@Injectable()
export class ChildCategoriesService {
    constructor(
        @InjectRepository(ChildCategoryEntity)
        private childCategoryRepository: Repository<ChildCategoryEntity>,
    ) {}

    create(createdSubCategoryDto: CreateChildCategoryDto) {
        return from(this.childCategoryRepository.save(createdSubCategoryDto)).pipe(
            map((savedSubCategory: ChildCategoryI) => {
                const { ...subCategory } = savedSubCategory;
                return subCategory;
            })
        )
    }

    getAllChildCategories() {
        return from(this.childCategoryRepository.find());
    }

    async update(updatedChildCategoryDto: UpdateChildCategoryDto): Promise<Observable<any>> {
        const Id = updatedChildCategoryDto.Id;
        const childCategory = await this.childCategoryRepository.findOne({ where: { Id } });
        if (childCategory) {
            return from(this.childCategoryRepository.upsert(updatedChildCategoryDto, ['Id'])).pipe(
                switchMap(() =>
                    from(this.childCategoryRepository.findOne({ where: { Id } })).pipe(
                        map((updatedChildCategory) => {
                            if (!updatedChildCategory) {
                                throw new Error('Brand update failed');
                            }
                            return updatedChildCategory as ChildCategoryI;
                        })
                    )
                )
            );
        } else {
            return of([]);
        }
    }

    findOne(Id: number): Observable<any> {
        return from(this.childCategoryRepository.findOne({
            where: {Id},
            select: [
                'Id', 'Name', 'ThumnailImage', 'Category', 'SubCategory', 'Slug', 'Status'
            ]
        }));
    }

    async delete(Id: number) {
        const childCategory = await this.childCategoryRepository.findOne({ where: { Id } });
        if (childCategory) {
            await this.childCategoryRepository.remove(childCategory);
            return true;
        }
    }
}
