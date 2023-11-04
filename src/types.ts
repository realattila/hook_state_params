export type AllowedTypeValue = boolean | number | string | null | undefined;
export type urlUpdateType = 'push' | 'replace';
export type Setting = {
  urlUpdateType: urlUpdateType;
};
export type UseSyncParamsWithState = <
  S extends {
    [key: string]: AllowedTypeValue;
  }
>(
  state: S,
  option: {
    [Property in keyof S]: {
      type: 'number' | 'string' | 'boolean';
      enableParams?: boolean;
      validParams?: Array<AllowedTypeValue>;
    };
  },
  setting?: Setting
) => [S, React.Dispatch<React.SetStateAction<S>>];
