# Custom hook state params

use params with synced state, you can easily create state and store it even user refresh page or share page with other users. it could be usefull for filters and sort in your application.

#### notice

this package require react>=16 and react-router-dom>=6

## Usage/Examples

```javascript
import useHookStateParams from 'hook_state_params';

function App() {
  const [hookState, setHookState] = useHookStateParams(
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
