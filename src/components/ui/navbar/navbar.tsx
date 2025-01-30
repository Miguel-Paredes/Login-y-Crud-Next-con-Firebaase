import { ProfileDropdown } from "@/components/profile-dropdown"
import { Title } from "../title/Title"

export const NavBar = () => {
    return(
        <div className="flex justify-between mx-6 mb-10 lg:mx-10 py-6 border-b border-solid border-gray-200 md:border-b-0">
            <Title title="Dashboard"/>
            <div className="md:mr-10 pt-5">
                <ProfileDropdown/>
            </div>
        </div>
    )
}