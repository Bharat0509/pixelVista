import ProfilePage from "@/app/components/ProfilePage";
import { getUserProjects } from "@/lib/action";
import { UserProfile } from "@/typing";

const UserProfile = async ({ params: { id } }: { params: { id: string } }) => {
    const res = (await getUserProjects(id, 100)) as { user: UserProfile };
    if (!res.user) {
        return <p className='no-result-text'>Failed to fetch user info</p>;
    }
    return <ProfilePage user={res.user} />;
};
export default UserProfile;
