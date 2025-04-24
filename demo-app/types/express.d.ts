declare namespace Express {
  export interface Locals {
    naturalLanguageQuery?: string;
    databaseQuery?: string;
    databaseQueryResult?: string | Record<'columns' | 'rows', unknown[]>;
  }
}
