const useStyle = (theme) => ({
    appBar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    toolbar: {
        flexWrap: 'wrap',
        backgroundColor: '#03a9f4'
    },
    toolbarTitle: {
        color: 'white',
        flexGrow: 1,
        textDecoration:'none'
    },
    link: {
        color: 'white',
        margin: theme.spacing(1, 1.5),
    },
    heroContent: {
        padding: theme.spacing(8, 0, 6),
    },
    listInline: {
        display: 'flex',
        flexDirection: 'row',
        padding: 0,
        color: 'white',
    }
  });
  
  export default useStyle;
  
  
  
  
  