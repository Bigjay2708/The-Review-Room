declare module 'mongoose' {
  interface Model<T> {
    find(filter?: any, projection?: any, options?: any): any;
    findOne(filter?: any, projection?: any, options?: any): any;
    findById(id: any, projection?: any, options?: any): any;
    findByIdAndUpdate(id: any, update?: any, options?: any): any;
    findByIdAndDelete(id: any, options?: any): any;
    findOneAndUpdate(filter?: any, update?: any, options?: any): any;
    findOneAndDelete(filter?: any, options?: any): any;
  }
}
