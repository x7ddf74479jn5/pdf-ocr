// declare module "*.svg" {
//   /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
//   const content: any;
//   export default content;
// }
declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
}
