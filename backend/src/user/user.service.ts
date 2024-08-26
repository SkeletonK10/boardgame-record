import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findOneByUsername(createUserDto.username);
    if (existingUser) throw new Error(`USER_ALREADY_EXISTS`);
    const userEntity = await this.userRepository.create(createUserDto);
    return await this.userRepository.save(userEntity);
  }

  async findAll() {
    const result = await this.userRepository.find({
      select: {
        id: true,
        username: true,
        nickname: true,
      },
    });
    return result;
  }

  async findOneByUsername(username: string) {
    const result = await this.userRepository.findOne({
      where: {
        username,
      },
    });
    return result;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
