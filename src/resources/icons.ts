import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { HiOutlineMapPin, HiOutlinePhone } from "react-icons/hi2";

// Icons beyond Once UI's built-ins. Register the names below so IconName type-checks them.
export const customIcons = {
  github: FaGithub,
  linkedin: FaLinkedin,
  mapPin: HiOutlineMapPin,
  phone: HiOutlinePhone,
};

declare module "@once-ui-system/core" {
  interface IconLibraryOverrides {
    github: true;
    linkedin: true;
    mapPin: true;
    phone: true;
  }
}
