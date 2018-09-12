export default interface LoggerInterface {
  info: (arg1: any, arg2?: any, arg3?: any) => void;
  error: (arg: any, arg2?: any, arg3?: any) => void;
  warn: (arg: any, arg2?: any, arg3?: any) => void;
  debug: (arg: any, arg2?: any, arg3?: any) => void;
}
