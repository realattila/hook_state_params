export type AllowedTypeValue = boolean | number | string | null | undefined;
export type urlUpdateType = 'push' | 'replace';
export type Setting = {
  urlUpdateType: urlUpdateType;
  ignoreOtherParams: boolean;
};
export type CommonOption = {
  enableParams?: boolean;
};

export type UseSyncParamsWithState = <
  S extends {
    [key: string]:
      | AllowedTypeValue
      | (boolean | null | undefined)[]
      | (string | null | undefined)[]
      | (number | null | undefined)[];
  }
>(
  state: S,
  option: {
    [Property in keyof S]: CommonOption & {
      type:
        | 'number'
        | 'string'
        | 'boolean'
        | 'number-array'
        | 'string-array'
        | 'boolean-array';
      validValues?: S[Property] extends Array<any>
        ? S[Property]
        : S[Property][];
    };
  },
  setting?: Setting
) => [S, React.Dispatch<React.SetStateAction<S>>];
