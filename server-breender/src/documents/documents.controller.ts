import { Controller, Post, UseInterceptors, Request, UploadedFile, Body } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadDocumentDto } from './dto/createDocument.dto';

@Controller('documents')
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }
    
      /**
       * POST /photos
       * Creates a new photo.
       * The user ID is taken from the authenticated user's context (req.authUserId).
       */
      @Post()
      @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads/photos',
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
          },
        }),
      }))
      async uploadPhoto(
        @Request() req,
        @UploadedFile() file: Express.Multer.File,
        @Body() uploadDocumentDto: UploadDocumentDto,
      ) {
        const authUserId = req.authUserId;
        const fileUrl = `/uploads/documents/${file.filename}`;
        return this.documentsService.createDocument(
          { ...uploadDocumentDto, url: fileUrl },
          authUserId
        );
      }
}
