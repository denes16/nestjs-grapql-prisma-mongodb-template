import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export abstract class BasePaginatedResponseModel<T> {
  @Field(() => Int)
  readonly totalRecords: number;

  @Field(() => Int)
  readonly currentPage: number;

  @Field(() => Int)
  readonly totalPages: number;

  @Field(() => Int)
  readonly pageSize: number;

  items: T[];

  constructor({
    totalRecords,
    skip,
    limit,
    items,
  }: {
    totalRecords: number;
    skip?: number;
    limit?: number;
    items: T[];
  }) {
    this.totalRecords = totalRecords;
    this.currentPage = limit ? skip / limit : 1;
    this.pageSize = limit || 1_000;
    this.totalPages = Math.ceil(totalRecords / this.pageSize);
    this.items = items;
  }
}
