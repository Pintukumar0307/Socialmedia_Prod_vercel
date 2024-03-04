import { Avatar, Button, Dialog, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteMyProfile, getMyPosts, logoutUser } from "../../Actions/User";
import Loader from "../Loader/Loader";
import Post from "../Post/Post";
import User from "../User/User";
import "./Account.css";

const Account = () => {
  const dispatch = useDispatch();
  const alerT = useAlert();

  const { user, loading: userLoading } = useSelector((state) => state.user);
  const { loading, error, posts } = useSelector((state) => state.myPosts);
  const {
    error: likeError,
    message,
    loading: deleteLoading,
  } = useSelector((state) => state.like);

  const [followersToggle, setFollowersToggle] = useState(false);

  const [followingToggle, setFollowingToggle] = useState(false);
  
  const logoutHandler = () => {
    dispatch(logoutUser());
    alerT.success("Logged out successfully");
  };

  const deleteProfileHandler = async () => {
    alert("Your profile will be deleted....");
    await dispatch(deleteMyProfile());
    dispatch(logoutUser());
  };

  useEffect(() => {
    dispatch(getMyPosts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      alerT.error(error);
      dispatch({ type: "clearErrors" });
    }

    if (likeError) {
      alerT.error(likeError);
      dispatch({ type: "clearErrors" });
    }
    if (message) {
      alerT.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [alerT, error, message, likeError, dispatch]);

  return loading === true || userLoading === true ? (
    <Loader />
  ) : (
    <div className="account">
      <div className="account-top">
        <div className="account-top-main">

          <div className="avatar">
            <Avatar
              src={user.avatar.url}
              sx={{ height: "10vmax", width: "10vmax" }}
            />
          </div>

         
            <div className="foll">
              <div>
                <Typography variant="h6">{user.followers.length}</Typography>
                <button onClick={() => setFollowersToggle(!followersToggle)}>
                  <Typography>Followers</Typography>
                </button>
              </div>

              <div>
                <Typography variant="h6" >{user.following.length}</Typography>
                <button onClick={() => setFollowingToggle(!followingToggle)}>
                  <Typography>Following</Typography>
                </button>
              </div>

              <div>
                <Typography variant="h6"  >{user.posts.length}</Typography>
                <Typography>Posts</Typography>
              </div>
            </div>
         
        </div>



        <div className="account-top-name">
               <div className="account-name">
              <Typography variant="h5">{user.name}</Typography>
            </div>
        </div>




        <div className="account-top-other">
        <div className="account-top-other1">
        <Button variant="contained" onClick={logoutHandler}>
            Logout
          </Button>

          <Button variant="contained"><Link style={{textDecoration:"none",color:"black"}} to="/update/profile">Edit Profile</Link></Button>
        </div>
        <div className="account-top-other2">
        <Button variant="contained"><Link style={{textDecoration:"none",color:"black"}} to="/update/password">Change Password</Link></Button>
          {/* <Link to="/update/password">Change Password</Link> */}

          <Button
            variant="text"
            style={{ color: "red", margin: "2vmax" }}
            onClick={deleteProfileHandler}
            disabled={deleteLoading}>
            Delete My Profile
          </Button>
        </div>

         

          

          
          {/* <Link to="/update/password">Change Password</Link>

          <Button
            variant="text"
            style={{ color: "red", margin: "2vmax" }}
            onClick={deleteProfileHandler}
            disabled={deleteLoading}>
            Delete My Profile
          </Button> */}

          <Dialog
            open={followersToggle}
            onClose={() => setFollowersToggle(!followersToggle)}>
            <div className="DialogBox">
              <Typography variant="h4">Followers</Typography>

              {user && user.followers.length > 0 ? (
                user.followers.map((follower) => (
                  <User
                    key={follower._id}
                    userId={follower._id}
                    name={follower.name}
                    avatar={follower.avatar.url}
                  />
                ))
              ) : (
                <Typography style={{ margin: "2vmax" }}>
                  You have no followers
                </Typography>
              )}
            </div>
          </Dialog>

          <Dialog
            open={followingToggle}
            onClose={() => setFollowingToggle(!followingToggle)}>
            <div className="DialogBox">
              <Typography variant="h4">Following</Typography>

              {user && user.following.length > 0 ? (
                user.following.map((follow) => (
                  <User
                    key={follow._id}
                    userId={follow._id}
                    name={follow.name}
                    avatar={follow.avatar.url}
                  />
                ))
              ) : (
                <Typography style={{ margin: "2vmax" }}>
                  You're not following anyone
                </Typography>
              )}
            </div>
          </Dialog>
        </div>
      </div>

      <div className="account-post">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post._id}
              postId={post._id}
              caption={post.caption}
              postImage={post.image.url}
              likes={post.likes}
              comments={post.comments}
              ownerImage={post.owner.avatar.url}
              ownerName={post.owner.name}
              ownerId={post.owner._id}
              isAccount={true}
              isDelete={true}
            />
          ))
        ) : (
          <Typography variant="h6" style={{color:"white"}}>You have not made any post</Typography>
        )}
      </div>
    </div>
  );
};

export default Account;
