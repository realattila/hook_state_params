// MAIN
import React from 'react';

// HOOKS
import { useSearchParams } from './useSearchParams';

// HELPERS
import {
  convertNullUndefinedStringToValue,
  findCurrentParamInValidParams,
} from './helpers';

// TYPES
import type { UseSyncParamsWithState } from './types';

const useSyncParamsWithState: UseSyncParamsWithState = (state, option) => {
  const { getAll, setAll: setSearch } = useSearchParams();
  const searchAsObject = getAll();

  const initState = React.useCallback(
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
            const foundValue = findCurrentParamInValidParams(
              option[key]?.validParams || [],
              paramValue
            );

            // value found
            if (foundValue != undefined) {
              const indexOfValue = option[key]?.validParams
                ?.map((item) => String(item))
                .indexOf(foundValue);

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

  const [hookState, setHookState] = React.useState(initState(state));

  const ParamAbleStateObject = React.useCallback(
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
  const hookStateRef = React.useRef(hookState);

  const searchAsObjectRef = React.useRef(searchAsObject);

  React.useEffect(() => {
    if (
      Object.entries(searchAsObject).toString() !=
      Object.entries(hookState).toString()
    ) {
      const ParamAbleState = ParamAbleStateObject(hookState);
      setSearch({ ...searchAsObject, ...ParamAbleState });
    }
  }, []);

  React.useEffect(() => {
    let isSubscribed = true;

    // params has changed
    if (
      Object.entries(searchAsObject).toString() !=
      Object.entries(searchAsObjectRef.current).toString()
    ) {
      if (isSubscribed) {
        // generate new state
        const newState = initState(hookState);

        // generate params able state
        const ParamAbleState = ParamAbleStateObject(newState);

        // generate new searchParams
        const newSearchParams = { ...searchAsObject, ...ParamAbleState };

        setSearch(newSearchParams);
        searchAsObjectRef.current = newSearchParams;

        setHookState(newState);
        hookStateRef.current = newState;
      }
    }

    // if state has changed
    if (
      Object.entries(hookState).toString() !=
      Object.entries(hookStateRef.current).toString()
    ) {
      // generate params able state
      const ParamAbleState = ParamAbleStateObject(hookState);

      // generate new searchParams
      const newSearchParams = { ...searchAsObject, ...ParamAbleState };
      setSearch(newSearchParams);
      searchAsObjectRef.current = newSearchParams;

      hookStateRef.current = hookState;
    }

    return () => {
      isSubscribed = false;
    };
  }, [searchAsObject, hookState, initState, setSearch, ParamAbleStateObject]);

  return [hookState, setHookState];
};

export default useSyncParamsWithState;
