declare const Eventbus: {
  sub: (key: string, target: any, callback: Function) => void;
  pub: (key: string, data: any) => void;
  cancel: (key: string, target: any) => void;
};

export default Eventbus;
