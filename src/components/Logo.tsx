import LogoSVG from "../../images/logos/logo.svg"
import Link from "next/link";
import { AspectRatio } from "./ui/aspect-ratio";
import Image from "next/image";

function Logo() {
    return <Link href="/" prefetch={false} className="overflow-hidden">
        <div className="flex items-center w-72 h-10">
        <AspectRatio ratio={16/9}
        className="flex items-center justify-center">
            <Image  priority src={LogoSVG} alt="Logo" height="60" className="dark:filter dark:invert" />
        </AspectRatio>
        </div>
    </Link>
}

export default Logo;