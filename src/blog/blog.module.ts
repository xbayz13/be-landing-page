import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorsController } from './authors.controller';
import { AuthorsService } from './authors.service';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Author } from './entities/author.entity';
import { Category } from './entities/category.entity';
import { Post } from './entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Author, Category, Post])],
  controllers: [AuthorsController, CategoriesController, PostsController],
  providers: [AuthorsService, CategoriesService, PostsService],
  exports: [AuthorsService, CategoriesService, PostsService],
})
export class BlogModule {}
