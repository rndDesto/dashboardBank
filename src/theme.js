import { createMuiTheme } from '@material-ui/core/styles';
import { indigo, orange, lightBlue, grey } from '@material-ui/core/colors';

// Configure Material UI theme
const theme = createMuiTheme({
  palette: {
    primary: lightBlue,
    accent: grey,
    type: 'light',
  },
});

export default theme;