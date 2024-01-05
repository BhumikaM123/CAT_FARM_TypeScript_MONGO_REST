// cats.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cat } from './interfaces/cat.interface';

@Injectable()
export class CatsService {
    constructor(@InjectModel('Cat') private readonly catModel: Model<Cat>) { }

    async findAll(): Promise<Cat[]> {
        return this.catModel.find().exec();
    }

    async findOne(id: string): Promise<Cat> {
        const cat = await this.catModel.findById(id).exec();
        if (!cat) {
            throw new NotFoundException("Not found");
        }
        return cat;
    }

    async create(cat: Cat): Promise<Cat> {
        const createdCat = new this.catModel(cat);
        return createdCat.save();
    }

    async update(id: string, cat: Cat): Promise<Cat> {
        const updatedCat = await this.catModel.findByIdAndUpdate(id, cat, { new: true }).exec();
        if (!updatedCat) {
            throw new NotFoundException("not found");
        }
        return updatedCat;
    }

    async delete(id: string): Promise<Cat> {
        const catToDelete = await this.catModel.findById(id).exec();

        if (!catToDelete) {
            throw new NotFoundException("Cat not found");
        }

        const deletionResult = await this.catModel.deleteOne({ _id: id }).exec();

        if (deletionResult.deletedCount === 0) {
            throw new NotFoundException("Deletion failed");
        }

        return catToDelete;
    }

}