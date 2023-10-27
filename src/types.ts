export type AllowedTypeValue = boolean | number | string | null | undefined;
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
  }
) => [S, React.Dispatch<React.SetStateAction<S>>];
