import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { CategoryEntity } from '../../../products/models/category.entity';
import { CategoryI } from '../../../products/models/category.interface';
import { CreateCategoryDto, UpdateCategoryDto } from '../../../products/models/dto/category.dto';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(CategoryEntity)
        private categoryRepository: Repository<CategoryEntity>,
    ) {}

    create(createdCategoryDto: CreateCategoryDto) {
        return from(this.categoryRepository.save(createdCategoryDto)).pipe(
            map((savedCategory: CategoryI) => {
                const { ...category } = savedCategory;
                return category;
            })
        )
    }

    getAllCategories() {
        return from(this.categoryRepository.find());
    }

    async update(updatedCategoryDto: UpdateCategoryDto): Promise<Observable<any>> {
        const Id = updatedCategoryDto.Id;
        const category = await this.categoryRepository.findOne({ where: { Id: Id } });
        if (category) {
            return from(this.categoryRepository.upsert(updatedCategoryDto, ['Id'])).pipe(
                switchMap(() =>
                    from(this.categoryRepository.findOne({ where: { Id } })).pipe(
                        map((updatedBrand) => {
                            if (!updatedBrand) {
                                throw new Error('Brand update failed');
                            }
                            return updatedBrand as CategoryI;
                        })
                    )
                )
            );
        } else {
            return of([]);
        }
    }

    findOne(Id: number): Observable<any> {
        return from(this.categoryRepository.findOne({
            where: {Id},
            select: [
                'Id', 'Name', 'ThumnailImage', 'Slug', 'Status'
            ]
        }));
    }

    async delete(Id: number) {
        const category = await this.categoryRepository.findOne({ where: { Id } });
        if (category) {
           await this.categoryRepository.remove(category);
           return true;
        }
    }

}
