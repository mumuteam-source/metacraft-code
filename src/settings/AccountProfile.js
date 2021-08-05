import moment from 'moment';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  withStyles
} from '@material-ui/core';

const user = {
  avatar: `${process.env.PUBLIC_URL}/headman.png`,
  city: 'Los Angeles',
  country: 'USA',
  jobTitle: 'Senior Developer',
  name: 'Katarina Smith',
  timezone: 'GTM-7'
};

const styles = (theme) => ({

  avatar: {
    height: 100,
    width: 100
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent:'center',
  },
});
function AccountProfile(props) {
  const {
    classes,
  } = props;
  return (
    <Card {...props}>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Avatar className={classes.avatar}
            src={user.avatar}
            // sx={{
            //   height: 100,
            //   width: 100
            // }}
          />
          <Typography
            color="textPrimary"
            gutterBottom
            variant="h3"
          >
            {user.name}
          </Typography>
          {/* <Typography
            color="textSecondary"
            variant="body1"
          >
            {`${user.city} ${user.country}`}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body1"
          >
            {`${moment().format('hh:mm A')} ${user.timezone}`}
          </Typography> */}
        </Box>
      </CardContent>
      <Divider />
      <CardActions className={classes.actions}>
        <Button
          color="primary"
          //fullWidth
          variant="contained"
        >
          Upload picture
        </Button>
      </CardActions>
    </Card>
  );
}

export default withStyles(styles)(AccountProfile);
