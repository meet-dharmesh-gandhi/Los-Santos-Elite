let userName = "", userEmail = "", userProfilePicture = "";

const setUserDetails = (UserName, UserEmail, UserProfilePicture) => {
    userName = UserName, userEmail = UserEmail, userProfilePicture = UserProfilePicture;
}

const getUserName = () => {
    return userName;
}

const getUserEmail = () => {
    return userEmail;
}

const getUserProfilePicture = () => {
    return userProfilePicture;
}

export { setUserDetails, getUserName, getUserEmail, getUserProfilePicture };