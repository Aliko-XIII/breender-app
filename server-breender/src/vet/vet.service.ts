import { Injectable } from '@nestjs/common';
import { CreateVetDto } from './dto/create-vet.dto';
import { UpdateVetDto } from './dto/update-vet.dto';

@Injectable()
export class VetService {
  create(createVetDto: CreateVetDto) {
    return 'This action adds a new vet';
  }

  findAll() {
    return `This action returns all vet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vet`;
  }

  update(id: number, updateVetDto: UpdateVetDto) {
    return `This action updates a #${id} vet`;
  }

  remove(id: number) {
    return `This action removes a #${id} vet`;
  }
}
