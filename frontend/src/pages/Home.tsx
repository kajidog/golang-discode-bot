import { Breadcrumbs, Link, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
function App() {
  // const { botInfo } = useBot();
  // const navigate = useNavigate();

  // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  // const open = Boolean(anchorEl);
  // const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };
  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  // const shapeStyles = { bgcolor: 'primary.main', width: 60, height: 60 };
  // const shapeCircleStyles = { borderRadius: '50%' };
  // const circle = (
  //   <Box
  //     component="img"
  //     src={botInfo.avatarURL}
  //     sx={{ ...shapeStyles, ...shapeCircleStyles }}
  //   />
  // );

  // const card = (
  //   <React.Fragment>
  //     <CardContent>
  //       <Badge color="secondary" overlap="circular" badgeContent="43">
  //         {circle}
  //       </Badge>
  //       <Typography variant="h6" component="div"></Typography>
  //     </CardContent>

  //     <CardActions>
  //       <Button size="small" onClick={() => navigate('/bot/token')}>
  //         設定
  //       </Button>
  //       <Button onClick={() => navigate('/setting/user_dictionary')}>
  //         ユーザー辞書
  //       </Button>
  //       <Button
  //         id="basic-button"
  //         aria-controls={open ? 'basic-menu' : undefined}
  //         aria-haspopup="true"
  //         aria-expanded={open ? 'true' : undefined}
  //         onClick={handleClick}
  //       >
  //         GPTモデル
  //       </Button>
  //       <Menu
  //         id="basic-menu"
  //         anchorEl={anchorEl}
  //         open={open}
  //         onClose={handleClose}
  //         MenuListProps={{
  //           'aria-labelledby': 'basic-button',
  //         }}
  //       >
  //         <GptModelsMenu></GptModelsMenu>
  //       </Menu>
  //     </CardActions>
  //   </React.Fragment>
  // );

  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb">
        <div>/</div>
      </Breadcrumbs>
    </div>
  );
}

export default App;
