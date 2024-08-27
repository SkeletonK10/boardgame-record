import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // TODO: 회원가입 시 아이디/비밀번호 검증

    const existingUser = await this.findOneByUsername(createUserDto.username);
    if (existingUser) throw new Error(`USER_ALREADY_EXISTS`);
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
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

  async update(username: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOneByUsername(username);
    let raw_pw = updateUserDto.password;
    if (raw_pw) updateUserDto.password = await bcrypt.hash(raw_pw, 10);
    const updatedUser = {
      ...user,
      ...updateUserDto,
    };
    const result = await this.userRepository.save(updatedUser);
    return result;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
