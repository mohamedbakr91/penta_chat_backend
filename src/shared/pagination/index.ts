export interface IPagination {
  thisPage?: number;
  limit?: number;
  allPages?: number;
  nextPage?: number;
  count?: number;
}

export class Pagination {
  private page;

  private limit;

  constructor(page = 1, limit = 50) {
    this.page = parseInt(String(page));
    this.limit = parseInt(String(limit));

    if (this.limit > 50) {
      this.limit = 50;
    }
  }

  getOffset() {
    return 0 + (this.page - 1) * this.limit;
  }

  getNumOfPages(count: number) {
    return Math.ceil(count / this.limit);
  }

  getLimit() {
    return this.limit;
  }

  getMetaData(count: number | null) {
    let thisPage = this.page;
    let nextPage = thisPage + 1;
    if (count === null)
      return {
        thisPage,
        nextPage,
        limit: this.getLimit(),
      };
    return {
      thisPage,
      limit: this.limit,
      allPages: parseInt(String(this.getNumOfPages(count))),
      nextPage,
      count: count,
    };
  }
}
