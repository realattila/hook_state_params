// MAIN
import React, { useCallback, useEffect, useRef, useState } from 'react';

// HOOKS
import { useSearchParams } from 'react-router-dom';

const useCustomSearchParams = () => {
  const [search, setSearch] = useSearchParams();
  const searchAsObject = Object.fromEntries(new URLSearchParams(search));

  return { searchAsObject, setSearch };
};

type TAllowedTypeValue = boolean | number | string | null | undefined;
type TUseSyncParamsWithState = <
  S extends {
    [key: string]: TAllowedTypeValue;
  }
>(
  state: S,
  option: {
    [Property in keyof S]: {
      type: 'number' | 'string' | 'boolean';
      enableParams?: boolean;
      validParams?: Array<TAllowedTypeValue>;
    };
  }
) => [S, React.Dispatch<React.SetStateAction<S>>];

const findCurrenParamInValidParams = (
  validParams: Array<TAllowedTypeValue>,
  currentParams: string
) => {
  return validParams
    .map((item) => String(item))
    .find((item) => item === currentParams);
};

const convertNullUndefinedStringToValue = (value: string) => {
  if (value === 'undefined') {
    return undefined;
  } else if (value === 'null') {
    return null;
  } else {
    return value;
  }
};

const useSyncParamsWithState: TUseSyncParamsWithState = (state, option) => {
  const { searchAsObject, setSearch } = useCustomSearchParams();

  const initState = useCallback(
    (passedState: typeof state) => {
      let tempState: any = {};
      // mapping state
      Object.entries(passedState).forEach((itemState) => {
        const [key, value] = itemState;

        // if params ins enabled for this key
        if (option[key].enableParams) {
          // if param is undefined
          if (searchAsObject[key] === 'undefined') {
            // use default value
            tempState = { ...tempState, [key]: value };
          }

          // validParams Passed by user
          else if (option[key]?.validParams?.length) {
            // just make sure params in string
            const paramValue = String(searchAsObject[key]);

            // find
            const findedValue = findCurrenParamInValidParams(
              option[key]?.validParams || [],
              paramValue
            );

            // value found
            if (findedValue != undefined) {
              const indexOfValue = option[key]?.validParams
                ?.map((item) => String(item))
                .indexOf(findedValue);

              // value index found is not undefined
              if (indexOfValue != undefined) {
                // value index found is not -1
                if (indexOfValue != -1) {
                  const foundedValue = (option[key]?.validParams || [])[
                    indexOfValue
                  ];

                  // set founded value
                  tempState = { ...tempState, [key]: foundedValue };
                }

                // value index found is -1
                else {
                  // use default value
                  tempState = { ...tempState, [key]: value };
                }
              }

              // value index is undefined
              else {
                // use default value
                tempState = { ...tempState, [key]: value };
              }
            }

            // value not found
            else {
              // use default value
              tempState = { ...tempState, [key]: value };
            }
          }

          // if valid params not passed by user
          else {
            // just make sure params in string
            const paramValue = String(searchAsObject[key]);

            // state key type in boolean
            if (option[key].type === 'boolean') {
              let booleanParamValue = value;

              // we do not have valid params we need to generate value
              if (
                paramValue === 'false' ||
                paramValue === 'False' ||
                paramValue === 'FALSE'
              ) {
                booleanParamValue = false;
              }
              tempState = { ...tempState, [key]: Boolean(booleanParamValue) };
            }

            // state key type is string
            else if (option[key].type === 'string') {
              // for key SearchValue is not exist
              if (!searchAsObject[key]) {
                // pass default value
                tempState = { ...tempState, [key]: value };
              } else {
                const pureValue = convertNullUndefinedStringToValue(paramValue);
                tempState = { ...tempState, [key]: pureValue };
              }
            }

            // state key type is number
            else if (option[key].type === 'number') {
              // pure value for number understand
              const pureValue = (function () {
                // for key SearchValue is not exist
                if (!searchAsObject[key]) {
                  // pass default value

                  return value;
                }
                // SearchValue is Exist
                else {
                  const convertedValue =
                    convertNullUndefinedStringToValue(paramValue);

                  // if convertedValue is not string
                  if (typeof convertedValue != 'string') {
                    return convertedValue;
                  } else {
                    // check if return value is NaN
                    if (Number.isNaN(Number(convertedValue))) {
                      return undefined;
                    } else {
                      // converted value is number
                      return Number(convertedValue);
                    }
                  }
                }
              })();
              tempState = { ...tempState, [key]: pureValue };
            }

            // state key type is never
            else {
              // use default value
              tempState = { ...tempState, [key]: paramValue };
            }
          }
        }

        // if user not enabled params
        else {
          // use default value

          tempState = { ...tempState, [key]: value };
        }
      });

      return tempState;
    },
    [option, searchAsObject]
  );

  const [hookState, setHookState] = useState(initState(state));

  const ParamAbleStateObject = useCallback(
    (passedState: typeof state): typeof state => {
      let temp: any = {};

      Object.entries(passedState).forEach((item) => {
        const [key, value] = item;
        if (option[key].enableParams) {
          temp = { ...temp, [key]: String(value) };
        }
      });

      return temp;
    },
    [option]
  );
  const hookStateRef = useRef(hookState);

  const searchAsObjectRef = useRef(searchAsObject);

  useEffect(() => {
    if (
      Object.entries(searchAsObject).toString() !=
      Object.entries(hookState).toString()
    ) {
      const ParamAbleState = ParamAbleStateObject(hookState);
      setSearch({ ...searchAsObject, ...ParamAbleState }, { replace: true });
    }
  }, []);

  useEffect(() => {
    let isubScribed = true;

    // parms has changed
    if (
      Object.entries(searchAsObject).toString() !=
      Object.entries(searchAsObjectRef.current).toString()
    ) {
      if (isubScribed) {
        // generate new state
        const newState = initState(hookState);

        // generate params able state
        const ParamAbleState = ParamAbleStateObject(newState);

        // generate new searchParams
        const newSearchParams = { ...searchAsObject, ...ParamAbleState };

        setSearch(newSearchParams, { replace: true });
        searchAsObjectRef.current = newSearchParams;

        setHookState(newState);
        hookStateRef.current = newState;
      }
    }

    // if state has chaned
    if (
      Object.entries(hookState).toString() !=
      Object.entries(hookStateRef.current).toString()
    ) {
      // generate params able state
      const ParamAbleState = ParamAbleStateObject(hookState);

      // generate new searchParams
      const newSearchParams = { ...searchAsObject, ...ParamAbleState };
      setSearch(newSearchParams, { replace: true });
      searchAsObjectRef.current = newSearchParams;

      hookStateRef.current = hookState;
    }

    return () => {
      isubScribed = false;
    };
  }, [searchAsObject, hookState, initState, setSearch, ParamAbleStateObject]);

  return [hookState, setHookState];
};

export default useSyncParamsWithState;
