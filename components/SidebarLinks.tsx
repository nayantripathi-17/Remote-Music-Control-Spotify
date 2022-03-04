import { SidebarLinksProps } from "../types"

function SidebarLinks({ component, clickHandler }: SidebarLinksProps) {
    return (
        <p className="cursor-pointer hover:text-white 
            flex items-center"
            onClick={clickHandler}
        >
            {component}
        </p>
    )
}

export default SidebarLinks