# Custom hook state params

use params with synced state, you can easily create state and store it even user refresh page or share page with other users. it could be useful for filters and sort in your application.

#### Notice

this package require react >=16.8

## Usage/Examples

```javascript
import useSyncParamsWithState from 'hook_state_params';

function App() {
  const [hookState, setHookState] = useSyncParamsWithState(
    { name: 'apple', id: 2 },
    {
      id: {
        type: 'number',
        enableParams: true,
        validParams: [1, 2, 3, 5, 6, 7, 8],
      },
      name: { type: 'string', enableParams: true },
    }
  );

  return <Component />;
}
```

## Contributing

Contributions are always welcome!

clone project and create pull request.

Please adhere to this project's `code of conduct`.

## Feedback

If you have any feedback, please reach out to us at realattila2@pm.me

## CheckList

- [x] Move to rollup for bundle
- [x] Remove react-router dependency
- [ ] Improve base code
- [ ] Add optional undefined and null
- [ ] Add more dataType support
