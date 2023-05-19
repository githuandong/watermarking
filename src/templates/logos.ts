import NIKON from "@/assets/logo/Nikon.png";
import NIKON2 from "@/assets/logo/Nikon-2.png";
import FUJIFILM from "@/assets/logo/FUJIFILM.png";
import SONY from "@/assets/logo/SONY.png";
import CANON from "@/assets/logo/Canon.png";
import HASSELBLAD from "@/assets/logo/HASSELBLAD.png";
import HASSELBLAD1 from "@/assets/logo/HASSELBLAD-1.png";
import HASSELBLAD2 from "@/assets/logo/HASSELBLAD-2.png";
import KODAK from "@/assets/logo/Kodak.png";
import LUMIX from "@/assets/logo/LUMIX.png";
import LEICA from "@/assets/logo/LEICA.png";
import OLYMPUS from "@/assets/logo/OLYMPUS-B.png";
import PENTAX from "@/assets/logo/Pentax.png";

export const logos: Record<string, string> = {
  NIKON,
  NIKON2,
  FUJIFILM,
  SONY,
  CANON,
  HASSELBLAD,
  HASSELBLAD1,
  HASSELBLAD2,
  KODAK,
  LUMIX,
  LEICA,
  OLYMPUS,
  PENTAX,
};

// 获取icon对应的本地文件地址
export const getMakeLogo = (name: string) => {
  name = name.toUpperCase();
  if (logos[name]) {
    return logos[name];
  } else {
    return logos["NIKON"];
  }
};
