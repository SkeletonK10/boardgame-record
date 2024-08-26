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
    const userEntity = await this.userRepository.create(createUserDto);
    await this.userRepository.save(userEntity);
    return {
      code: 'OK',
      msg: 'User has been succesfully created',
    };
  }

  async findAll() {
    const result = await this.userRepository.find({
      select: {
        id: true,
        username: true,
        nickname: true,
      },
    });
    return {
      code: 'OK',
      msg: 'All users has been found',
      data: result,
    };
  }

  async findOneById(id: number) {
    const result = await this.userRepository.findOne({
      where: {
        id,
      },
      select: {
        id: true,
        username: true,
        nickname: true,
      },
    });
    return {
      code: 'OK',
      msg: result ? `User #${id} has been found` : `User #${id} does not exist`,
      data: result,
    };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
