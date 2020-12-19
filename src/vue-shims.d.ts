declare var require : (filename,resolve)=>any;
declare function define(...args: any[]): any;
declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}
