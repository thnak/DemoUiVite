import { CONFIG } from 'src/config-global';
import {
  _userProfile,
  _userProfilePosts,
  _userProfileFriends,
  _userProfileGallery,
  _userProfileFollowers,
} from 'src/_mock';

import { UserProfileView } from 'src/sections/user-profile/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`User Profile - ${CONFIG.appName}`}</title>

      <UserProfileView
        profile={_userProfile}
        followers={_userProfileFollowers}
        friends={_userProfileFriends}
        gallery={_userProfileGallery}
        posts={_userProfilePosts}
      />
    </>
  );
}
