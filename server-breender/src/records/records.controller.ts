import { Controller, Delete, Get, Patch, Post, UseGuards, Request, Body, Param, Query } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateRecordDto } from './dto/createRecord.dto';
import { RecordsService } from './records.service';
import { UpdateRecordDto } from './dto/updateRecord.dto';
import { FilterRecordDto } from './dto/filterRecord.dto';

@UseGuards(AuthGuard)
@Controller('records')
export class RecordsController {
    constructor(private readonly recordsService: RecordsService) { }

    @Post()
    create(@Request() req, @Body() createRecordDto: CreateRecordDto) {
        const authUserId = req.authUserId;
        return this.recordsService.createRecord(createRecordDto, authUserId);
    }

    @Get('/user/:id')
    findByUser(@Request() req, @Param('id') id: string) {
        const authUserId = req.authUserId;
        return this.recordsService.findAllRecordsByUserId(id, authUserId);
    }

    @Get('/animal/:id')
    findByAnimal(@Request() req, @Param('id') id: string) {
        const authUserId = req.authUserId;
        return this.recordsService.findAllRecordsByAnimalId(id, authUserId);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        const authUserId = req.authUserId;
        return this.recordsService.findRecordById(id, authUserId);
    }

    @Get()
    getRecords(@Request() req, @Query() filter: FilterRecordDto) {
        const authUserId = req.authUserId;
        return this.recordsService.getRecords(filter, authUserId);
    }

    @Patch(':id')
    update(@Request() req, @Param('id') id: string, @Body() updateAnimalDto: UpdateRecordDto) {
        const authUserId = req.authUserId;
        return this.recordsService.updateRecord(id, updateAnimalDto, authUserId);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        const authUserId = req.authUserId;
        return this.recordsService.removeRecord(id, authUserId);
    }

}
