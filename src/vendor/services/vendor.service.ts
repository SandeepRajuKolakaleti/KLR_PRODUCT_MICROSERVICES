import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateVendorDto, UpdateVendorDto } from '../models/dto/create-vendor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { VendorI } from '../models/vendor.interface';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { UserPermissionEntity } from '../models/user.permission.entity';
import { LoginUserDto } from '../models/dto/LoginUser.dto';
import { UserEntity } from '../models/vendor.entity';
import { ProductEntity } from 'src/products/models/product.entity';
import { AppConstants } from 'src/app.constants';
@Injectable()
export class VendorService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(UserPermissionEntity)
        private userPermissionRepository: Repository<UserPermissionEntity>,
        @InjectRepository(ProductEntity)
        private productRepository: Repository<ProductEntity>,
        private authService: AuthService
    ) { }

    create(createUserDto: CreateVendorDto): Observable<any> {
        return this.PermissionExists(createUserDto.userRole.toString()).pipe(switchMap((permissionId: number) => {
            return this.mailExists(createUserDto.email).pipe(
                switchMap((exists: boolean) => {
                    if (!exists) {
                        return this.authService.hashPassword(createUserDto.password).pipe(
                            switchMap((passwordHash: string) => {
                                // Overwrite the user password with the hash, to store it in the db
                                createUserDto.password = passwordHash;
                                createUserDto.permissionId = permissionId;
                                const user = this.userRepository.create({
                                    ...createUserDto,
                                    permissionId,
                                    password: passwordHash
                                });

                                return from(this.userRepository.save(user)).pipe(
                                    map((savedUser) => {
                                        const { password, ...user } = savedUser;
                                        return user;
                                    })
                                );
                            })
                        )
                    } else {
                        throw new HttpException('Email already in use', HttpStatus.CONFLICT);
                    }
                })
            )
        }
        ))
    }

    resetPassword(resetPassword: LoginUserDto): Observable<VendorI> {
        return this.findUserByEmail(resetPassword.email).pipe(
            switchMap((user: any) => {
                if (user) {
                    resetPassword.permissionId = user.permissionId;
                    resetPassword.id = user.id;
                    resetPassword.name = user.name;
                    return this.authService.hashPassword(resetPassword.password).pipe(
                        switchMap((passwordHash: string) => {
                            // Overwrite the user password with the hash, to store it in the db
                            resetPassword.password = passwordHash;
                            return from(this.userRepository.update(user, {...resetPassword})).pipe(
                                map((updatedUser: any) => {
                                    const { password, ...user } = updatedUser;
                                    return user;
                                })
                            )
                        })
                    )
                }
                return of(user);
            }),
        )     
    }

    findAll(): Observable<VendorI[]> {
        return from(this.userRepository.find({
            where: {userRole: AppConstants.app.userType.vendor, status: AppConstants.app.status.active},
            select: ['id', 'email', 'name', 'password', 'phonenumber', 'image', 'permissionId', 'address', 'birthday', 'userRole', 'revenue', 'totalSales', 'status'],
        }));
    }

    findOne(id: number): Observable<any> {
        return from(this.userRepository.findOne({
            where: {userRole: AppConstants.app.userType.vendor, id},
            select: ['id', 'email', 'name', 'password', 'phonenumber', 'image', 'permissionId', 'address', 'birthday', 'userRole', 'revenue', 'totalSales', 'status'],
        }));
    }

    findUserByEmail(email: string): Observable<any> {
        return from(this.userRepository.findOne({
            where: { email },
            select: ['id', 'email', 'name', 'password', 'phonenumber', 'image', 'permissionId', 'address', 'birthday', 'userRole', 'revenue', 'totalSales', 'status'], 
        }));
    }

    async deleteUser(id: number) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            return false;
        }

        user.status = AppConstants.app.status.inactive; // deactivate user instead of deleting
        await this.userRepository.save(user);

        return true;
    }

    private validatePassword(password: string, storedPasswordHash: string): Observable<boolean> {
        return this.authService.comparePasswords(password, storedPasswordHash);
    }

    private mailExists(email: string): Observable<boolean> {
        return from(this.userRepository.findOne({ where: {email} })).pipe(
            map((user: any) => {
                if (user) {
                    return true;
                } else {
                    return false;
                }
            })
        )
    }


    private PermissionExists(permissionName: string): Observable<number> {
        return from(this.userPermissionRepository.findOne({ 
            where: { permissionName},
            select: ['permissionId', 'permissionName', 'permissionDescription']
        })).pipe(
            map((userPermission: any) => {
                if (userPermission) {
                    return userPermission.permissionId;
                }
                else {
                    return 1;
                }
            })
        )
    }

    getProductsByVendor(Id: number): Observable<any> {
        return from(this.productRepository.find({
            where: {Vendor: Id.toString()},
            select: [
                'Id', 'Name', 'ThumnailImage', 'Category', 'SubCategory', 'Brand', 'SKU', 'Slug', 'Price', 'OfferPrice', 'StockQuantity', 
                'Weight', 'ShortDescription', 'LongDescription', 'Status', 'SEOTitle', 'SEODescription', 'Specifications', 'Highlight', 'Vendor'
            ]
        }));
    }

    update(id: number, dto: UpdateVendorDto): Observable<any> {
        return from(this.userRepository.findOne({ where: { id } })).pipe(
            switchMap((existingUser) => {
                if (!existingUser) {
                    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
                }

                // Update allowed fields
                existingUser.name = dto.name ?? existingUser.name;
                existingUser.email = dto.email?.toLowerCase() ?? existingUser.email;
                existingUser.userRole = dto.userRole ?? existingUser.userRole;
                existingUser.permissionId = dto.permissionId ?? existingUser.permissionId;
                existingUser.phonenumber = dto.phonenumber ?? existingUser.phonenumber;
                existingUser.image = dto.image ?? existingUser.image;
                existingUser.address = dto.address ?? existingUser.address;
                existingUser.birthday = dto.birthday ?? existingUser.birthday;
                existingUser.revenue = dto.revenue ?? existingUser.revenue;
                existingUser.totalSales = dto.totalSales ?? existingUser.totalSales;

                const passwordUpdated = dto.password && dto.password !== existingUser.password;

                // If password updated → hash it and save
                if (passwordUpdated) {
                    let existingUserPassword = existingUser.password? existingUser.password : '';
                    return this.validatePassword(dto.password, existingUserPassword).pipe(
                        switchMap(passwordMatched => {
                            if (!passwordMatched) {
                                return this.authService.hashPassword(dto.password).pipe(
                                    switchMap((hashed) => {
                                        existingUser.password = hashed;
                                        return from(this.userRepository.save(existingUser)).pipe(
                                            map((updatedUser: any) => {
                                                const { password, ...user } = updatedUser;
                                                return user;
                                            })
                                        );
                                    })
                                );
                            }
                            // Password matched (no change needed), just save
                            return from(this.userRepository.save(existingUser)).pipe(
                                map((savedUser: any) => {
                                    const { password, ...user } = savedUser;
                                    return user;
                                })
                            );
                        })
                    );
                }

                // Password not updated
                return from(this.userRepository.save(existingUser)).pipe(
                    map((savedUser) => {
                        const { password, ...safeUser } = savedUser;
                        return safeUser;
                    })
                );
            })
        );
    }
}
